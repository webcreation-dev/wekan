import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { createSession, publicUser, verifyPassword } from '@/lib/server/auth'
import { ApiError, handler, readJson } from '@/lib/server/http'
import { normalizePhone } from '@/lib/server/phone'

export const POST = handler(async (req: Request) => {
  const body = await readJson(req)
  const phone = normalizePhone(body.phone)
  const password = typeof body.password === 'string' ? body.password : ''

  const user = await db.user.findUnique({ where: { phone } })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Numéro ou mot de passe incorrect.')
  }
  await createSession(user.id)
  return NextResponse.json({ user: publicUser(user) })
})
