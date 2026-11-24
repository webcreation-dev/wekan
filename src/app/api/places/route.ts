import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler, readJson, str } from '@/lib/server/http'

export const dynamic = 'force-dynamic'

const toDto = (p: { id: string; label: string; lat: number; lng: number }) => ({ id: p.id, label: p.label, lat: p.lat, lng: p.lng })

export const GET = handler(async () => {
  const user = await requireUser()
  const places = await db.savedPlace.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } })
  return NextResponse.json({ places: places.map(toDto) })
})

export const POST = handler(async (req: Request) => {
  const user = await requireUser()
  const body = await readJson(req)
  const label = str(body.label, 40)
  const lat = Number(body.lat)
  const lng = Number(body.lng)
  if (!label || !Number.isFinite(lat) || !Number.isFinite(lng)) throw new ApiError(400, 'Lieu invalide.')
  const place = await db.savedPlace.create({ data: { userId: user.id, label, lat, lng } })
  return NextResponse.json({ place: toDto(place) }, { status: 201 })
})
