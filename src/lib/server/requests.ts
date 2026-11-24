import 'server-only'
import type { Message, Request, Voice } from '@prisma/client'
import type { RequestMessage, ServiceRequest } from '@/types'
import { db } from './db'
import { ApiError } from './http'

type MessageWithVoice = Message & { voice: Voice | null }
type RequestWithMessages = Request & { messages: MessageWithVoice[]; payments?: { amount: number }[] }

const TIME = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Porto-Novo' })
const DAY = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'Africa/Porto-Novo' })
const dayKey = (d: Date) => DAY.format(d) + d.getUTCFullYear()

/** « 14:05 » aujourd'hui, « Hier », sinon « 18 mars ». */
export function shortTime(d: Date) {
  const now = new Date()
  if (dayKey(d) === dayKey(now)) return TIME.format(d)
  if (dayKey(d) === dayKey(new Date(now.getTime() - 86400000))) return 'Hier'
  return DAY.format(d)
}

function createdLabel(d: Date) {
  const t = shortTime(d)
  return t.includes(':') ? `Aujourd'hui, ${t}` : t === 'Hier' ? `Hier, ${TIME.format(d)}` : t
}

export function toMessageDto(m: MessageWithVoice): RequestMessage {
  return {
    id: m.id,
    sender: m.sender as RequestMessage['sender'],
    time: shortTime(m.createdAt),
    text: m.text ?? undefined,
    voiceNote: m.voice
      ? { url: `/api/voices/${m.voice.id}`, durationSec: m.voice.durationSec, waveform: JSON.parse(m.voice.waveform) }
      : undefined,
  }
}

/** Convertit une demande (et ses messages) au format utilisé par l'interface. */
export function toRequestDto(r: RequestWithMessages, viewer: 'client' | 'agent' = 'client'): ServiceRequest {
  const messages = r.messages.map(toMessageDto)
  const userMessages = r.messages.filter(m => m.sender === 'user')
  const firstVoice = userMessages.find(m => m.voice)
  const texts = userMessages.map(m => m.text).filter(Boolean)
  return {
    id: r.id,
    ref: `DEM-${r.number}`,
    serviceId: r.serviceId,
    serviceName: r.serviceName,
    serviceImage: r.serviceImage,
    createdAt: createdLabel(r.createdAt),
    location: r.locationLabel && r.lat != null && r.lng != null ? { label: r.locationLabel, lat: r.lat, lng: r.lng } : null,
    voiceNote: firstVoice ? toMessageDto(firstVoice).voiceNote : undefined,
    description: texts.length ? texts.join('\n') : undefined,
    status: r.status as ServiceRequest['status'],
    date: r.date ?? undefined,
    time: r.time ?? undefined,
    price: r.price ?? undefined,
    providerName: r.providerName ?? undefined,
    providerAvatar: r.providerAvatar ?? undefined,
    paidAmount: (r.payments ?? []).reduce((sum, p) => sum + p.amount, 0),
    messages,
    unread: viewer === 'client' ? r.clientUnread : r.agentUnread,
  }
}

export const withMessages = {
  messages: { orderBy: { createdAt: 'asc' as const }, include: { voice: true } },
  payments: { where: { status: 'succeeded' }, select: { amount: true } },
}

/** Récupère une demande en vérifiant que l'utilisateur y a accès. */
export async function findAccessibleRequest(id: string, user: { id: string; role: string }) {
  const request = await db.request.findUnique({ where: { id }, include: withMessages })
  if (!request || (user.role !== 'agent' && request.userId !== user.id)) throw new ApiError(404, 'Demande introuvable.')
  return request
}

/** Vérifie qu'un vocal appartient bien à l'utilisateur avant de l'attacher à un message. */
export async function assertOwnVoice(voiceId: string, userId: string) {
  const voice = await db.voice.findUnique({ where: { id: voiceId } })
  if (!voice || voice.userId !== userId) throw new ApiError(400, 'Vocal invalide.')
}
