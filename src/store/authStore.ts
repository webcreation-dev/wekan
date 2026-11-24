// ─── Session utilisateur ─────────────────────────────────────────────────────
// Source de vérité : le serveur (cookie de session). Ce store en garde une copie.

import { create } from 'zustand'
import { User } from '@/types'
import { api } from '@/lib/api-client'

interface RegisterInput {
  firstName: string
  lastName: string
  phone: string
  password: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  /** true une fois la session vérifiée auprès du serveur */
  hydrated: boolean
  hydrate: () => Promise<void>
  signIn: (phone: string, password: string) => Promise<void>
  signUp: (input: RegisterInput) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (patch: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const { user } = await api<{ user: User | null }>('/auth/me')
      set({ user, isAuthenticated: !!user, hydrated: true })
    } catch {
      set({ user: null, isAuthenticated: false, hydrated: true })
    }
  },

  signIn: async (phone, password) => {
    const { user } = await api<{ user: User }>('/auth/login', { method: 'POST', json: { phone, password } })
    set({ user, isAuthenticated: true })
  },

  signUp: async input => {
    const { user } = await api<{ user: User }>('/auth/register', { method: 'POST', json: input })
    set({ user, isAuthenticated: true })
  },

  signOut: async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    set({ user: null, isAuthenticated: false })
  },

  updateUser: (patch) =>
    set((state) => ({ user: state.user ? { ...state.user, ...patch } : null })),
}))
