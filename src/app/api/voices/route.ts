import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler } from '@/lib/server/http'
import { saveVoiceFile } from '@/lib/server/storage'

// 4 Mo : limite de corps des fonctions Vercel (4,5 Mo). Une minute de vocal ≈ 0,2 Mo.
const MAX_BYTES = 4 * 1024 * 1024
const EXTENSIONS: Record<string, string> = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' }

/** Envoi d'un vocal (multipart : audio, durationSec, waveform). Renvoie son id. */
export const POST = handler(async (req: Request) => {
  const user = await requireUser()
  const form = await req.formData().catch(() => null)
  const file = form?.get('audio')
  if (!(file instanceof Blob) || file.size === 0) throw new ApiError(400, 'Fichier audio manquant.')
  if (file.size > MAX_BYTES) throw new ApiError(413, 'Vocal trop long (4 Mo maximum).')

  const mimeType = (file.type || 'audio/webm').split(';')[0]
  const ext = EXTENSIONS[mimeType]
  if (!ext) throw new ApiError(415, 'Format audio non pris en charge.')

  const durationSec = Math.max(1, Math.min(3600, Math.round(Number(form?.get('durationSec')) || 1)))
  let waveform: number[] = []
  try {
    const parsed = JSON.parse(String(form?.get('waveform') ?? '[]'))
    if (Array.isArray(parsed)) waveform = parsed.slice(0, 64).map(n => Math.max(0, Math.min(1, Number(n) || 0)))
  } catch { /* onde facultative */ }

  const voice = await db.voice.create({
    data: { userId: user.id, fileName: '', mimeType, durationSec, waveform: JSON.stringify(waveform) },
  })
  const fileName = `${voice.id}.${ext}`
  await saveVoiceFile(fileName, Buffer.from(await file.arrayBuffer()), mimeType)
  await db.voice.update({ where: { id: voice.id }, data: { fileName } })

  return NextResponse.json({ voice: { id: voice.id, url: `/api/voices/${voice.id}`, durationSec, waveform } }, { status: 201 })
})
