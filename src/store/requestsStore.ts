// ─── Demandes, conversations & lieux enregistrés (branchés sur /api) ─────────
// Une demande = une conversation : les vocaux et messages saisis à la création
// deviennent les premiers messages, et le client complète ensuite dans le chat.

import { create } from 'zustand'
import { PaymentOperator, RequestLocation, RequestMessage, RequestPayment, SavedPlace, ServiceRequest } from '@/types'
import { api } from '@/lib/api-client'
import type { VoiceNoteData } from '@/components/ui/VoiceNote'

/** Vocal ou texte envoyé par le client (étape 2 ou conversation). */
export interface DraftMessage {
  text?: string
  voiceNote?: VoiceNoteData
}

interface NewRequest {
  serviceId: string
  location: RequestLocation | null
  messages: DraftMessage[]
}

interface RequestsStore {
  requests: ServiceRequest[]
  savedPlaces: SavedPlace[]
  loaded: boolean
  loadRequests: () => Promise<void>
  loadRequest: (id: string) => Promise<void>
  loadPlaces: () => Promise<void>
  createRequest: (input: NewRequest) => Promise<ServiceRequest>
  sendMessage: (requestId: string, message: DraftMessage) => Promise<void>
  markRead: (requestId: string) => Promise<void>
  savePlace: (place: RequestLocation) => Promise<SavedPlace>
  removePlace: (id: string) => Promise<void>
  startPayment: (requestId: string, input: { amount: number; operator: PaymentOperator; msisdn: string }) => Promise<RequestPayment>
  getPayment: (paymentId: string) => Promise<RequestPayment>
  reset: () => void
}

export const WEKAN_AGENT = { name: 'Service client Wekan', avatar: '/favicon.png' }

/** Envoie le fichier audio d'un vocal et renvoie son identifiant serveur. */
async function uploadVoice(note: VoiceNoteData) {
  if (!note.blob) throw new Error('Vocal introuvable, réenregistrez-le.')
  const form = new FormData()
  form.append('audio', note.blob, 'vocal')
  form.append('durationSec', String(note.durationSec))
  form.append('waveform', JSON.stringify(note.waveform ?? []))
  const { voice } = await api<{ voice: { id: string } }>('/voices', { method: 'POST', body: form })
  return voice.id
}

async function toPayload(message: DraftMessage) {
  return message.voiceNote ? { voiceId: await uploadVoice(message.voiceNote) } : { text: message.text }
}

const upsert = (list: ServiceRequest[], request: ServiceRequest) =>
  list.some(r => r.id === request.id) ? list.map(r => (r.id === request.id ? request : r)) : [request, ...list]

export const useRequestsStore = create<RequestsStore>((set, get) => ({
  requests: [],
  savedPlaces: [],
  loaded: false,

  loadRequests: async () => {
    try {
      const { requests } = await api<{ requests: ServiceRequest[] }>('/requests')
      set({ requests, loaded: true })
    } catch {
      set({ requests: [], loaded: true }) // non connecté
    }
  },

  loadRequest: async id => {
    const { request } = await api<{ request: ServiceRequest }>(`/requests/${id}`)
    set(state => ({ requests: upsert(state.requests, request) }))
  },

  loadPlaces: async () => {
    try {
      const { places } = await api<{ places: SavedPlace[] }>('/places')
      set({ savedPlaces: places })
    } catch {
      set({ savedPlaces: [] })
    }
  },

  createRequest: async ({ serviceId, location, messages }) => {
    // Les vocaux sont envoyés d'abord, dans l'ordre, puis la demande
    const payload = []
    for (const message of messages) payload.push(await toPayload(message))
    const { request } = await api<{ request: ServiceRequest }>('/requests', {
      method: 'POST',
      json: { serviceId, location, messages: payload },
    })
    set(state => ({ requests: upsert(state.requests, request) }))
    return request
  },

  sendMessage: async (requestId, message) => {
    const body = await toPayload(message)
    const { message: saved } = await api<{ message: RequestMessage }>(`/requests/${requestId}/messages`, { method: 'POST', json: body })
    set(state => ({
      requests: state.requests.map(r => (r.id === requestId ? { ...r, messages: [...r.messages, saved] } : r)),
    }))
  },

  markRead: async requestId => {
    if (!get().requests.find(r => r.id === requestId)?.unread) return
    set(state => ({ requests: state.requests.map(r => (r.id === requestId ? { ...r, unread: 0 } : r)) }))
    await api(`/requests/${requestId}/read`, { method: 'POST' }).catch(() => {})
  },

  savePlace: async place => {
    const { place: saved } = await api<{ place: SavedPlace }>('/places', { method: 'POST', json: place })
    set(state => ({ savedPlaces: [...state.savedPlaces, saved] }))
    return saved
  },

  removePlace: async id => {
    await api(`/places/${id}`, { method: 'DELETE' })
    set(state => ({ savedPlaces: state.savedPlaces.filter(p => p.id !== id) }))
  },

  startPayment: async (requestId, input) => {
    const { payment } = await api<{ payment: RequestPayment }>(`/requests/${requestId}/payments`, { method: 'POST', json: input })
    return payment
  },

  getPayment: async paymentId => {
    const { payment } = await api<{ payment: RequestPayment }>(`/payments/${paymentId}`)
    return payment
  },

  reset: () => set({ requests: [], savedPlaces: [], loaded: false }),
}))

/** Nombre total de messages non lus (badge du menu). */
export const selectUnreadTotal = (state: RequestsStore) => state.requests.reduce((sum, r) => sum + r.unread, 0)
