import 'server-only'
import { randomBytes } from 'crypto'
import { ApiError } from './http'

// ─── Prestataire Mobile Money ────────────────────────────────────────────────
// PAYMENT_PROVIDER=simulation (défaut en développement) : aucun argent ne bouge,
// le paiement est validé automatiquement après quelques secondes.
// Pour la production, implémenter `initiate` et `check` avec l'API du
// prestataire (FedaPay, Kkiapay, MTN MoMo…) : le reste du code ne change pas.

export type Operator = 'MTN' | 'MOOV' | 'CELTIIS'
export const OPERATORS: Operator[] = ['MTN', 'MOOV', 'CELTIIS']

const SIMULATION_DELAY_MS = 6000
const provider = process.env.PAYMENT_PROVIDER ?? 'simulation'

export const isSimulation = provider === 'simulation'

/** Lance la demande de paiement (le client valide sur son téléphone). Renvoie la référence prestataire. */
export async function initiate(_input: { amount: number; operator: Operator; msisdn: string }): Promise<string> {
  if (isSimulation) return `SIM-${randomBytes(6).toString('hex')}`
  throw new ApiError(501, 'Le paiement Mobile Money n’est pas encore configuré.')
}

/** Interroge le prestataire sur l'état d'un paiement. */
export async function check(payment: { providerRef: string | null; createdAt: Date }): Promise<'pending' | 'succeeded' | 'failed'> {
  if (isSimulation) return Date.now() - payment.createdAt.getTime() >= SIMULATION_DELAY_MS ? 'succeeded' : 'pending'
  throw new ApiError(501, 'Le paiement Mobile Money n’est pas encore configuré.')
}
