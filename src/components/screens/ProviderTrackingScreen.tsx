'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, MoreHorizontal, Phone, MessageSquare, Calendar, Clock } from 'lucide-react'
import { MOCK_PROVIDER } from '@/data/mock'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#e8f4e8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2d7ff9] border-t-transparent animate-spin mx-auto mb-2" />
        <p className="text-[12px] text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

interface ProviderTrackingScreenProps {
  onBack: () => void
  onMessage: () => void
  appointmentDate?: string  // 'today' | 'tomorrow' | ISO
  appointmentTime?: string  // 'HH:MM'
}

// Cotonou coordinates
const CLIENT_LAT = 6.3654
const CLIENT_LNG = 2.4183
const START_LAT  = 6.3790
const START_LNG  = 2.4040

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatAppointmentDate(date: string) {
  if (date === "Aujourd'hui" || date === 'today' || date === toLocalIsoDate(new Date())) return "Aujourd'hui"
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── Helper: check if tracking should be active ────────────────────────────────
function getTrackingState(date: string, time: string): {
  active: boolean
  label: string
  subLabel: string
} {
  const now = new Date()
  const isToday = date === "Aujourd'hui" || date === 'today' || date === now.toLocaleDateString('fr-FR') || date === toLocalIsoDate(now)

  if (!isToday) {
    return {
      active: false,
      label: `Rendez-vous ${formatAppointmentDate(date)}`,
      subLabel: `à ${time} — Le suivi démarrera 30 min avant l'heure de la prestation`,
    }
  }

  const [h, m] = time.split(':').map(Number)
  const apptMins = h * 60 + m
  const nowMins  = now.getHours() * 60 + now.getMinutes()
  const diff     = apptMins - nowMins

  if (diff > 30) {
    const rem = Math.ceil(diff - 30)
    return {
      active: false,
      label: `Prestation à ${time}`,
      subLabel: `Le suivi en direct démarrera dans ${rem} min`,
    }
  }

  return { active: true, label: '', subLabel: '' }
}

// ── Sound notification hook ───────────────────────────────────────────────────
function useProviderNotifications(progress: number, isTracking: boolean) {
  const notified = useRef({ start: false, close: false, arrived: false })

  const playBeep = (freq: number, duration: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {}
  }

  useEffect(() => {
    if (!isTracking) return

    // Started moving (progress > 2%)
    if (progress > 0.02 && !notified.current.start) {
      notified.current.start = true
      playBeep(880, 0.3)
      setTimeout(() => playBeep(1100, 0.3), 350)
    }

    // Close (progress > 85%)
    if (progress > 0.85 && !notified.current.close) {
      notified.current.close = true
      playBeep(660, 0.2)
      setTimeout(() => playBeep(880, 0.2), 250)
      setTimeout(() => playBeep(1100, 0.3), 500)
    }

    // Arrived
    if (progress >= 1 && !notified.current.arrived) {
      notified.current.arrived = true
      playBeep(1100, 0.15)
      setTimeout(() => playBeep(1320, 0.15), 180)
      setTimeout(() => playBeep(1760, 0.4), 360)
    }
  }, [progress, isTracking])
}

export default function ProviderTrackingScreen({
  onBack,
  onMessage,
  appointmentDate = "Aujourd'hui",
  appointmentTime = '14:25',
}: ProviderTrackingScreenProps) {
  const provider = MOCK_PROVIDER
  const { active, label, subLabel } = getTrackingState(appointmentDate, appointmentTime)

  const [progress, setProgress] = useState(0)
  const [etaMins, setEtaMins]   = useState(8)

  // Simulate movement only when tracking is active
  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setProgress(p => Math.min(1, p + 0.004))
      setEtaMins(m => Math.max(0, m - 0.06))
    }, 300)
    return () => clearInterval(iv)
  }, [active])

  useProviderNotifications(progress, active)

  const provLat    = START_LAT + (CLIENT_LAT - START_LAT) * progress
  const provLng    = START_LNG + (CLIENT_LNG - START_LNG) * progress
  const etaLabel   = etaMins < 1 ? 'Presque arrivé !' : `${Math.ceil(etaMins)} min`
  const statusText = progress >= 1 ? 'Arrivé !' : 'En route'
  const distKm     = ((1 - progress) * 1.5).toFixed(1)

  // ── Not yet time ─────────────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
            <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2.5} />
          </button>
          <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Suivi Prestataire</h1>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          {/* Illustration */}
          <div className="w-20 h-20 rounded-3xl bg-[#2d7ff9]/10 flex items-center justify-center">
            <Calendar size={36} className="text-[#2d7ff9]" />
          </div>

          <div>
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">{label}</h2>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-[280px]">{subLabel}</p>
          </div>

          {/* Provider card */}
          <div className="w-full p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-left">
            <div className="flex items-center gap-3">
              <img src={provider.avatar} alt={provider.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{provider.name}</p>
                  <div className="w-4 h-4 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">✓</span>
                  </div>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)]">{provider.role}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={11} className="text-[#2d7ff9]" />
                  <span className="text-[12px] font-semibold text-[#2d7ff9]">{appointmentTime}</span>
                  <span className="text-[12px] text-[var(--text-secondary)]">· {formatAppointmentDate(appointmentDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <a href="tel:+22901971122"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-[var(--text-primary)]" />
            </a>
            <button onClick={onMessage}
              className="flex-1 h-12 rounded-2xl bg-[#2d7ff9] flex items-center justify-center gap-2 font-bold text-white text-[14px]">
              <MessageSquare size={17} />
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active tracking with live map ─────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Map area */}
      <div className="relative flex-1 min-h-0">
        <MapPicker
          lat={provLat} lng={provLng}
          readonly height={9999} zoom={15}
          markerLabel={`${provider.name} — ${statusText}`}
        />

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <button onClick={onBack} style={{ pointerEvents: 'all' }}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100 active:scale-95 transition-transform">
            <ChevronLeft size={20} className="text-gray-800" strokeWidth={2.5} />
          </button>
          <button style={{ pointerEvents: 'all' }}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100">
            <MoreHorizontal size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Status pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl border ${progress >= 1 ? 'bg-green-500 border-green-400' : 'bg-white border-gray-100'}`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${progress >= 1 ? 'bg-white' : 'bg-[#2d7ff9] pulse-dot'}`} />
            <span className={`text-[13px] font-bold ${progress >= 1 ? 'text-white' : 'text-gray-800'}`}>
              {statusText} · {etaLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-[var(--bg-card)] border-t border-[var(--border)] px-4 pt-3 pb-5 flex-shrink-0">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img src={provider.avatar} alt={provider.name}
            className="w-[54px] h-[54px] rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{provider.name}</h3>
              <div className="w-4 h-4 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">{provider.role}</p>
            <div className="flex items-center gap-1"><span className="text-yellow-400 text-[12px]">★</span><span className="text-[12px] font-semibold text-[var(--text-primary)]">{provider.rating}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'SERVICE', value: provider.service ?? '—' },
            { label: 'HEURE',   value: appointmentTime },
            { label: 'PRIX',    value: provider.price ?? '—' },
          ].map(item => (
            <div key={item.label} className="bg-[var(--bg-surface)] rounded-xl p-2.5 border border-[var(--border)]">
              <p className="text-[9px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-1">{item.label}</p>
              <p className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-3">
          <a href="tel:+22901971122"
            className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center active:scale-95 transition-transform">
            <Phone size={18} className="text-[var(--text-primary)]" />
          </a>
          <button onClick={onMessage}
            className="flex-1 h-12 rounded-2xl bg-[#2d7ff9] flex items-center justify-center gap-2 font-bold text-white text-[14px]">
            <MessageSquare size={17} />
            Contacter {provider.name.split(' ')[0]}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${progress >= 1 ? 'bg-green-500' : 'bg-[#2d7ff9] pulse-dot'}`} />
            <div>
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">{statusText}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{distKm} km de chez vous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
