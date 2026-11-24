import { requireUser } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'
import { postMessage } from '@/lib/server/messages'

/** Le client écrit ou envoie un vocal dans la conversation de sa demande. */
export const POST = handler(async (req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  return postMessage(req, params.id, { id: user.id, role: 'client' }, 'user')
})
