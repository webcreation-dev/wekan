'use client'

import { Bell, UserRound } from 'lucide-react'
import { Screen } from '@/types'
import { useAuthStore } from '@/store/authStore'

interface AppHeaderProps {
  /** Titre texte au centre. Omis → logo Wekan. */
  title?: string
  onNavigate: (screen: Screen) => void
}

/** En-tête des pages principales : notifications à gauche, titre ou logo au centre, profil à droite. */
export default function AppHeader({ title, onNavigate }: AppHeaderProps) {
  const user = useAuthStore(state => state.user)

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Notifications : rond blanc, icône pleine colorée */}
      <button
        onClick={() => onNavigate('notifications')}
        aria-label="Voir les notifications"
        className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-card)] shadow-[0_3px_12px_rgba(15,23,42,0.12)] transition-transform active:scale-95 dark:border dark:border-white/10"
      >
        <Bell size={18} strokeWidth={2} className="fill-[#e5383b] text-[#e5383b]" />
      </button>

      {title
        ? <h1 className="truncate text-[22px] font-bold tracking-[-0.03em] text-[var(--text-primary)]">{title}</h1>
        : <img src="/logo-wordmark.png" alt="Wekan" className="h-9 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert" />}

      {/* Profil : rond couleur marque, liseré blanc, icône contour blanche */}
      <button
        onClick={() => onNavigate('profil')}
        aria-label="Mon profil"
        className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2d7ff9] text-white shadow-[0_3px_12px_rgba(15,23,42,0.18)] ring-[2.5px] ring-white transition-transform active:scale-95 dark:ring-white/20"
      >
        {user?.avatar
          ? <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          : <UserRound size={19} strokeWidth={2} />}
      </button>
    </div>
  )
}
