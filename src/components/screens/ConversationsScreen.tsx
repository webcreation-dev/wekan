'use client'

import { ArrowRight, MessageSquare, Mic } from 'lucide-react'
import { RequestStatus, Screen, ServiceRequest } from '@/types'
import { selectUnreadTotal, useRequestsStore, WEKAN_AGENT } from '@/store/requestsStore'
import { formatDuration } from '@/components/ui/VoiceNote'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import TabBar from '@/components/ui/TabBar'
import AppHeader from '@/components/ui/AppHeader'

interface ConversationsScreenProps {
  onNavigate: (screen: Screen) => void
  onOpenChat: (requestId: string) => void
}

const STATUS: Record<RequestStatus, { label: string; className: string }> = {
  awaiting_call: { label: 'En attente d’un appel', className: 'bg-amber-500/10 text-amber-600' },
  scheduled:     { label: 'Planifiée',  className: 'bg-[#2d7ff9]/10 text-[#2d7ff9]' },
  completed:     { label: 'Terminée',   className: 'bg-emerald-500/10 text-emerald-600' },
  cancelled:     { label: 'Annulée',    className: 'bg-red-500/10 text-red-500' },
}

function PromoBanner({ onTap }: { onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="relative block h-[150px] w-full overflow-hidden rounded-[22px] bg-[#e8f1ff] text-left transition-transform active:scale-[0.98]"
    >
      {/* Photo à droite, fondue vers la gauche */}
      <img src="/elec1.jpeg" alt="" className="absolute inset-y-0 right-0 h-full w-[52%] object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#e8f1ff] from-45% via-[#e8f1ff]/70 via-60% to-transparent" />
      {/* Formes décoratives */}
      <div className="absolute -bottom-10 -left-8 h-24 w-32 rounded-full bg-[#2d7ff9]/25" />
      <div className="absolute -right-6 -top-10 h-20 w-28 rounded-full bg-white/50" />

      <div className="relative flex h-full flex-col justify-center px-4">
        <p className="max-w-[190px] text-[13px] font-bold leading-snug text-[#12326a]">
          Une panne, une fuite, un coup de peinture ?
        </p>
        <p className="text-[17px] font-extrabold leading-tight text-[#2d7ff9]">Un artisan dès demain !</p>
        <span className="mt-2.5 inline-flex w-fit items-center gap-2 rounded-full bg-[#2d7ff9] py-1 pl-1 pr-3 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(45,127,249,0.3)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#2d7ff9]">
            <ArrowRight size={12} strokeWidth={2.8} />
          </span>
          Faire une demande
        </span>
      </div>
    </button>
  )
}

/** Une ligne = une demande (ticket) et sa conversation. */
function ConversationRow({ request, onTap }: { request: ServiceRequest; onTap: () => void }) {
  const status = STATUS[request.status]
  const unread = request.unread > 0
  const last = request.messages[request.messages.length - 1]
  const avatar = request.providerAvatar ?? WEKAN_AGENT.avatar

  return (
    <button onClick={onTap} className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors active:bg-[var(--bg-surface)]">
      <img src={avatar} alt="" className="h-14 w-14 flex-shrink-0 rounded-full border border-[var(--border)] bg-white object-cover" />

      <div className="min-w-0 flex-1">
        {/* Ligne 1 : ticket + statut + heure */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="flex-shrink-0 text-[11px] font-semibold text-[var(--text-muted)]">#{request.ref}</span>
            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>{status.label}</span>
          </div>
          <span className={`flex-shrink-0 text-[12px] ${unread ? 'font-semibold text-[#2d7ff9]' : 'text-[var(--text-muted)]'}`}>{last?.time}</span>
        </div>

        {/* Ligne 2 : service demandé */}
        <p className={`mt-0.5 truncate text-[16px] text-[var(--text-primary)] ${unread ? 'font-bold' : 'font-semibold'}`}>{request.serviceName}</p>

        {/* Ligne 3 : dernier message + non lus */}
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className={`flex min-w-0 items-center gap-1 truncate text-[13px] ${unread ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
            {last?.sender === 'user' && <span className="flex-shrink-0 font-medium">Vous :</span>}
            {last?.voiceNote
              ? <><Mic size={13} className="flex-shrink-0 text-[#2d7ff9]" /> Message vocal · {formatDuration(last.voiceNote.durationSec)}</>
              : <span className="truncate">{last?.text}</span>}
          </p>
          {unread && (
            <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#2d7ff9] px-1.5 text-[11px] font-bold text-white">
              {request.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function ConversationsScreen({ onNavigate, onOpenChat }: ConversationsScreenProps) {
  const requests = useRequestsStore(state => state.requests)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  // Actualise à l'ouverture (nouvelles réponses, date et prix fixés par l'agent)
  useEffect(() => { if (isAuthenticated) useRequestsStore.getState().loadRequests() }, [isAuthenticated])
  const totalUnread = useRequestsStore(selectUnreadTotal)

  return (
    <div className="flex h-full flex-col bg-[var(--bg-primary)]">
      <div className="screen-scroll flex flex-1 flex-col overflow-y-auto">
        <header className="px-4 pb-5 pt-5">
          <AppHeader title="Messages" onNavigate={onNavigate} />
          <div className="mt-5">
            <PromoBanner onTap={() => onNavigate('home')} />
          </div>
        </header>

        {/* Liste : une conversation par demande */}
        <section className="flex-1 rounded-t-[32px] bg-[var(--bg-card)] pb-28 pt-3 shadow-[0_-4px_20px_rgba(15,23,42,0.04)]">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
              <MessageSquare size={40} className="text-[var(--text-muted)]" />
              <p className="text-[14px] text-[var(--text-muted)]">Aucune conversation</p>
              <p className="text-[12px] text-[var(--text-muted)]">Chaque demande que vous faites ouvre une conversation. Elle apparaîtra ici.</p>
              {!isAuthenticated && (
                <button onClick={() => onNavigate('login')} className="text-[13px] font-semibold text-[#2d7ff9]">Se connecter</button>
              )}
            </div>
          ) : (
            requests.map(request => <ConversationRow key={request.id} request={request} onTap={() => onOpenChat(request.id)} />)
          )}
        </section>
      </div>

      <TabBar active="conversations" onNavigate={onNavigate} msgCount={totalUnread} />
    </div>
  )
}
