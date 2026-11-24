import 'server-only'
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'
import type { User } from '@prisma/client'
import { db } from './db'
import { ApiError } from './http'

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keylen: number) => Promise<Buffer>

export const SESSION_COOKIE = 'wekan_session'
const SESSION_DAYS = 30

// ── Mots de passe (scrypt + sel) ──────────────────────────────────────────────
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, 64)
  return `${salt}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, keyHex] = stored.split(':')
  if (!salt || !keyHex) return false
  const key = await scryptAsync(password, salt, 64)
  const expected = Buffer.from(keyHex, 'hex')
  return expected.length === key.length && timingSafeEqual(expected, key)
}

// ── Sessions (jeton aléatoire en cookie httpOnly, seul son hash est en base) ──
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000)
  await db.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } })
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } })
  cookies().delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await db.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
  if (!session || session.expiresAt < new Date()) return null
  return session.user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new ApiError(401, 'Veuillez vous connecter.')
  return user
}

export async function requireAgent() {
  const user = await requireUser()
  if (user.role !== 'agent') throw new ApiError(403, 'Accès réservé aux agents.')
  return user
}

/** Forme renvoyée au client (jamais le hash du mot de passe). */
export function publicUser(user: User) {
  return { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role }
}
