import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler, readJson, str } from '@/lib/server/http'
import { assertOwnVoice, toRequestDto, withMessages } from '@/lib/server/requests'
import { getRequestService } from '@/data/trades'

export const dynamic = 'force-dynamic'

const ACK = 'Bonjour ! Votre demande a bien été reçue. Un agent va vous appeler dans un instant. Vous pouvez compléter les informations ici.'

/** Mes demandes (et leurs conversations), les plus récentes d'abord. */
export const GET = handler(async () => {
  const user = await requireUser()
  const requests = await db.request.findMany({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' }, include: withMessages })
  return NextResponse.json({ requests: requests.map(r => toRequestDto(r)) })
})

/**
 * Création d'une demande.
 * Corps : { serviceId, location: { label, lat, lng } | null, messages: [{ text } | { voiceId }] }
 * Les vocaux sont envoyés au préalable via POST /api/voices.
 */
export const POST = handler(async (req: Request) => {
  const user = await requireUser()
  const body = await readJson<{ serviceId?: unknown; location?: unknown; messages?: unknown }>(req)

  const service = getRequestService(str(body.serviceId, 40))
  if (service.name === 'Service') throw new ApiError(400, 'Service inconnu.')

  const loc = body.location as { label?: unknown; lat?: unknown; lng?: unknown } | null | undefined
  const location = loc && Number.isFinite(Number(loc.lat)) && Number.isFinite(Number(loc.lng))
    ? { label: str(loc.label, 40) || 'Position actuelle', lat: Number(loc.lat), lng: Number(loc.lng) }
    : null

  const rawMessages = Array.isArray(body.messages) ? body.messages.slice(0, 30) : []
  const messages: { text?: string; voiceId?: string }[] = []
  for (const m of rawMessages as { text?: unknown; voiceId?: unknown }[]) {
    const text = str(m?.text, 2000)
    const voiceId = str(m?.voiceId, 40)
    if (voiceId) { await assertOwnVoice(voiceId, user.id); messages.push({ voiceId }) }
    else if (text) messages.push({ text })
  }
  if (!messages.length) throw new ApiError(400, 'Ajoutez un vocal ou un message pour décrire votre souci.')

  const created = await db.$transaction(async tx => {
    const last = await tx.request.findFirst({ orderBy: { number: 'desc' }, select: { number: true } })
    const request = await tx.request.create({
      data: {
        number: (last?.number ?? 1000) + 1,
        userId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        serviceImage: service.image,
        locationLabel: location?.label,
        lat: location?.lat,
        lng: location?.lng,
        agentUnread: messages.length,
        clientUnread: 1,
      },
    })
    // Messages du client (dans l'ordre), puis accusé de réception
    const base = Date.now()
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i]
      await tx.message.create({ data: { requestId: request.id, sender: 'user', text: m.text, voiceId: m.voiceId, createdAt: new Date(base + i) } })
    }
    await tx.message.create({ data: { requestId: request.id, sender: 'agent', text: ACK, createdAt: new Date(base + messages.length) } })
    return tx.request.findUniqueOrThrow({ where: { id: request.id }, include: withMessages })
  })

  return NextResponse.json({ request: toRequestDto(created) }, { status: 201 })
})
