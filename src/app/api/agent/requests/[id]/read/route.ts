import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireAgent } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'

export const POST = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  await requireAgent()
  await db.request.updateMany({ where: { id: params.id }, data: { agentUnread: 0 } })
  return NextResponse.json({ ok: true })
})
