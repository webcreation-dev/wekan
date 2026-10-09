'use client'

/**
 * ─── ServiceScreen ─────────────────────────────────────────────────────────
 * Composant unique qui remplace TOUS les screens de service individuels.
 * Architecture: Options → Planification → Paiement
 *
 * - Header uniforme: "Wekan · {Nom du service}"
 * - Sélection dynamique (single/multiple) selon config
 * - Calendrier HTML natif (input[type=date]) + time slots
 * - Carte uniquement dans l'étape Planification
 * - Bouton CTA identique partout: "Planifier l'intervention →"
 * Prêt pour intégration API: les options viennent de services-config.ts
 */

import { useState, useCallback } from 'react'
import { ChevronLeft, CheckCircle, MapPin, Calendar, Clock, Plus } from 'lucide-react'
import { getServiceConfig, ServiceConfig } from '@/data/services-config'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[160px] rounded-2xl bg-[#e8f4e8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-[#2d7ff9] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-[11px] text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

// ── Types ──────────────────────────────────────────────────────────────────────
export interface BookingDetails {
  serviceId:   string
  optionIds:   string[]
  date:        string   // YYYY-MM-DD
  time:        string   // HH:MM
  address:     string
  lat:         number
  lng:         number
  totalPrice:  number
}

interface ServiceScreenProps {
  serviceId: string
  onBack:    () => void
  onProceed: (booking: BookingDetails) => void
}

// ── Header partagé ─────────────────────────────────────────────────────────────
function ScreenHeader({ serviceName, onBack }: { serviceName: string; onBack: () => void }) {
  return (
    <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
      </button>
      <div className="flex-1 text-center">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--text-muted)] uppercase">Wekan</p>
        <h1 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight">{serviceName}</h1>
      </div>
      <div className="w-8" />
    </div>
  )
}

