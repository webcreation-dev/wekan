import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'

export const POST = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  await db.request.updateMany({ where: { id: params.id, userId: user.id }, data: { clientUnread: 0 } })
  return NextResponse.json({ ok: true })
})
