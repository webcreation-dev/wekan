// ─── API Service Layer ────────────────────────────────────────────────────────
// Every API call goes through here.
// Swap mock data for real http calls by replacing the functions below.
// The rest of the app doesn't change — hooks and screens stay the same.

import { http } from '@/lib/http'
import {
  Service, Provider, Appointment, Message,
  AuthPayload, AuthResponse, Invoice, PromoBanner
} from '@/types'
import {
  MOCK_SERVICES, MOCK_BANNERS, MOCK_PROVIDER,
  MOCK_CHAT_PROVIDER, MOCK_MESSAGES, MOCK_APPOINTMENTS,
  MOCK_INVOICE, MOCK_NETTOYAGE_OPTIONS,
} from '@/data/mock'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Simulate network latency in development
const delay = (ms = 400) =>
  new Promise<void>((res) => setTimeout(res, ms))

// The preview works without a backend. Set NEXT_PUBLIC_USE_MOCK=false only once
// NEXT_PUBLIC_API_URL points to the production API.
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'
let mockAppointments = [...MOCK_APPOINTMENTS]

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: async (payload: AuthPayload): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await delay()
      return {
        user: { id: 'u1', firstName: payload.firstName, lastName: payload.lastName, phone: payload.phone ?? '' },
        token: 'mock-token-xyz',
      }
    }
    return http.post<AuthResponse>('/auth/register', payload)
  },

  login: async (phone: string): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await delay()
      return {
        user: { id: 'u1', firstName: 'Kofi', lastName: 'Mensah', phone: '', isPremium: true },
        token: 'mock-token-xyz',
      }
    }
    return http.post<AuthResponse>('/auth/login', { phone })
  },
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    if (USE_MOCK) {
      await delay(300)
      return MOCK_SERVICES
    }
    return http.get<Service[]>('/services')
  },

  getById: async (id: string): Promise<Service> => {
    if (USE_MOCK) {
      await delay(200)
      const s = MOCK_SERVICES.find(s => s.id === id)
      if (!s) throw new Error(`Service ${id} not found`)
      return s
    }
    return http.get<Service>(`/services/${id}`)
  },

  getOptions: async (serviceId: string) => {
    if (USE_MOCK) {
      await delay(200)
      return MOCK_NETTOYAGE_OPTIONS // extend per service in mock
    }
    return http.get(`/services/${serviceId}/options`)
  },
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export const bannersApi = {
  getActive: async (): Promise<PromoBanner[]> => {
    if (USE_MOCK) {
      await delay(200)
      return MOCK_BANNERS
    }
    return http.get<PromoBanner[]>('/banners/active')
  },
}

// ─── Providers ────────────────────────────────────────────────────────────────

export const providersApi = {
  getTracking: async (providerId: string): Promise<Provider> => {
    if (USE_MOCK) {
      await delay(300)
      return MOCK_PROVIDER
    }
    return http.get<Provider>(`/providers/${providerId}/tracking`)
  },

  getChatProvider: async (providerId: string): Promise<Provider> => {
    if (USE_MOCK) {
      await delay(200)
      return MOCK_CHAT_PROVIDER
    }
    return http.get<Provider>(`/providers/${providerId}`)
  },
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    if (USE_MOCK) {
      await delay(400)
      return [...mockAppointments]
    }
    return http.get<Appointment[]>('/appointments')
  },

  create: async (payload: Partial<Appointment>): Promise<Appointment> => {
    if (USE_MOCK) {
      await delay(500)
      const appointment: Appointment = {
        ...MOCK_APPOINTMENTS[0],
        ...payload,
        id: Date.now().toString(),
      }
      mockAppointments = [appointment, ...mockAppointments]
      return appointment
    }
    return http.post<Appointment>('/appointments', payload)
  },

  cancel: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300)
      mockAppointments = mockAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
      )
      return
    }
    return http.delete(`/appointments/${id}`)
  },
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messagesApi = {
  getThread: async (providerId: string): Promise<Message[]> => {
    if (USE_MOCK) {
      await delay(300)
      return MOCK_MESSAGES
    }
    return http.get<Message[]>(`/messages/${providerId}`)
  },

  send: async (providerId: string, text: string, image?: string): Promise<Message> => {
    if (USE_MOCK) {
      await delay(200)
      return {
        id: Date.now().toString(),
        text,
        sender: 'user',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        image,
      }
    }
    return http.post<Message>(`/messages/${providerId}`, { text, image })
  },
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export const invoiceApi = {
  getById: async (id: string): Promise<Invoice> => {
    if (USE_MOCK) {
      await delay(300)
      return MOCK_INVOICE
    }
    return http.get<Invoice>(`/invoices/${id}`)
  },
}
