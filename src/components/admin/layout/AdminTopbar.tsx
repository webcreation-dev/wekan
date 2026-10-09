'use client'

import { Bell, Search, Sun, Moon, User, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { AdminView } from '@/types/admin'

const VIEW_TITLES: Record<AdminView, string> = {
  dashboard:  'Tableau de bord',
  requests:   'Gestion des Demandes',
  providers:  'Prestataires',
  clients:    'Clients',
  finance:    'Finance & Paiements',
  services:   'Catalogue des Services',
  admins:     'Administrateurs',
  settings:   'Paramètres',
}

interface AdminTopbarProps {
  view: AdminView
  role: 'superadmin' | 'admin'
  onShowProfile: () => void
}

export default function AdminTopbar({ view, role, onShowProfile }: AdminTopbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => { setMounted(true) }, [])

  // Live clock
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(iv)
  }, [])

  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
      <div>
        <h1 className="text-[16px] font-bold text-[var(--text-primary)]">{VIEW_TITLES[view]}</h1>
        <p className="text-[11px] text-[var(--text-muted)] capitalize">{dateStr} · {timeStr}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-9 w-[200px]">
          <Search size={14} className="text-[var(--text-muted)]" />
          <input type="text" placeholder="Rechercher..." className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center">
          <Bell size={16} className="text-[var(--text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Theme */}
        {mounted && (
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center">
            {theme === 'dark' ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} className="text-[var(--text-secondary)]" />}
          </button>
        )}

        {/* Admin profile */}
        <button onClick={onShowProfile} className="flex items-center gap-2 pl-3 border-l border-[var(--border)] hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#2d7ff9] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[13px] font-bold">A</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[var(--text-primary)] leading-none">Admin</p>
            <p className="text-[10px] text-[var(--text-muted)]">{role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
          </div>
          <ChevronDown size={13} className="text-[var(--text-muted)]" />
        </button>
      </div>
    </header>
  )
}
