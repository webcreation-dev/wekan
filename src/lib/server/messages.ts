import 'server-only'
import { NextResponse } from 'next/server'
import { db } from './db'
import { ApiError, readJson, str } from './http'
import { assertOwnVoice, findAccessibleRequest, toMessageDto } from './requests'

/** Ajoute un message (texte ou vocal) à la conversation d'une demande. */
export async function postMessage(req: Request, requestId: string, user: { id: string; role: string }, sender: 'user' | 'agent') {
  const request = await findAccessibleRequest(requestId, user)
  const body = await readJson(req)
  const text = str(body.text, 2000)
  const voiceId = str(body.voiceId, 40)
  if (!text && !voiceId) throw new ApiError(400, 'Message vide.')
  if (voiceId) await assertOwnVoice(voiceId, user.id)

  const [message] = await db.$transaction([
    db.message.create({ data: { requestId: request.id, sender, text: voiceId ? undefined : text, voiceId: voiceId || undefined }, include: { voice: true } }),
    db.request.update({
      where: { id: request.id },
      data: sender === 'user' ? { agentUnread: { increment: 1 } } : { clientUnread: { increment: 1 } },
    }),
  ])
  return NextResponse.json({ message: toMessageDto(message) }, { status: 201 })
}
