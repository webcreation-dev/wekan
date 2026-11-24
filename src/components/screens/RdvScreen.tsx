'use client'

import { useEffect, useState } from 'react'
import { Calendar, CheckCircle, ChevronRight, ClipboardList, MapPin, Mic, Phone, UserRound, Wallet, XCircle } from 'lucide-react'
import { RequestStatus, Screen, ServiceRequest } from '@/types'
import { useRequestsStore } from '@/store/requestsStore'
import { useAuthStore } from '@/store/authStore'
import TabBar from '@/components/ui/TabBar'
import AppHeader from '@/components/ui/AppHeader'

interface RdvScreenProps {
  onNavigate: (screen: Screen) => void
  onViewTracking: (appt: { requestId: string; date: string; time: string }) => void
  onViewInvoice: () => void
  /** Ouvre la conversation de la demande (pour compléter les informations) */
  onOpenChat: (requestId: string) => void
  /** Ouvre le paiement (avance) d'une demande dont le prix est fixé */
  onPay: (requestId: string) => void
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; Icon: typeof CheckCircle; className: string }> = {
  awaiting_call: { label: 'En attente', Icon: Phone,       className: 'bg-amber-500/10 text-amber-600' },
  scheduled:     { label: 'Planifiée',          Icon: Calendar,    className: 'bg-[#2d7ff9]/10 text-[#2d7ff9]' },
  completed:     { label: 'Terminée',           Icon: CheckCircle, className: 'bg-emerald-500/10 text-emerald-600' },
  cancelled:     { label: 'Annulée',            Icon: XCircle,     className: 'bg-red-500/10 text-red-500' },
}

type Tab = 'ongoing' | 'past'

function InfoCell({ icon: Icon, label, value, hint }: { icon: typeof Calendar; label: string; value?: string; hint?: string }) {
  return (
    <div className="flex-1 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5">
      <p className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]"><Icon size={12} /> {label}</p>
      <p className={`mt-0.5 text-[13px] font-bold ${value ? 'text-[var(--text-primary)]' : 'italic text-[var(--text-muted)]'}`}>
        {value ?? 'À définir'}
      </p>
      {hint && <p className="mt-0.5 text-[10px] font-medium text-emerald-600">{hint}</p>}
    </div>
  )
}

