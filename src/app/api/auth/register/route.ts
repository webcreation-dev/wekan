import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { createSession, hashPassword, publicUser } from '@/lib/server/auth'
import { ApiError, handler, readJson, str } from '@/lib/server/http'
import { normalizePhone } from '@/lib/server/phone'

export const POST = handler(async (req: Request) => {
  const body = await readJson(req)
  const firstName = str(body.firstName, 60)
  const lastName = str(body.lastName, 60)
  const phone = normalizePhone(body.phone)
  const password = typeof body.password === 'string' ? body.password : ''

  if (!firstName) throw new ApiError(400, 'Le prénom est obligatoire.')
  if (password.length < 6) throw new ApiError(400, 'Le mot de passe doit contenir au moins 6 caractères.')
  if (await db.user.findUnique({ where: { phone } })) throw new ApiError(409, 'Un compte existe déjà avec ce numéro.')

  const user = await db.user.create({ data: { firstName, lastName, phone, passwordHash: await hashPassword(password) } })
  await createSession(user.id)
  return NextResponse.json({ user: publicUser(user) }, { status: 201 })
})
