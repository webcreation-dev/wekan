import 'server-only'
import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

/** Enveloppe un handler : transforme les erreurs en réponses JSON propres. */
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch (err) {
      if (err instanceof ApiError) return NextResponse.json({ error: err.message }, { status: err.status })
      console.error(err)
      return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 })
    }
  }
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T
  } catch {
    throw new ApiError(400, 'Corps de requête invalide.')
  }
}

export const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
