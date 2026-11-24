'use client'

import { motion } from 'framer-motion'
import { Home, ClipboardList, MessageCircle, type LucideIcon } from 'lucide-react'
import { Screen } from '@/types'
import { selectUnreadTotal, useRequestsStore } from '@/store/requestsStore'

interface TabBarProps {
  active: string
  onNavigate: (screen: Screen) => void
  msgCount?: number
}

interface Tab {
  id: string
  label: string
  icon: LucideIcon
  screen: Screen
}

// Ordre affiché de gauche à droite
const tabs: Tab[] = [
  { id: 'home',          label: 'Accueil',      icon: Home,          screen: 'home' },
  { id: 'rdv',           label: 'Demandes', icon: ClipboardList, screen: 'rdv' },
  { id: 'conversations', label: 'Messages',     icon: MessageCircle, screen: 'conversations' },
]

const ACCENT = '#2d7ff9'
const spring = { type: 'spring', stiffness: 420, damping: 34 } as const

export default function TabBar({ active, onNavigate, msgCount }: TabBarProps) {
  const unreadTotal = useRequestsStore(selectUnreadTotal)
  const unread = msgCount ?? unreadTotal
  return (
    // Barre flottante : superposée au bas du contenu (les écrans ont un pb-28 sur leur zone scrollable)
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none relative z-30 -mt-[84px] flex h-[84px] flex-shrink-0 items-start justify-center px-4"
    >
      <motion.div
        layout
        layoutId="tabbar-shell"
        transition={spring}
        className="pointer-events-auto flex h-[62px] items-center gap-1.5 rounded-full bg-[var(--bg-card)] px-[8px] shadow-[0_6px_24px_rgba(15,23,42,0.14)] dark:border dark:border-white/10"
      >
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = active === tab.id
          const badge = tab.id === 'conversations' ? unread : 0
          return (
            <motion.button
              layout
              key={tab.id}
              transition={spring}
              onClick={() => onNavigate(tab.screen)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex h-[46px] flex-shrink-0 items-center justify-center rounded-full active:scale-95 ${
                isActive ? 'gap-2 px-5 text-white' : 'w-[46px] text-[var(--text-primary)]'
              }`}
            >
              {/* Pilule active : un seul élément partagé qui glisse d'un onglet à l'autre */}
              {isActive && (
                <motion.span
                  layoutId="tabbar-active-pill"
                  transition={spring}
                  className="absolute inset-0 rounded-full shadow-[0_6px_14px_rgba(45,127,249,0.28)]"
                  style={{ backgroundColor: ACCENT }}
                />
              )}

              <motion.span layout="position" transition={spring} className="relative flex">
                <Icon size={22} strokeWidth={isActive ? 2.3 : 1.9} />
                {badge > 0 && (
                  <span className={`absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[9px] font-bold leading-none text-white ${
                    isActive ? 'border-[#2d7ff9]' : 'border-[var(--bg-card)]'
                  }`}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </motion.span>

              {isActive && (
                <motion.span
                  layout="position"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, opacity: { duration: 0.18, delay: 0.06 } }}
                  className="relative whitespace-nowrap text-[15px] font-semibold"
                >
                  {tab.label}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </nav>
  )
}