function RequestCard({ request, onViewTracking, onViewInvoice, onComplete, onPay }: {
  request: ServiceRequest
  onViewTracking: RdvScreenProps['onViewTracking']
  onViewInvoice: () => void
  onComplete: () => void
  onPay: () => void
}) {
  const cfg = STATUS_CONFIG[request.status]
  const StatusIcon = cfg.Icon
  const when = request.date ? `${request.date}${request.time ? ` à ${request.time}` : ''}` : undefined
  const price = request.price != null ? `${request.price.toLocaleString('fr-FR')} FCFA` : undefined
  // Tant que l'agent n'a pas appelé, la carte reste minimale (pas de vocal, lieu, date ni prix)
  const awaitingCall = request.status === 'awaiting_call'
  const paid = request.paidAmount ?? 0
  const remaining = request.price != null ? Math.max(0, request.price - paid) : 0
  // Vocaux envoyés par le client (étape 2 + conversation)
  const voices = request.messages.filter(m => m.sender === 'user' && m.voiceNote)
  const firstVoice = voices[0]?.voiceNote

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <img src={request.serviceImage} alt="" className="h-12 w-12 flex-shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[15px] font-bold text-[var(--text-primary)]">{request.serviceName}</p>
            <span className={`flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.className}`}>
              <StatusIcon size={12} /> {cfg.label}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">#{request.ref} · {request.createdAt}</p>
        </div>
      </div>

      {/* Le souci */}
      {(request.description || firstVoice) && (
        <div className="mt-3 space-y-1.5">
          {firstVoice && (
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#2d7ff9]">
              <Mic size={13} />
              {voices.length > 1
                ? `${voices.length} messages vocaux`
                : `Message vocal · ${Math.floor(firstVoice.durationSec / 60)}:${String(firstVoice.durationSec % 60).padStart(2, '0')}`}
            </p>
          )}
          {request.description && <p className="line-clamp-2 text-[13px] text-[var(--text-secondary)]">{request.description}</p>}
        </div>
      )}

      {!awaitingCall && (
        <>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
            <MapPin size={13} className="text-[var(--text-muted)]" /> {request.location?.label ?? 'Lieu à préciser'}
          </p>

          {/* Date et prix : renseignés par l'agent après l'appel */}
          <div className="mt-3 flex gap-2">
            <InfoCell icon={Calendar} label="Rendez-vous" value={when} />
            <InfoCell icon={Wallet} label="Prix" value={price} hint={paid > 0 && remaining > 0 ? `Payé ${paid.toLocaleString('fr-FR')} · reste ${remaining.toLocaleString('fr-FR')}` : undefined} />
          </div>
        </>
      )}

      {request.status === 'awaiting_call' && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5 text-[12px] font-medium text-amber-700 dark:text-amber-400">
          <Phone size={14} className="flex-shrink-0" />
          Un agent va vous appeler pour fixer la date et le prix.
        </p>
      )}

      {awaitingCall && (
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9edf3] text-[var(--text-muted)] dark:bg-white/10">
            <UserRound size={16} />
          </span>
          <button onClick={onComplete} className="flex items-center gap-1 rounded-xl bg-[#2d7ff9] px-3 py-1.5 text-[12px] font-semibold text-white">
            Compléter des informations <ChevronRight size={13} />
          </button>
        </div>
      )}

      {request.status === 'scheduled' && request.date && request.time && (
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
          {request.providerName ? (
            <span className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
              {request.providerAvatar && <img src={request.providerAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />}
              {request.providerName}
            </span>
          ) : <span />}
          <div className="flex gap-2">
            <button
              onClick={() => onViewTracking({ requestId: request.id, date: request.date!, time: request.time! })}
              className="flex items-center gap-1 rounded-xl bg-[#2d7ff9] px-3 py-1.5 text-[12px] font-semibold text-white"
            >
              Suivi <ChevronRight size={13} />
            </button>
            {request.price != null && (remaining > 0 ? (
              <button onClick={onPay} className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white">
                Payer <ChevronRight size={13} />
              </button>
            ) : (
              <span className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-600">
                <CheckCircle size={13} /> Payé
              </span>
            ))}
          </div>
        </div>
      )}

      {request.status === 'completed' && (
        <div className="mt-3 flex justify-end border-t border-[var(--border)] pt-3">
          <button onClick={onViewInvoice} className="flex items-center gap-1 text-[12px] font-semibold text-[var(--text-muted)]">
            Facture <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function RdvScreen({ onNavigate, onViewTracking, onViewInvoice, onOpenChat, onPay }: RdvScreenProps) {
  const requests = useRequestsStore(state => state.requests)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  // Actualise à l'ouverture (nouvelles réponses, date et prix fixés par l'agent)
  useEffect(() => { if (isAuthenticated) useRequestsStore.getState().loadRequests() }, [isAuthenticated])
  const [tab, setTab] = useState<Tab>('ongoing')
  const ongoing = requests.filter(r => r.status === 'awaiting_call' || r.status === 'scheduled')
  const past = requests.filter(r => r.status === 'completed' || r.status === 'cancelled')
  const displayed = tab === 'ongoing' ? ongoing : past

  return (
    <div className="relative flex h-full flex-col bg-[var(--bg-primary)]">
      <div className="screen-scroll flex-1 overflow-y-auto pb-28">
        <header className="px-4 pb-3 pt-5">
          <AppHeader title="Mes demandes" onNavigate={onNavigate} />
        </header>

        <div className="mx-4 mb-4 flex rounded-2xl bg-[var(--bg-card)] p-1 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          {([['ongoing', 'En cours', ongoing.length], ['past', 'Terminées', past.length]] as [Tab, string, number][]).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-[14px] font-semibold transition-colors ${
                tab === key ? 'bg-[#2d7ff9] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 text-[11px] ${tab === key ? 'bg-white/25' : 'bg-[var(--bg-primary)]'}`}>{count}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 px-4">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <ClipboardList size={40} className="text-[var(--text-muted)]" />
              <p className="text-[14px] text-[var(--text-muted)]">
                {tab === 'ongoing' ? 'Aucune demande en cours' : 'Aucune demande terminée'}
              </p>
              {tab === 'ongoing' && (
                <button onClick={() => onNavigate('home')} className="text-[13px] font-semibold text-[#2d7ff9]">Faire une demande</button>
              )}
              {!isAuthenticated && (
                <button onClick={() => onNavigate('login')} className="text-[13px] font-semibold text-[#2d7ff9]">Se connecter</button>
              )}
            </div>
          ) : displayed.map(request => (
            <RequestCard key={request.id} request={request} onViewTracking={onViewTracking} onViewInvoice={onViewInvoice} onComplete={() => onOpenChat(request.id)} onPay={() => onPay(request.id)} />
          ))}
        </div>
      </div>

      <TabBar active="rdv" onNavigate={onNavigate} />
    </div>
  )
}
