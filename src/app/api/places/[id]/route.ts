import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'

export const DELETE = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  await db.savedPlace.deleteMany({ where: { id: params.id, userId: user.id } })
  return NextResponse.json({ ok: true })
})
