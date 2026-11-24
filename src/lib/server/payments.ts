import 'server-only'
import type { Payment } from '@prisma/client'
import type { RequestPayment } from '@/types'

export function toPaymentDto(p: Payment): RequestPayment {
  return {
    id: p.id,
    amount: p.amount,
    operator: p.operator as RequestPayment['operator'],
    msisdn: p.msisdn,
    status: p.status as RequestPayment['status'],
  }
}
