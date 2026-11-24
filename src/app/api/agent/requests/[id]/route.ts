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

  const exists = await db.request.findUnique({ where: { id: params.id }, select: { id: true } })
  if (!exists) throw new ApiError(404, 'Demande introuvable.')
  const request = await db.request.update({ where: { id: params.id }, data, include: withMessages })
  return NextResponse.json({ request: toRequestDto(request, 'agent') })
})
