import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireAgent } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'
import { toRequestDto, withMessages } from '@/lib/server/requests'

export const dynamic = 'force-dynamic'

/** Toutes les demandes (filtre facultatif ?status=awaiting_call), avec le client. */
export const GET = handler(async (req: Request) => {
  await requireAgent()
  const status = new URL(req.url).searchParams.get('status') ?? undefined
  const requests = await db.request.findMany({
    where: status ? { status } : undefined,
    orderBy: { updatedAt: 'desc' },
    include: { ...withMessages, user: { select: { firstName: true, lastName: true, phone: true } } },
  })
  return NextResponse.json({
    requests: requests.map(r => ({ ...toRequestDto(r, 'agent'), client: r.user })),
  })
})
