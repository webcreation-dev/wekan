'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[160px] rounded-2xl bg-[#e8f4e8] animate-pulse flex items-center justify-center">
      <p className="text-[12px] text-gray-500">Chargement de la carte...</p>
    </div>
  ),
})

export interface BookingData {
  date: string        // ISO date string
  time: string        // "HH:MM"
  address: string
  lat: number
  lng: number
}

interface BookingStepProps {
  serviceName: string
  estimatedPrice: number
  onBack: () => void
  onConfirm: (data: BookingData) => void
}

const AVAILABLE_TIMES = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
]

// Cotonou default
const DEFAULT_LAT = 6.3654
const DEFAULT_LNG = 2.4183

function formatDateFr(date: Date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function isoToDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function dateToIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d: Date, n: number) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export default function BookingStep({ serviceName, estimatedPrice, onBack, onConfirm }: BookingStepProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i))

  const [selectedDate, setSelectedDate] = useState(dateToIso(days[1])) // Default: tomorrow
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [address, setAddress] = useState('Cotonou, Bénin')
  const [lat, setLat] = useState(DEFAULT_LAT)
  const [lng, setLng] = useState(DEFAULT_LNG)
  const [dayOffset, setDayOffset] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const visibleDays = days.slice(dayOffset, dayOffset + 5)

  const validate = () => {
    const errs: string[] = []
    if (!selectedDate) errs.push('Veuillez choisir une date.')
    if (!selectedTime) errs.push('Veuillez choisir une heure.')
    if (!address.trim()) errs.push('Veuillez indiquer votre adresse.')
    setErrors(errs)
    return errs.length === 0
  }

  const handleConfirm = () => {
    if (!validate()) return
    onConfirm({ date: selectedDate, time: selectedTime, address, lat, lng })
  }

  const selDate = isoToDate(selectedDate)
  const isToday = selectedDate === dateToIso(today)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-[#2d7ff9]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex-1 text-center mr-8">
          <p className="text-[17px] font-bold text-[var(--text-primary)]">Planifier le service</p>
          <p className="text-[12px] text-[var(--text-secondary)]">{serviceName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 space-y-5">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">
            {errors.map((e, i) => <p key={i} className="text-[13px] text-red-400">{e}</p>)}
          </div>
        )}

        {/* ── DATE ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <Calendar size={14} className="text-[#2d7ff9]" />
            </div>
            <p className="text-[15px] font-bold text-[var(--text-primary)]">Choisissez la date</p>
          </div>

          {/* Day selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDayOffset(Math.max(0, dayOffset - 1))}
              disabled={dayOffset === 0}
              className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
            </button>
            <div className="flex-1 flex gap-2 overflow-hidden">
              {visibleDays.map(day => {
                const iso = dateToIso(day)
                const active = iso === selectedDate
                const isT = iso === dateToIso(today)
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    className={`flex-1 flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all ${
                      active ? 'bg-[#2d7ff9] border-[#2d7ff9]' : 'bg-[var(--bg-card)] border-[var(--border)]'
                    }`}
                  >
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${active ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                      {isT ? 'Auj.' : day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                    <span className={`text-[16px] font-bold mt-0.5 ${active ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {day.getDate()}
                    </span>
                    <span className={`text-[9px] ${active ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {day.toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setDayOffset(Math.min(days.length - 5, dayOffset + 1))}
              disabled={dayOffset >= days.length - 5}
              className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight size={16} className="text-[var(--text-secondary)]" />
            </button>
          </div>

          {selectedDate && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2d7ff9]/8 border border-[#2d7ff9]/20">
              <Check size={13} className="text-[#2d7ff9]" />
              <span className="text-[12px] font-semibold text-[#2d7ff9] capitalize">
                {isToday ? "Aujourd'hui" : formatDateFr(selDate)} sélectionné
              </span>
            </div>
          )}
        </div>

        {/* ── HEURE ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <Clock size={14} className="text-[#2d7ff9]" />
            </div>
            <p className="text-[15px] font-bold text-[var(--text-primary)]">Choisissez l&apos;heure</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TIMES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold border transition-all ${
                  selectedTime === t
                    ? 'bg-[#2d7ff9] text-white border-[#2d7ff9]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── LIEU ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center">
              <MapPin size={14} className="text-[#2d7ff9]" />
            </div>
            <p className="text-[15px] font-bold text-[var(--text-primary)]">Lieu d&apos;intervention</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[48px] mb-2 focus-within:border-[#2d7ff9] transition-colors">
            <MapPin size={15} className="text-[#2d7ff9] flex-shrink-0" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Ex: Rue des Jardins, Akpakpa, Cotonou"
              className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
            <MapPicker
              lat={lat}
              lng={lng}
              onLocationChange={(la, ln) => { setLat(la); setLng(ln) }}
              height={160}
              zoom={14}
              markerLabel="Lieu d'intervention"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5 px-1">
            Appuyez sur la carte pour ajuster votre position exacte
          </p>
        </div>

        {/* ── Récapitulatif ─────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-2.5">
          <p className="text-[12px] font-bold text-[var(--text-primary)] mb-3">Récapitulatif</p>
          {[
            { label: 'Service',   val: serviceName },
            { label: 'Date',      val: isToday ? "Aujourd'hui" : formatDateFr(selDate) },
            { label: 'Heure',     val: selectedTime },
            { label: 'Lieu',      val: address || '—' },
            { label: 'Estimation',val: `${estimatedPrice.toLocaleString('fr-FR')} FCFA` },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <span className="text-[12px] text-[var(--text-secondary)]">{r.label}</span>
              <span className="text-[12px] font-semibold text-[var(--text-primary)] text-right max-w-[180px] capitalize">{r.val}</span>
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>

      {/* CTA */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <button
          onClick={handleConfirm}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Confirmer la réservation
        </button>
      </div>
    </div>
  )
}
