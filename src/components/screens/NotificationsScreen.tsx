'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Info, Tag, AlertTriangle, ChevronRight } from 'lucide-react'
import { Screen, Notification } from '@/types'
import { MOCK_NOTIFICATIONS } from '@/data/mock'
import TabBar from '@/components/ui/TabBar'

interface NotificationsScreenProps {
  onNavigate: (screen: Screen, serviceId?: string) => void
  onViewServicePage: (serviceId: string) => void
}

const TYPE_CONFIG = {
  success: { icon: CheckCircle, color: 'text-green-500',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  info:    { icon: Info,         color: 'text-[#2d7ff9]', bg: 'bg-[#2d7ff9]/10', border: 'border-[#2d7ff9]/20' },
  promo:   { icon: Tag,          color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  warning: { icon: AlertTriangle,color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
}

export default function NotificationsScreen({ onNavigate, onViewServicePage }: NotificationsScreenProps) {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-[20px] font-bold text-[var(--text-primary)]">Notifications</h1>
          {unreadCount > 0 && <p className="text-[12px] text-[var(--text-secondary)]">{unreadCount} non lue(s)</p>}
        </div>
        {unreadCount > 0 && <button onClick={markAllRead} className="text-[12px] font-semibold text-[#2d7ff9]">Tout marquer lu</button>}
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Bell size={40} className="text-[var(--text-muted)]" />
            <p className="text-[14px] text-[var(--text-muted)]">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {notifs.map(notif => {
              const cfg = TYPE_CONFIG[notif.type]
              const Icon = cfg.icon
              return (
                <div key={notif.id} className={`flex items-start gap-3 px-4 py-4 ${!notif.read ? 'bg-[#2d7ff9]/4' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg} border ${cfg.border}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[14px] text-[var(--text-primary)] leading-tight ${!notif.read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</p>
                      <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap flex-shrink-0 mt-0.5">{notif.time}</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{notif.body}</p>

                    {/* Promo/info → service page (description), NOT booking flow */}
                    {notif.serviceId && (notif.type === 'promo' || notif.type === 'info') && (
                      <button
                        onClick={() => { markRead(notif.id); onViewServicePage(notif.serviceId!) }}
                        className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-[#2d7ff9]"
                      >
                        Voir le service <ChevronRight size={11} />
                      </button>
                    )}

                    {/* Success (assigned provider) → tracking */}
                    {notif.type === 'success' && notif.serviceId && (
                      <button
                        onClick={() => { markRead(notif.id); onNavigate('provider-tracking') }}
                        className="flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-green-500"
                      >
                        Suivre le prestataire <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-[#2d7ff9] flex-shrink-0 mt-2" />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <TabBar active="notifications" onNavigate={screen => onNavigate(screen)} notifCount={unreadCount} />
    </div>
  )
}
