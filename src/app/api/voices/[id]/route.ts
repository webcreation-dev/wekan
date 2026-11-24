import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler } from '@/lib/server/http'
import { readVoiceFile } from '@/lib/server/storage'

/** Lecture d'un vocal : auteur, agent, ou client de la demande où il a été envoyé. */
export const GET = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  const voice = await db.voice.findUnique({
    where: { id: params.id },
    include: { messages: { select: { request: { select: { userId: true } } } } },
  })
  const allowed = voice && (
    voice.userId === user.id || user.role === 'agent' || voice.messages.some(m => m.request.userId === user.id)
  )
  if (!voice || !allowed || !voice.fileName) throw new ApiError(404, 'Vocal introuvable.')

  const data = await readVoiceFile(voice.fileName)
  return new Response(new Uint8Array(data), {
    headers: { 'Content-Type': voice.mimeType, 'Content-Length': String(data.length), 'Cache-Control': 'private, max-age=86400' },
  })
})
