import { MOCK_SERVICES } from '@/data/mock'

export type TradeFilter = 'Construction' | 'Technique' | 'Décoration'

export interface Trade {
  id: string
  label: string
  filter: TradeFilter | null // null = toujours visible (« Autre »)
  image?: string
  collage?: string[]         // mosaïque de photos (pour « Autre »)
}

/** Métiers affichés sur l'accueil. « Autre » ouvre la liste complète des services. */
export const TRADES: Trade[] = [
  { id: 'plomberie',   label: 'Plombier',    filter: 'Technique',    image: '/plomberie.jpeg' },
  { id: 'electricite', label: 'Électricien', filter: 'Technique',    image: '/electricite.jpeg' },
  { id: 'peinture',    label: 'Peintre',     filter: 'Décoration',   image: '/peinture.jpeg' },
  { id: 'menuiserie',  label: 'Menuisier',   filter: 'Construction', image: '/meuniserie.jpeg' },
  { id: 'maconnerie',  label: 'Maçon',       filter: 'Construction', image: '/maconnerie.jpeg' },
  { id: 'staffeur',    label: 'Staffeur',    filter: 'Décoration',   image: '/staffeur.jpg' },
  { id: 'vitrier',     label: 'Vitrier',     filter: 'Construction', image: '/vitrier.jpg' },
  { id: 'autre',       label: 'Autre',       filter: null,           collage: ['/clim.jpeg', '/nettoyage.jpeg', '/mecanique.jpeg', '/informatique.jpeg'] },
]

/** Nom et image d'un service pour le parcours de demande (métier de l'accueil ou service du catalogue). */
export function getRequestService(id: string): { id: string; name: string; image: string } {
  const trade = TRADES.find(t => t.id === id && t.image)
  if (trade) return { id, name: trade.label, image: trade.image! }
  const service = MOCK_SERVICES.find(s => s.id === id)
  if (service) return { id, name: service.name, image: service.image }
  return { id, name: 'Service', image: '/logo.png' }
}
