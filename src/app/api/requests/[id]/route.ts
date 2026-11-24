import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'
import { findAccessibleRequest, toRequestDto } from '@/lib/server/requests'

export const dynamic = 'force-dynamic'

export const GET = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  const request = await findAccessibleRequest(params.id, user)
  return NextResponse.json({ request: toRequestDto(request, user.role === 'agent' ? 'agent' : 'client') })
})
