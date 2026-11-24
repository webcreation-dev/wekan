import 'server-only'
import { ApiError } from './http'

/** Numéro béninois : on garde uniquement les chiffres (ex. « 0197123456 »). */
export function normalizePhone(value: unknown) {
  const digits = typeof value === 'string' ? value.replace(/\D/g, '') : ''
  const local = digits.startsWith('229') && digits.length > 10 ? digits.slice(3) : digits
  if (local.length < 8 || local.length > 12) throw new ApiError(400, 'Numéro de téléphone invalide.')
  return local
}
