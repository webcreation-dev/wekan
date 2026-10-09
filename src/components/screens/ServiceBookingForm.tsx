'use client'

import { useState, useCallback } from 'react'
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[160px] rounded-2xl bg-[#e8f4e8] flex items-center justify-center">
      <p className="text-[12px] text-gray-500">Chargement de la carte...</p>
    </div>
  ),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingDetails {
  date: string        // ISO string YYYY-MM-DD
  time: string        // HH:MM
  address: string
  lat: number
  lng: number
}

interface ServiceBookingFormProps {
  serviceName: string
  estimatedPrice: number
  ctaLabel?: string
  onBack: () => void
  onConfirm: (details: BookingDetails) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateFR(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function getAvailableDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 0; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceBookingForm({
  serviceName, estimatedPrice, ctaLabel = 'Confirmer la commande', onBack, onConfirm
}: ServiceBookingFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('09:00')
  const [address, setAddress] = useState('Cotonou, Bénin')
  const [lat, setLat] = useState(6.3654)
  const [lng, setLng] = useState(2.4183)
  const [dateOffset, setDateOffset] = useState(0) // for scrolling weeks
  const [error, setError] = useState('')

  const dates = getAvailableDates().slice(dateOffset, dateOffset + 7)

  const handleLocationChange = useCallback((la: number, ln: number) => {
    setLat(la); setLng(ln)
  }, [])

  const handleConfirm = () => {
    if (!date) { setError('Veuillez choisir une date.'); return }
    if (!time) { setError('Veuillez choisir une heure.'); return }
    if (!address.trim()) { setError('Veuillez indiquer une adresse.'); return }
    setError('')
    onConfirm({ date, time, address, lat, lng })
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <div className="flex-1 text-center mr-8">
          <h1 className="text-[16px] font-bold text-[var(--text-primary)]">Planifier l&apos;intervention</h1>
          <p className="text-[11px] text-[var(--text-secondary)]">{serviceName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 pb-4 space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">
            <p className="text-[13px] text-red-400">{error}</p>
          </div>
        )}

        {/* ── Date ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <Calendar size={14} className="text-[#2d7ff9]" />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Choisir la date</h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setDateOffset(Math.max(0, dateOffset - 7))}
              disabled={dateOffset === 0}
              className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft size={14} className="text-[var(--text-primary)]" />
            </button>
            <div className="flex-1 flex gap-1.5 overflow-hidden">
              {dates.map(d => {
                const jsDate = new Date(d + 'T00:00:00')
                const isSelected = d === date
                const isToday = d === today
                const dayName = jsDate.toLocaleDateString('fr-FR', { weekday: 'short' })
                const dayNum = jsDate.getDate()
                return (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#2d7ff9] border-[#2d7ff9]'
                        : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[#2d7ff9]/40'
                    }`}
                  >
                    <span className={`text-[9px] font-semibold uppercase ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                      {isToday ? 'Auj.' : dayName}
                    </span>
                    <span className={`text-[15px] font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {dayNum}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setDateOffset(Math.min(7, dateOffset + 7))}
              disabled={dateOffset >= 7}
              className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight size={14} className="text-[var(--text-primary)]" />
            </button>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] text-center capitalize">
            {formatDateFR(date)}
          </p>
        </div>

        {/* ── Heure ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <Clock size={14} className="text-[#2d7ff9]" />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Choisir l&apos;heure</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map(slot => {
              const isSelected = time === slot
              return (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#2d7ff9] border-[#2d7ff9] text-white'
                      : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)] hover:border-[#2d7ff9]/40'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Lieu ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <MapPin size={14} className="text-[#2d7ff9]" />
            </div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Lieu de l&apos;intervention</h3>
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 h-[46px] mb-3 focus-within:border-[#2d7ff9] transition-colors">
            <MapPin size={15} className="text-[#2d7ff9] flex-shrink-0" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Ex: Rue des Jardins, Akpakpa, Cotonou"
              className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
            <MapPicker
              lat={lat}
              lng={lng}
              onLocationChange={handleLocationChange}
              height={160}
              zoom={14}
              markerLabel="Lieu d'intervention"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 text-center">
            Appuyez sur la carte ou glissez le marqueur pour ajuster la position
          </p>
        </div>

        {/* ── Récapitulatif ─────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-[#2d7ff9]/8 border border-[#2d7ff9]/20">
          <p className="text-[11px] font-bold tracking-wider text-[#2d7ff9] uppercase mb-3">Récapitulatif</p>
          <div className="space-y-2">
            {[
              { label: 'Service', value: serviceName },
              { label: 'Date', value: formatDateFR(date) },
              { label: 'Heure', value: time },
              { label: 'Lieu', value: address || '—' },
              { label: 'Estimation', value: `${estimatedPrice.toLocaleString('fr-FR')} FCFA` },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-3">
                <span className="text-[12px] text-[var(--text-secondary)] flex-shrink-0">{row.label}</span>
                <span className="text-[12px] font-semibold text-[var(--text-primary)] text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
        <button
          onClick={handleConfirm}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <Check size={18} />
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
