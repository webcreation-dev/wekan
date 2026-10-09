'use client'

import { Home, Calendar, Bell, MessageSquare, User } from 'lucide-react'
import { Screen } from '@/types'

interface TabBarProps {
  active: string
  onNavigate: (screen: Screen) => void
  notifCount?: number
  msgCount?: number
}

const tabs = [
  { id: 'home',          label: 'Accueil',       icon: Home,          screen: 'home'          as Screen },
  { id: 'rdv',           label: 'RDV',            icon: Calendar,      screen: 'rdv'           as Screen },
  { id: 'notifications', label: 'Notifications',  icon: Bell,          screen: 'notifications' as Screen },
  { id: 'conversations', label: 'Messagerie',     icon: MessageSquare, screen: 'conversations' as Screen },
  { id: 'profil',        label: 'Profil',         icon: User,          screen: 'profil'        as Screen },
]

export default function TabBar({ active, onNavigate, notifCount = 0, msgCount = 0 }: TabBarProps) {
  return (
    <div className="flex-shrink-0 bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          const badge = tab.id === 'notifications' ? notifCount : tab.id === 'conversations' ? msgCount : 0
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.screen)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all relative flex-1"
            >
              <div className="relative">
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'text-[#2d7ff9]' : 'text-[var(--text-muted)]'} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-[#2d7ff9]' : 'text-[var(--text-muted)]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
