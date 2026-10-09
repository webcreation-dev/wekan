// ─── HomeFix — Shared Types ───────────────────────────────────────────────────

export type Screen =
  | 'splash'
  | 'login'
  | 'register'
  | 'home'
  | 'all-services'
  | 'service-detail'
  | 'payment'
  | 'provider-tracking'
  | 'conversations'
  | 'chat'
  | 'invoice'
  | 'rdv'
  | 'profil'
  | 'notifications'
  | 'aide'
  | 'confidentialite'
  | 'parametres-notif'
  | 'adresses'

export interface Service {
  id: string
  name: string
  icon: string
  image: string
  description: string
  category: string
  basePrice?: number
  available?: boolean
}

export interface ServiceOption {
  id: string
  title: string
  description: string
  price?: number
}

export interface PromoBanner {
  id: string
  badge: string
  badgeColor: string
  title: string
  subtitle: string
  image: string
  serviceId?: string
}

export interface Provider {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  reviewCount: number
  verified: boolean
  online?: boolean
  eta?: string
  price?: string
  distance?: string
  service?: string
  lat?: number
  lng?: number
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  service: string
  serviceId: string
  providerName: string
  providerRole: string
  providerAvatar: string
  date: string
  time: string
  status: AppointmentStatus
  price: string
  address: string
}

export interface Conversation {
  id: string
  providerName: string
  providerRole: string
  providerAvatar: string
  online: boolean
  lastMessage: string
  lastTime: string
  unread: number
  serviceType: string
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'provider'
  time: string
  image?: string
  read?: boolean
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'promo' | 'warning'
  title: string
  body: string
  time: string
  read: boolean
  serviceId?: string
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  service: string
  date: string
}

export interface Realisation {
  id: string
  title: string
  serviceId: string
  serviceName: string
  image: string
  location: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  avatar?: string
  isPremium?: boolean
}

export type PaymentMethod = 'orange_money' | 'wave' | 'card'

export interface InvoiceLine {
  label: string
  sublabel?: string
  amount: number
}

export interface Invoice {
  id: string
  reference: string
  providerName: string
  providerRole: string
  providerAvatar: string
  missionNumber: string
  date: string
  paymentMethod: string
  laborLines: InvoiceLine[]
  materialLines: InvoiceLine[]
  subtotalLabor: number
  subtotalMaterials: number
  taxRate: number
  total: number
}

export interface AuthPayload {
  firstName: string
  lastName: string
  phone: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
