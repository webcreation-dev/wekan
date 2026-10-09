'use client'

import { useState } from 'react'
import { ChevronLeft, Info, MapPin, Shield, CreditCard, CheckCircle, Phone } from 'lucide-react'
import type { BookingDetails } from '@/components/screens/ServiceScreen'
import { getServiceConfig } from '@/data/services-config'

interface PaymentScreenProps {
  booking: BookingDetails | null
  onBack: () => void
  onConfirm: () => void | Promise<void>
}

type Step = 'summary' | 'method' | 'confirm'

const PAYMENT_METHODS = [
  {
    id: 'mtn',
    label: 'MTN Mobile Money',
    badge: 'MTN',
    badgeColor: 'bg-yellow-500',
    badgeText: 'text-black',
    icon: null,
    description: 'Paiement via MTN MoMo',
  },
  {
    id: 'flooz',
    label: 'Flooz (Moov)',
    badge: 'FLOOZ',
    badgeColor: 'bg-blue-600',
    badgeText: 'text-white',
    icon: null,
    description: 'Paiement via Flooz Moov Africa',
  },
  {
    id: 'celtiis',
    label: 'Celtiis Cash',
    badge: 'CELTIIS',
    badgeColor: 'bg-green-600',
    badgeText: 'text-white',
    icon: null,
    description: 'Paiement via Celtiis Cash',
  },
  {
    id: 'card',
    label: 'Carte Bancaire',
    badge: null,
    badgeColor: '',
    badgeText: '',
    icon: CreditCard,
    description: 'Visa / Mastercard',
  },
]

