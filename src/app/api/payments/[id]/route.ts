import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler } from '@/lib/server/http'
import { check } from '@/lib/server/payment-provider'
import { toPaymentDto } from '@/lib/server/payments'

export const dynamic = 'force-dynamic'

/** État d'un paiement (interrogé régulièrement pendant la validation). */
export const GET = handler(async (_req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  let payment = await db.payment.findUnique({ where: { id: params.id } })
  if (!payment || (payment.userId !== user.id && user.role !== 'agent')) throw new ApiError(404, 'Paiement introuvable.')

  if (payment.status === 'pending') {
    const status = await check(payment)
    if (status !== 'pending') {
      payment = await db.payment.update({ where: { id: payment.id }, data: { status } })
      if (status === 'succeeded') await confirmInConversation(payment.requestId, payment.amount)
    }
  }
  return NextResponse.json({ payment: toPaymentDto(payment) })
})

/** Message automatique dans la conversation de la demande. */
async function confirmInConversation(requestId: string, amount: number) {
  const request = await db.request.findUnique({
    where: { id: requestId },
    include: { payments: { where: { status: 'succeeded' }, select: { amount: true } } },
  })
  if (!request?.price) return
  const paid = request.payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = Math.max(0, request.price - paid)
  const fmt = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`
  const text = remaining > 0
    ? `Paiement reçu : ${fmt(amount)}. Merci ! Reste à payer : ${fmt(remaining)}.`
    : `Paiement reçu : ${fmt(amount)}. Votre intervention est entièrement réglée. Merci !`
  await db.$transaction([
    db.message.create({ data: { requestId, sender: 'agent', text } }),
    db.request.update({ where: { id: requestId }, data: { clientUnread: { increment: 1 }, agentUnread: { increment: 1 } } }),
  ])
}
