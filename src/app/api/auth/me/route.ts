import { NextResponse } from 'next/server'
import { getCurrentUser, publicUser } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

export const GET = handler(async () => {
  const user = await getCurrentUser()
  return NextResponse.json({ user: user ? publicUser(user) : null })
})
