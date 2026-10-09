// ─── App Configuration ─────────────────────────────────────────────────────
// Centralize all env-based config here.
// Usage: import { config } from '@/config/app'

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.homefix.app/v1',
    timeout: 10_000,
  },
  app: {
    name: 'HomeFix',
    version: '2.4.0',
    currency: 'FCFA',
    locale: 'fr-FR',
  },
  map: {
    defaultCenter: { lat: 6.3654, lng: 2.4183 }, // Cotonou
  },
} as const

export type Config = typeof config
