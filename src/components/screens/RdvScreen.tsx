'use client'

import { useState } from 'react'
import { Calendar, ChevronRight, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Screen, AppointmentStatus } from '@/types'
import { useAppointments } from '@/hooks/useAppointments'
import TabBar from '@/components/ui/TabBar'

interface RdvScreenProps {
  onNavigate: (screen: Screen) => void
  onViewTracking: (appt: { date: string; time: string }) => void
  onViewInvoice: () => void
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; Icon: typeof CheckCircle; color: string; bg: string }> = {
  confirmed: { label: 'Confirmé',    Icon: CheckCircle, color: 'text-[#2d7ff9]',  bg: 'bg-[#2d7ff9]/10' },
  pending:   { label: 'En attente',  Icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  completed: { label: 'Terminé',     Icon: CheckCircle, color: 'text-green-500',  bg: 'bg-green-500/10' },
  cancelled: { label: 'Annulé',      Icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-400/10' },
}

function isTrackingAvailable(date: string, time: string): { available: boolean; label: string } {
  const now = new Date()
  const todayStr = now.toLocaleDateString('fr-FR')
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const isToday = date === "Aujourd'hui" || date === todayStr || date === 'today' || date === todayIso

  if (!isToday) return { available: false, label: 'Suivi disponible le jour J' }

  const [h, m] = time.split(':').map(Number)
  const apptMins = h * 60 + m
  const nowMins  = now.getHours() * 60 + now.getMinutes()
  const diff = apptMins - nowMins

  if (diff > 30) {
    const rem = Math.ceil(diff - 30)
    return { available: false, label: `Suivi dans ${rem} min` }
  }
  return { available: true, label: 'Suivi en direct' }
}

type Tab = 'upcoming' | 'past'

export default function RdvScreen({ onNavigate, onViewTracking, onViewInvoice }: RdvScreenProps) {
  const { appointments, loading } = useAppointments()
  const [tab, setTab] = useState<Tab>('upcoming')
  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending')
  const past      = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')
  const displayed = tab === 'upcoming' ? upcoming : past

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="px-4 pt-5 pb-4 border-b border-[var(--border)]">
        <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Mes Rendez-vous</h1>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{upcoming.length} rendez-vous à venir</p>
      </div>

      <div className="flex px-4 pt-3 gap-5 border-b border-[var(--border)]">
        {([['upcoming', 'À venir'], ['past', 'Passés']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`pb-2.5 text-[14px] font-semibold border-b-2 transition-all ${tab === key ? 'border-[#2d7ff9] text-[#2d7ff9]' : 'border-transparent text-[var(--text-muted)]'}`}>
            {label}
            <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-[#2d7ff9]/15 text-[#2d7ff9]' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'}`}>
              {key === 'upcoming' ? upcoming.length : past.length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-3 pb-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[160px] rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] animate-pulse" />
          ))
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Calendar size={40} className="text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)] text-[14px]">
              Aucun rendez-vous {tab === 'upcoming' ? 'à venir' : 'passé'}
            </p>
          </div>
        ) : displayed.map(appt => {
          const cfg = STATUS_CONFIG[appt.status]
          const StatusIcon = cfg.Icon
          const tracking = isTrackingAvailable(appt.date, appt.time)

          return (
            <div key={appt.id} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              {/* Provider row */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <img src={appt.providerAvatar} alt={appt.providerName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">{appt.providerName}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{appt.providerRole}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${cfg.bg}`}>
                  <StatusIcon size={12} className={cfg.color} />
                  <span className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>

              <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-2">{appt.service}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-[var(--text-muted)]" />
                  <span className="text-[12px] text-[var(--text-secondary)]">{appt.date} à {appt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[var(--text-muted)]" />
                  <span className="text-[12px] text-[var(--text-secondary)] truncate">{appt.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                <span className="text-[14px] font-bold text-[#2d7ff9]">{appt.price}</span>
                <div className="flex gap-2">
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => onViewTracking({ date: appt.date, time: appt.time })}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
                        tracking.available
                          ? 'bg-[#2d7ff9] text-white'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]'
                      }`}
                    >
                      {tracking.label} <ChevronRight size={13} />
                    </button>
                  )}
                  {appt.status === 'completed' && (
                    <button onClick={onViewInvoice}
                      className="flex items-center gap-1 text-[12px] font-semibold text-[var(--text-muted)]">
                      Facture <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <TabBar active="rdv" onNavigate={onNavigate} />
    </div>
  )
}
