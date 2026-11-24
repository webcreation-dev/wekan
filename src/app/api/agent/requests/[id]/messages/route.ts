import { requireAgent } from '@/lib/server/auth'
import { handler } from '@/lib/server/http'
import { postMessage } from '@/lib/server/messages'

/** L'agent répond dans la conversation de la demande. */
export const POST = handler(async (req: Request, { params }: { params: { id: string } }) => {
  const agent = await requireAgent()
  return postMessage(req, params.id, agent, 'agent')
})
