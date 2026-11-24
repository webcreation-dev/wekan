import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireAgent } from '@/lib/server/auth'
import { ApiError, handler, readJson, str } from '@/lib/server/http'
import { toRequestDto, withMessages } from '@/lib/server/requests'

const STATUSES = ['awaiting_call', 'scheduled', 'completed', 'cancelled']

/**
 * Après l'appel : l'agent fixe la date, l'heure, le prix et le prestataire.
 * Corps (tous facultatifs) : { status, date, time, price, providerName, providerAvatar }
 * Si date et prix sont fournis sans statut, la demande passe à « scheduled ».
 */
export const PATCH = handler(async (req: Request, { params }: { params: { id: string } }) => {
  await requireAgent()
  const body = await readJson(req)
  const data: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!STATUSES.includes(String(body.status))) throw new ApiError(400, 'Statut invalide.')
    data.status = body.status
  }
  if (body.date !== undefined) data.date = str(body.date, 40) || null
  if (body.time !== undefined) {
    const time = str(body.time, 5)
    if (time && !/^\d{2}:\d{2}$/.test(time)) throw new ApiError(400, 'Heure invalide (HH:MM).')
    data.time = time || null
  }
  if (body.price !== undefined) {
    const price = body.price === null ? null : Math.round(Number(body.price))
    if (price !== null && (!Number.isFinite(price) || price < 0)) throw new ApiError(400, 'Prix invalide.')
    data.price = price
  }
  if (body.providerName !== undefined) data.providerName = str(body.providerName, 80) || null
  if (body.providerAvatar !== undefined) data.providerAvatar = str(body.providerAvatar, 300) || null
  if (!data.status && data.date && data.price != null) data.status = 'scheduled'

  const before = await db.request.findUnique({ where: { id: params.id } })
  if (!before) throw new ApiError(404, 'Demande introuvable.')
  await db.request.update({ where: { id: params.id }, data })

  // Le client est prévenu dans la conversation de sa demande
  const after = { ...before, ...data } as typeof before
  const notice = clientNotice(before, after)
  if (notice) {
    await db.$transaction([
      db.message.create({ data: { requestId: before.id, sender: 'agent', text: notice } }),
      db.request.update({ where: { id: before.id }, data: { clientUnread: { increment: 1 } } }),
    ])
  }

  const request = await db.request.findUniqueOrThrow({ where: { id: params.id }, include: withMessages })
  return NextResponse.json({ request: toRequestDto(request, 'agent') })
})

type RequestRow = { status: string; date: string | null; time: string | null; price: number | null; providerName: string | null }

/** Message automatique envoyé au client quand la planification ou le statut change. */
function clientNotice(before: RequestRow, after: RequestRow): string | null {
  if (after.status !== before.status && after.status === 'completed') return 'Votre intervention est terminée. Merci d’avoir fait confiance à Wekan !'
  if (after.status !== before.status && after.status === 'cancelled') return 'Votre demande a été annulée. Contactez-nous ici si besoin.'
  const planChanged = after.date !== before.date || after.time !== before.time || after.price !== before.price || after.providerName !== before.providerName
  if (after.status !== 'scheduled' || (!planChanged && before.status === 'scheduled')) return null
  const lines = [`${before.status === 'scheduled' ? 'Mise à jour de votre intervention' : 'Votre intervention est planifiée'} : ${after.date ?? 'date à confirmer'}${after.time ? ` à ${after.time}` : ''}.`]
  if (after.price != null) lines.push(`Prix convenu : ${after.price.toLocaleString('fr-FR')} FCFA. Vous pouvez payer une avance depuis « Mes demandes ».`)
  if (after.providerName) lines.push(`Artisan : ${after.providerName}.`)
  return lines.join('\n')
}