function formatBookingDate(date?: string) {
  if (!date) return 'Demain'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function PaymentScreen({ booking, onBack, onConfirm }: PaymentScreenProps) {
  const [step, setStep] = useState<Step>('summary')
  const [selectedMethod, setSelectedMethod] = useState('mtn')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const serviceConfig = booking ? getServiceConfig(booking.serviceId) : undefined
  const selectedOptions = serviceConfig?.options.filter(option => booking?.optionIds.includes(option.id)) ?? []
  const serviceLabel = serviceConfig
    ? `${serviceConfig.name}${selectedOptions.length ? ` – ${selectedOptions.map(option => option.title).join(', ')}` : ''}`
    : 'Plomberie – Réparation'
  const appointmentDate = formatBookingDate(booking?.date)
  const appointmentTime = booking?.time ?? '10:00'
  const address = booking?.address ?? 'Rue des Jardins, Akpakpa'
  const totalPrice = booking?.totalPrice ?? 25000
  const deposit = Math.min(1000, totalPrice)
  const balance = Math.max(0, totalPrice - deposit)

  const handleConfirm = async () => {
    const digits = phoneNumber.replace(/\D/g, '')
    if (selectedMethod !== 'card' && digits.length < 8) {
      setError('Veuillez renseigner un numéro Mobile Money valide.')
      return
    }
    setError('')
    setProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 1600))
      await onConfirm()
    } catch {
      setError("Impossible d'enregistrer la réservation. Veuillez réessayer.")
      setProcessing(false)
    }
  }

  // ── Step 3: Confirm ─────────────────────────────────────────────────────────
  if (step === 'confirm') {
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)!
    return (
      <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => setStep('method')} className="w-8 h-8 flex items-center justify-center">
            <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Confirmation</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 pb-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-3">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Récapitulatif</h3>
            {[
              { label: 'Service',    value: serviceLabel },
              { label: 'Prestataire', value: 'Alex Johnson' },
              { label: 'Date',       value: `${appointmentDate}, ${appointmentTime}` },
              { label: 'Lieu',       value: address },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-[13px]">
                <span className="text-[var(--text-secondary)]">{row.label}</span>
                <span className="font-semibold text-[var(--text-primary)]">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-[var(--border)] pt-3 flex justify-between">
              <span className="text-[14px] font-bold text-[var(--text-primary)]">Acompte à payer</span>
              <span className="text-[16px] font-bold text-[#2d7ff9]">1 000 FCFA</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-3">
            <p className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase">Mode sélectionné</p>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#2d7ff9] bg-[#2d7ff9]/10">
              {method.badge
                ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${method.badgeColor} ${method.badgeText}`}>{method.badge}</span>
                : method.icon && <method.icon size={18} className="text-[var(--text-secondary)]" />
              }
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">{method.label}</span>
            </div>

            {selectedMethod !== 'card' && (
              <div>
                <p className="text-[12px] text-[var(--text-secondary)] mb-2">
                  Numéro {method.label.split(' ')[0]}
                </p>
                <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-[46px]">
                  <Phone size={15} className="text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => { setPhoneNumber(e.target.value); setError('') }}
                    placeholder="+229 01 XX XX XX XX"
                    className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="px-1 text-[12px] text-red-500">{error}</p>
          )}

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <Shield size={16} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase mb-1">Paiement Sécurisé</p>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Chiffrement SSL 256 bits. Acompte remboursable jusqu&apos;à 24h avant le rendez-vous.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
          <button onClick={handleConfirm} disabled={processing}
            className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {processing
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Traitement...</>
              : <><CheckCircle size={18} /> Confirmer &amp; Payer {deposit.toLocaleString('fr-FR')} FCFA</>
            }
          </button>
          <p className="text-center text-[11px] text-[var(--text-muted)] mt-2">
            En confirmant, vous acceptez nos conditions générales d&apos;utilisation
          </p>
        </div>
      </div>
    )
  }

  // ── Step 2: Choose method ───────────────────────────────────────────────────
  if (step === 'method') {
    return (
      <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => setStep('summary')} className="w-8 h-8 flex items-center justify-center">
            <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Mode de Paiement</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
          <p className="text-[13px] text-[var(--text-secondary)] mb-5">
            Choisissez comment payer votre acompte de{' '}
            <span className="font-bold text-[var(--text-primary)]">{deposit.toLocaleString('fr-FR')} FCFA</span>.
          </p>
          <div className="space-y-3 mb-6">
            {PAYMENT_METHODS.map(method => {
              const isActive = selectedMethod === method.id
              const Icon = method.icon
              return (
                <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all ${isActive ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
                  <div className="flex items-center gap-3">
                    {method.badge
                      ? <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${method.badgeColor} ${method.badgeText}`}>{method.badge}</span>
                      : Icon && <Icon size={20} className="text-[var(--text-secondary)]" />
                    }
                    <div className="text-left">
                      <p className="text-[14px] font-bold text-[var(--text-primary)]">{method.label}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{method.description}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isActive ? 'border-[#2d7ff9]' : 'border-[var(--text-muted)]'}`}>
                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#2d7ff9]" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
          <button onClick={() => setStep('confirm')}
            className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all">
            Continuer →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 1: Summary ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Paiement de l&apos;Acompte</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Info size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 space-y-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-3">Résumé du service</p>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{serviceLabel}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Pro: Alex Johnson</p>
              <p className="text-[13px] text-[#2d7ff9] font-medium mt-1">📅 {appointmentDate}, {appointmentTime}</p>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">📍 {address}</p>
            </div>
            <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=150&fit=crop"
              alt="Service" className="w-[75px] h-[65px] rounded-xl object-cover flex-shrink-0" />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-3">Détails du paiement</p>
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-3">
            <div className="flex justify-between text-[13px]">
              <span className="text-[var(--text-secondary)]">Estimation Totale</span>
              <span className="font-semibold text-[var(--text-primary)]">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-bold text-[var(--text-primary)]">Acompte Requis</p>
                  <p className="text-[12px] text-[#2d7ff9] mt-0.5">Payer maintenant pour confirmer</p>
                </div>
                <div className="text-right">
                  <p className="text-[22px] font-bold text-[#2d7ff9] leading-none">{deposit.toLocaleString('fr-FR')}</p>
                  <p className="text-[14px] font-bold text-[#2d7ff9]">FCFA</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex justify-between">
              <span className="text-[13px] text-[var(--text-secondary)]">Reste à payer</span>
              <span className="text-[13px] text-[var(--text-muted)]">{balance.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 px-1">
            <MapPin size={12} className="text-[var(--text-muted)]" />
            <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase">Zone : Cotonou / Akpakpa</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <button onClick={() => setStep('method')}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all">
          Choisir le mode de paiement →
        </button>
      </div>
    </div>
  )
}
