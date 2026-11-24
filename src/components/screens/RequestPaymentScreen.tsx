'use client'

/**
 * ─── RequestPaymentScreen ───────────────────────────────────────────────────
 * Paiement Mobile Money d'une avance (ou du solde) sur une demande planifiée.
 * Formulaire → validation sur le téléphone (compte à rebours) → paiement effectué.
 */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Check, ChevronDown, Loader2, Wallet } from 'lucide-react'
import { PaymentOperator, RequestPayment } from '@/types'
import { useRequestsStore } from '@/store/requestsStore'
import { useAuthStore } from '@/store/authStore'
import { errorMessage } from '@/lib/api-client'

const ACCENT = '#2d7ff9'
const TIMEOUT_SEC = 60
const RING = 2 * Math.PI * 84

const OPERATORS: { id: PaymentOperator; label: string; logo: string }[] = [
  { id: 'MTN',     label: 'MTN Mobile Money', logo: '/mtn.webp' },
  { id: 'MOOV',    label: 'Moov Money',       logo: '/moov.png' },
  { id: 'CELTIIS', label: 'Celtiis Cash',     logo: '/celtiis.png' },
]

type Step = 'FORM' | 'PROCESSING' | 'SUCCESS'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/\s/g, ' ')
const formatPhone = (v: string) => v.replace(/\D/g, '').match(/.{1,2}/g)?.join(' ') ?? v

interface RequestPaymentScreenProps {
  requestId: string | null
  onClose: () => void
}