// ── CTA Button partagé ─────────────────────────────────────────────────────────
function CTAButton({ onClick, disabled = false, label = "Planifier l'intervention", price }: {
  onClick: () => void
  disabled?: boolean
  label?: string
  price?: number
}) {
  return (
    <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
      {price !== undefined && (
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)] uppercase">Estimation</p>
            <p className="text-[22px] font-bold text-[#2d7ff9] leading-none">
              {price.toLocaleString('fr-FR')} <span className="text-[13px]">FCFA</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
            Acompte dès 1 000 FCFA
          </span>
        </div>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-[54px] rounded-2xl font-bold text-[16px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
      >
        {label} <span className="text-lg">→</span>
      </button>
    </div>
  )
}

// ── Step 1: Sélection des options ──────────────────────────────────────────────
function OptionsStep({
  config,
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  config:   ServiceConfig
  selected: string[]
  onToggle: (id: string) => void
  onNext:   () => void
  onBack:   () => void
}) {
  const totalPrice = config.options
    .filter(o => selected.includes(o.id))
    .reduce((sum, o) => sum + o.priceFrom, config.basePrice)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <ScreenHeader serviceName={config.name} onBack={onBack} />

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 pb-2">
        <h2 className="text-[19px] font-bold text-[var(--text-primary)] mb-1">
          Type d&apos;intervention
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">
          {config.selectionMode === 'single'
            ? 'Sélectionnez le type de prestation souhaité.'
            : 'Sélectionnez une ou plusieurs prestations.'}
        </p>

        <div className="space-y-3 mb-5">
          {config.options.map(option => {
            const isSelected = selected.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => onToggle(option.id)}
                className={`w-full flex items-center gap-3 p-0 rounded-2xl border text-left transition-all overflow-hidden ${
                  isSelected
                    ? 'border-[#2d7ff9] shadow-[0_0_0_1px_#2d7ff9]'
                    : 'border-[var(--border)]'
                } bg-[var(--bg-card)]`}
              >
                {/* Image */}
                <div className="w-[90px] h-[80px] flex-shrink-0 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 py-3 pr-3">
                  <p className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">{option.title}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{option.description}</p>
                  <p className="text-[12px] font-semibold text-[#2d7ff9] mt-1.5">
                    Dès {option.priceFrom.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
                {/* Indicator */}
                <div className={`w-5 h-5 mr-3 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-[#2d7ff9] bg-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isSelected && <CheckCircle size={11} color="white" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Autre problème */}
        <button className="flex items-center gap-2 px-2 py-3 mb-4 text-[13px] font-semibold text-[#2d7ff9]">
          <Plus size={16} />
          Autre problème non listé ?
        </button>
      </div>

      <CTAButton
        onClick={onNext}
        disabled={selected.length === 0}
        price={totalPrice}
      />
    </div>
  )
}

// ── Step 2: Planification ──────────────────────────────────────────────────────
function PlanningStep({
  config,
  onBack,
  onConfirm,
}: {
  config:    ServiceConfig
  onBack:    () => void
  onConfirm: (date: string, time: string, address: string, lat: number, lng: number) => void
}) {
  const toLocalIsoDate = (value: Date) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const today = toLocalIsoDate(new Date())
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = toLocalIsoDate(maxDate)

  const [date, setDate]       = useState(today)
  const [time, setTime]       = useState('09:00')
  const [address, setAddress] = useState('Cotonou, Bénin')
  const [lat, setLat]         = useState(6.3654)
  const [lng, setLng]         = useState(2.4183)
  const [error, setError]     = useState('')

  const TIME_SLOTS = [
    '07:00','08:00','09:00','10:00','11:00',
    '13:00','14:00','15:00','16:00','17:00',
  ]

  const formatDateFR = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const handleConfirm = () => {
    if (!date) { setError('Veuillez choisir une date.'); return }
    if (!time) { setError('Veuillez choisir une heure.'); return }
    if (!address.trim()) { setError('Veuillez indiquer une adresse.'); return }
    onConfirm(date, time, address, lat, lng)
  }

  const handleMap = useCallback((la: number, ln: number) => {
    setLat(la); setLng(ln)
  }, [])

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <ScreenHeader serviceName={config.name} onBack={onBack} />

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 pb-2 space-y-5">
        <div>
          <h2 className="text-[19px] font-bold text-[var(--text-primary)] mb-1">Planifier l&apos;intervention</h2>
          <p className="text-[13px] text-[var(--text-secondary)]">Choisissez la date, l&apos;heure et le lieu.</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">
            <p className="text-[13px] text-red-400">{error}</p>
          </div>
        )}

        {/* Date — input natif */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={15} className="text-[#2d7ff9]" />
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Date de l&apos;intervention</p>
          </div>
          <input
            type="date"
            value={date}
            min={today}
            max={maxDateStr}
            onChange={e => setDate(e.target.value)}
            className="w-full h-[50px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 text-[15px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9] transition-colors cursor-pointer"
            style={{ colorScheme: 'light' }}
          />
          {date && (
            <p className="text-[12px] text-[#2d7ff9] font-medium mt-1.5 ml-1 capitalize">{formatDateFR(date)}</p>
          )}
        </div>

        {/* Heure — time slots */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={15} className="text-[#2d7ff9]" />
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Heure souhaitée</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={`h-[38px] rounded-xl text-[12px] font-semibold transition-all border ${
                  time === slot
                    ? 'bg-[#2d7ff9] text-white border-[#2d7ff9]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[#2d7ff9]/40'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Lieu */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={15} className="text-[#2d7ff9]" />
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Lieu de l&apos;intervention</p>
          </div>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Rue, quartier, ville..."
            className="w-full h-[50px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2d7ff9] transition-colors mb-2"
          />
          <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
            <MapPicker
              lat={lat} lng={lng}
              onLocationChange={handleMap}
              height={160} zoom={14}
              markerLabel="Lieu d'intervention"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
            Appuyez sur la carte pour ajuster la position précise
          </p>
        </div>

        <div className="h-2" />
      </div>

      <CTAButton
        onClick={handleConfirm}
        label="Confirmer l'intervention"
        price={undefined}
      />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ServiceScreen({ serviceId, onBack, onProceed }: ServiceScreenProps) {
  const config = getServiceConfig(serviceId)
  const [step, setStep]         = useState<'options' | 'planning'>('options')
  const [selected, setSelected] = useState<string[]>([])

  if (!config) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-[var(--text-muted)]">Service non trouvé</p>
        <button onClick={onBack} className="mt-4 text-[#2d7ff9] font-semibold">Retour</button>
      </div>
    )
  }

  const handleToggle = (id: string) => {
    if (config.selectionMode === 'single') {
      setSelected([id])
    } else {
      setSelected(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    }
  }

  const handleOptionsNext = () => {
    if (selected.length === 0) return
    setStep('planning')
  }

  const handlePlanningConfirm = (
    date: string, time: string, address: string, lat: number, lng: number
  ) => {
    const totalPrice = config.options
      .filter(o => selected.includes(o.id))
      .reduce((sum, o) => sum + o.priceFrom, config.basePrice)

    onProceed({
      serviceId,
      optionIds: selected,
      date, time, address, lat, lng,
      totalPrice,
    })
  }

  if (step === 'planning') {
    return (
      <PlanningStep
        config={config}
        onBack={() => setStep('options')}
        onConfirm={handlePlanningConfirm}
      />
    )
  }

  return (
    <OptionsStep
      config={config}
      selected={selected}
      onToggle={handleToggle}
      onNext={handleOptionsNext}
      onBack={onBack}
    />
  )
}
