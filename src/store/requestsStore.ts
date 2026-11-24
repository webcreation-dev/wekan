// ─── Demandes, conversations & lieux enregistrés (mode démo, en mémoire) ─────
// Une demande = une conversation : le vocal et le texte saisis à la création
// deviennent les premiers messages, et le client complète ensuite dans le chat.

import { create } from 'zustand'
import { RequestLocation, RequestMessage, SavedPlace, ServiceRequest } from '@/types'

/** Vocal ou texte envoyé par le client à l'étape 2 (devient un message de la conversation). */
export type DraftMessage = Pick<RequestMessage, 'text' | 'voiceNote'>

interface NewRequest {
  serviceId: string
  serviceName: string
  serviceImage: string
  location: RequestLocation | null
  messages: DraftMessage[]
}

interface RequestsStore {
  requests: ServiceRequest[]
  savedPlaces: SavedPlace[]
  createRequest: (input: NewRequest) => ServiceRequest
  sendMessage: (requestId: string, message: Pick<RequestMessage, 'text' | 'voiceNote'>) => void
  markRead: (requestId: string) => void
  savePlace: (place: RequestLocation) => SavedPlace
  removePlace: (id: string) => void
}

export const WEKAN_AGENT = { name: 'Service client Wekan', avatar: '/favicon.png' }

const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1037', ref: 'DEM-1037', serviceId: 'plomberie', serviceName: 'Plombier', serviceImage: '/plomberie.jpeg',
    createdAt: 'Hier, 18:20', location: { label: 'Domicile', lat: 6.3654, lng: 2.4183 },
    description: 'Fuite sous l’évier de la cuisine, l’eau coule en continu.',
    status: 'scheduled', date: 'Demain', time: '10:00', price: 15000,
    providerName: 'Alex Migan', providerAvatar: '/plom1.jpeg',
    unread: 2,
    messages: [
      { id: 'm1', sender: 'user', time: 'Hier', text: 'Fuite sous l’évier de la cuisine, l’eau coule en continu.' },
      { id: 'm2', sender: 'agent', time: 'Hier', text: 'Bonjour ! Votre demande a bien été reçue. Un agent va vous appeler dans un instant.' },
      { id: 'm3', sender: 'agent', time: 'Hier', text: 'Suite à notre appel : intervention prévue demain à 10:00 avec Alex Migan, pour 15 000 FCFA.' },
      { id: 'm4', sender: 'agent', time: '09:30', text: 'Alex sera chez vous à l’heure. Pensez à couper l’arrivée d’eau en attendant.' },
    ],
  },
  {
    id: 'req-1019', ref: 'DEM-1019', serviceId: 'nettoyage', serviceName: 'Nettoyage', serviceImage: '/nettoyage.jpeg',
    createdAt: '18 Mar', location: { label: 'Bureau', lat: 6.37, lng: 2.422 },
    description: 'Nettoyage complet de l’appartement avant emménagement.',
    status: 'completed', date: '18 Mar 2025', time: '09:00', price: 25000,
    providerName: 'Sophie Adjovi', providerAvatar: '/nettoy1.jpeg',
    unread: 0,
    messages: [
      { id: 'm1', sender: 'user', time: '17 Mar', text: 'Nettoyage complet de l’appartement avant emménagement.' },
      { id: 'm2', sender: 'agent', time: '17 Mar', text: 'Bonjour ! Votre demande a bien été reçue. Un agent va vous appeler dans un instant.' },
      { id: 'm3', sender: 'agent', time: '18 Mar', text: 'Intervention terminée. Merci pour votre confiance !' },
    ],
  },
]

const SEED_PLACES: SavedPlace[] = [
  { id: 'place-home', label: 'Domicile', lat: 6.3654, lng: 2.4183 },
]

function clock() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

let messageSeq = 0
const newId = () => `msg-${Date.now()}-${messageSeq++}`

export const useRequestsStore = create<RequestsStore>((set, get) => ({
  requests: SEED_REQUESTS,
  savedPlaces: SEED_PLACES,

  createRequest: ({ messages: drafts, ...input }) => {
    const number = 1043 + get().requests.filter(r => r.status === 'awaiting_call').length
    const time = clock()
    // Tous les vocaux et messages de l'étape 2, dans l'ordre, puis l'accusé de réception
    const messages: RequestMessage[] = drafts.map(d => ({ id: newId(), sender: 'user', time, ...d }))
    const texts = drafts.map(d => d.text).filter(Boolean)
    messages.push({
      id: newId(), sender: 'agent', time,
      text: 'Bonjour ! Votre demande a bien été reçue. Un agent va vous appeler dans un instant. Vous pouvez compléter les informations ici.',
    })

    const request: ServiceRequest = {
      ...input,
      voiceNote: drafts.find(d => d.voiceNote)?.voiceNote,
      description: texts.length ? texts.join('\n') : undefined,
      id: `req-${Date.now()}`,
      ref: `DEM-${number}`,
      createdAt: `Aujourd'hui, ${time}`,
      status: 'awaiting_call',
      messages,
      unread: 1,
    }
    set(state => ({ requests: [request, ...state.requests] }))
    return request
  },

  sendMessage: (requestId, message) =>
    set(state => ({
      requests: state.requests.map(r =>
        r.id === requestId ? { ...r, messages: [...r.messages, { id: newId(), sender: 'user', time: clock(), ...message }] } : r,
      ),
    })),

  markRead: requestId =>
    set(state => ({ requests: state.requests.map(r => (r.id === requestId && r.unread ? { ...r, unread: 0 } : r)) })),

  savePlace: place => {
    const saved: SavedPlace = { ...place, id: `place-${Date.now()}` }
    set(state => ({ savedPlaces: [...state.savedPlaces, saved] }))
    return saved
  },

  removePlace: id => set(state => ({ savedPlaces: state.savedPlaces.filter(p => p.id !== id) })),
}))

/** Nombre total de messages non lus (badge du menu). */
export const selectUnreadTotal = (state: RequestsStore) => state.requests.reduce((sum, r) => sum + r.unread, 0)
