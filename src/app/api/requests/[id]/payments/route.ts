import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { requireUser } from '@/lib/server/auth'
import { ApiError, handler, readJson } from '@/lib/server/http'
import { normalizePhone } from '@/lib/server/phone'
import { findAccessibleRequest } from '@/lib/server/requests'
import { initiate, Operator, OPERATORS } from '@/lib/server/payment-provider'
import { toPaymentDto } from '@/lib/server/payments'

const MIN_AMOUNT = 100

/**
 * Le client paie une avance (ou le solde) sur une demande dont le prix est fixé.
 * Corps : { amount, operator: 'MTN' | 'MOOV' | 'CELTIIS', msisdn }
 */
export const POST = handler(async (req: Request, { params }: { params: { id: string } }) => {
  const user = await requireUser()
  const request = await findAccessibleRequest(params.id, { id: user.id, role: 'client' })
  if (request.status !== 'scheduled' || !request.price) throw new ApiError(400, 'Le prix de cette demande n’est pas encore fixé.')

  const body = await readJson(req)
  const operator = String(body.operator ?? '').toUpperCase() as Operator
  if (!OPERATORS.includes(operator)) throw new ApiError(400, 'Opérateur invalide.')
  const msisdn = normalizePhone(body.msisdn)

  const paid = (request.payments ?? []).reduce((sum, p) => sum + p.amount, 0)
  const remaining = request.price - paid
  const amount = Math.round(Number(body.amount))
  if (remaining <= 0) throw new ApiError(400, 'Cette demande est déjà entièrement payée.')
  if (!Number.isFinite(amount) || amount < Math.min(MIN_AMOUNT, remaining)) throw new ApiError(400, `Montant minimum : ${MIN_AMOUNT} FCFA.`)
  if (amount > remaining) throw new ApiError(400, `Le montant dépasse le reste à payer (${remaining.toLocaleString('fr-FR')} FCFA).`)

  const providerRef = await initiate({ amount, operator, msisdn })
  const payment = await db.payment.create({
    data: { requestId: request.id, userId: user.id, amount, operator, msisdn, providerRef },
  })
  return NextResponse.json({ payment: toPaymentDto(payment) }, { status: 201 })
})