export default function RequestPaymentScreen({ requestId, onClose }: RequestPaymentScreenProps) {
  const request = useRequestsStore(state => state.requests.find(r => r.id === requestId))
  const { startPayment, getPayment, loadRequest } = useRequestsStore()
  const user = useAuthStore(state => state.user)

  const price = request?.price ?? 0
  const paid = request?.paidAmount ?? 0
  const remaining = Math.max(0, price - paid)

  const [step, setStep] = useState<Step>('FORM')
  const [operator, setOperator] = useState<PaymentOperator>('MTN')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState(user?.phone?.replace(/\D/g, '').slice(0, 10) ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [timer, setTimer] = useState(TIMEOUT_SEC)
  const [payment, setPayment] = useState<RequestPayment | null>(null)
  // Reste à payer au moment du paiement (la demande est rechargée après succès)
  const [remainingBefore, setRemainingBefore] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const amountValue = Number(amount) || 0
  const op = OPERATORS.find(o => o.id === operator)!

  // Compte à rebours + interrogation du serveur pendant la validation
  useEffect(() => {
    if (step !== 'PROCESSING' || !payment) return
    const countdown = setInterval(() => setTimer(t => t - 1), 1000)
    pollRef.current = setInterval(async () => {
      try {
        const latest = await getPayment(payment.id)
        if (latest.status === 'succeeded') {
          setPayment(latest)
          setStep('SUCCESS')
          if (requestId) loadRequest(requestId).catch(() => {})
        } else if (latest.status === 'failed') {
          setStep('FORM')
          setError('Le paiement a été refusé ou annulé. Veuillez réessayer.')
        }
      } catch { /* on réessaie au prochain tour */ }
    }, 2000)
    return () => {
      clearInterval(countdown)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [step, payment, getPayment, loadRequest, requestId])

  useEffect(() => {
    if (step === 'PROCESSING' && timer <= 0) {
      setStep('FORM')
      setError('Délai dépassé. Si vous avez validé sur votre téléphone, le paiement apparaîtra dans quelques instants.')
    }
  }, [step, timer])

  const handlePay = async () => {
    if (!requestId) return
    if (amountValue < 100) return setError('Montant minimum : 100 F.')
    if (amountValue > remaining) return setError(`Le montant ne peut pas dépasser ${fmt(remaining)} F.`)
    if (phone.length < 10) return setError('Entrez un numéro de paiement valide (10 chiffres).')
    setSubmitting(true); setError('')
    try {
      const created = await startPayment(requestId, { amount: amountValue, operator, msisdn: phone })
      setPayment(created)
      setRemainingBefore(remaining)
      setTimer(TIMEOUT_SEC)
      setStep('PROCESSING')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!request) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[var(--bg-primary)]">
        <p className="text-[var(--text-muted)]">Demande introuvable</p>
        <button onClick={onClose} className="font-semibold text-[#2d7ff9]">Retour</button>
      </div>
    )
  }

  const paidNow = payment?.amount ?? 0
  const remainingAfter = Math.max(0, remainingBefore - paidNow)

  return (
    <div className="flex h-full flex-col bg-[var(--bg-primary)]">
      {/* En-tête */}
      {step !== 'SUCCESS' && (
        <div className="flex h-14 flex-shrink-0 items-center justify-between px-4">
          <button
            onClick={() => (step === 'FORM' ? onClose() : setStep('FORM'))}
            aria-label="Retour"
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--bg-surface)]"
          >
            <ArrowLeft size={24} className="text-[var(--text-primary)]" />
          </button>
          <h1 className="text-[18px] font-semibold text-[var(--text-primary)]">Paiement</h1>
          <div className="w-10" />
        </div>
      )}

      <div className="screen-scroll flex-1 overflow-y-auto px-5 pb-8 pt-4">
        {/* ── Formulaire ── */}
        {step === 'FORM' && (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">Motif : {request.serviceName} · #{request.ref}</p>
              <p className="text-[14px] font-medium text-[var(--text-secondary)]">Avance sur l’intervention</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-[#FFEBEE] p-3 dark:bg-red-500/10">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F44336]" />
                <p className="text-[13px] leading-snug text-[#D32F2F] dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Opérateur */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex w-full items-center justify-between rounded-[20px] bg-[var(--bg-card)] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                    <img src={op.logo} alt="" className="h-full w-full object-contain p-1" />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="text-[15px] font-semibold text-[var(--text-primary)]">Mobile Money</span>
                    <span className="text-[12px] text-[var(--text-muted)]">{op.label}</span>
                  </span>
                </div>
                <ChevronDown size={20} className={`text-[var(--text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl bg-[var(--bg-card)] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  {OPERATORS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => { setOperator(o.id); setDropdownOpen(false) }}
                      className="flex w-full items-center gap-3 rounded-xl p-3 active:bg-[var(--bg-surface)]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-sm">
                        <img src={o.logo} alt="" className="h-full w-full object-contain p-0.5" />
                      </span>
                      <span className="flex-1 text-left text-[14px] font-medium text-[var(--text-primary)]">{o.label}</span>
                      {o.id === operator && <Check size={16} className="text-[#2d7ff9]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prix de l'intervention */}
            <div className="flex flex-col items-center justify-center rounded-[24px] bg-[var(--bg-card)] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <p className="mb-2 text-[13px] text-[var(--text-secondary)]">Prix de l’intervention</p>
              <div className="flex items-start gap-1">
                <span className="text-[42px] font-bold leading-none tracking-tight text-[var(--text-primary)]">{fmt(price)}</span>
                <span className="mt-1 text-[20px] font-medium text-[var(--text-primary)]">F</span>
              </div>
              {paid > 0 && (
                <p className="mt-3 text-center text-[12px] text-[var(--text-muted)]">
                  Déjà payé : {fmt(paid)} F · Il reste {fmt(remaining)} F
                </p>
              )}
            </div>

            {/* Montant de l'avance */}
            <div className="flex flex-col gap-2">
              <label className="ml-1 text-[13px] font-semibold text-[var(--text-secondary)]">Montant de l’avance</label>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? fmt(Number(amount)) : ''}
                onChange={e => { setAmount(e.target.value.replace(/\D/g, '').slice(0, 9)); setError('') }}
                placeholder={`Ex : ${fmt(Math.round(remaining / 2))}`}
                className="h-[54px] rounded-[14px] border border-gray-200 bg-[var(--bg-card)] px-4 text-[16px] font-semibold text-[var(--text-primary)] outline-none placeholder:font-normal placeholder:text-gray-300 focus:border-[#2d7ff9] focus:ring-1 focus:ring-[#2d7ff9] dark:border-white/10"
              />
            </div>

            {/* Numéro débité */}
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-[13px] font-semibold text-[var(--text-secondary)]">Numéro de paiement</label>
              <div className="flex h-[54px] items-center overflow-hidden rounded-[14px] border border-gray-200 bg-[var(--bg-card)] focus-within:border-[#2d7ff9] focus-within:ring-1 focus-within:ring-[#2d7ff9] dark:border-white/10">
                <span className="flex h-full items-center border-r border-gray-100 bg-gray-50/40 px-3 text-[14px] font-semibold text-[var(--text-primary)] dark:border-white/10 dark:bg-white/5">(+229)</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="01 XX XX XX XX"
                  value={formatPhone(phone)}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                  className="flex-1 bg-transparent px-3 text-[15px] font-bold text-[var(--text-primary)] outline-none placeholder:font-normal placeholder:text-gray-300"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!amountValue || !phone || submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(45,127,249,0.25)] transition active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {amountValue ? `Payer ${fmt(amountValue)} F` : 'Payer'}
            </button>
          </motion.div>
        )}

        {/* ── Validation sur le téléphone ── */}
        {step === 'PROCESSING' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center pt-16">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="84" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <motion.circle
                  cx="96" cy="96" r="84" fill="none" stroke={ACCENT} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={RING} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: RING }}
                  transition={{ duration: TIMEOUT_SEC, ease: 'linear' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-[48px] font-bold leading-none text-[#2d7ff9]">{Math.max(0, timer)}</span>
                <span className="text-[14px] text-[var(--text-muted)]">secondes</span>
              </div>
            </div>
            <p className="mt-12 text-[15px] font-medium text-[var(--text-primary)]">Validation du paiement en cours…</p>
            <p className="mt-2 max-w-[280px] text-center text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Confirmez le paiement de <span className="font-semibold">{fmt(paidNow)} F</span> sur le {formatPhone(phone)} ({op.label}).
            </p>
          </motion.div>
        )}

        {/* ── Paiement effectué ── */}
        {step === 'SUCCESS' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center pt-10">
            <div className="z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full shadow-[0_8px_20px_rgba(45,127,249,0.25)]" style={{ backgroundColor: ACCENT }}>
              <Check size={36} strokeWidth={3} className="text-white" />
            </div>

            <div className="-mt-9 flex w-full flex-col items-center rounded-[32px] bg-[var(--bg-card)] px-5 pb-6 pt-14 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <h2 className="mb-3 text-[24px] font-bold text-[var(--text-primary)]">Paiement effectué</h2>
              <p className="mb-6 px-2 text-center text-[13px] leading-relaxed text-[var(--text-secondary)]">
                Votre avance pour la demande {request.serviceName.toLowerCase()} #{request.ref} a bien été reçue.
                {remainingAfter > 0 ? ' Le reste sera à régler selon ce qui a été convenu avec l’agent.' : ' Votre intervention est entièrement réglée.'}
              </p>

              <div className="mb-6 flex w-full items-center gap-3 rounded-2xl bg-[var(--bg-primary)] p-4">
                <span className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-[#2d7ff9]/10">
                  <Wallet size={20} className="text-[#2d7ff9]" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">Reste à payer</p>
                  <p className="text-[13px] font-medium text-[#2d7ff9]">{fmt(remainingAfter)} F</p>
                </div>
              </div>

              <div className="flex w-full items-center justify-between rounded-2xl px-6 py-5" style={{ backgroundColor: ACCENT }}>
                <span className="text-[16px] font-medium text-white">Total payé</span>
                <span className="text-[24px] font-bold text-white">{fmt(paidNow)} F</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 flex w-full items-center justify-center rounded-xl py-4 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(45,127,249,0.25)] active:scale-[0.98]"
              style={{ backgroundColor: ACCENT }}
            >
              Fermer
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
