'use client'

import { ChevronRight, Star, MapPin, Phone, Bell, Shield, HelpCircle, FileText, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Screen } from '@/types'
import { useAuthStore } from '@/store/authStore'
import TabBar from '@/components/ui/TabBar'

interface ProfilScreenProps {
  onNavigate: (screen: any) => void
  onLogout: () => void
}

const menuSections = [
  {
    title: 'Mon compte',
    items: [
      { icon: MapPin,      label: 'Mes adresses',               nav: 'adresses',        color: 'text-[#2d7ff9]',    bg: 'bg-[#2d7ff9]/10' },
      { icon: Phone,       label: 'Numéro de téléphone',        nav: 'phone',           color: 'text-green-500',    bg: 'bg-green-500/10' },
    ],
  },
  {
    title: 'Préférences',
    items: [
      { icon: Bell,        label: 'Notifications',              nav: 'parametres-notif',color: 'text-yellow-500',   bg: 'bg-yellow-500/10' },
      { icon: Shield,      label: 'Confidentialité & Sécurité', nav: 'confidentialite', color: 'text-red-400',      bg: 'bg-red-400/10' },
    ],
  },
  {
    title: 'Aide',
    items: [
      { icon: HelpCircle,  label: "Centre d'aide",              nav: 'aide',            color: 'text-[#2d7ff9]',   bg: 'bg-[#2d7ff9]/10' },
      { icon: FileText,    label: "Conditions d'utilisation",   nav: 'cgu',             color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--bg-surface)]' },
    ],
  },
]

export default function ProfilScreen({ onNavigate, onLogout }: ProfilScreenProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const user = useAuthStore(s => s.user)
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Utilisateur'
  const phone = user?.phone ? `+229 ${user.phone}` : '—'
  const initial = user?.firstName?.[0] ?? 'U'

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex-1 overflow-y-auto screen-scroll">
        {/* Avatar header */}
        <div className="px-4 pt-6 pb-5 bg-[var(--bg-card)] border-b border-[var(--border)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#2d7ff9] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <span className="text-white text-[24px] font-bold">{initial}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{fullName}</h2>
              <p className="text-[13px] text-[var(--text-secondary)]">{phone}</p>
              {user?.isPremium && (
                <div className="flex items-center gap-1 mt-1">
                  <Star size={11} className="text-[#2d7ff9]" fill="#2d7ff9" />
                  <span className="text-[11px] font-bold text-[#2d7ff9]">Membre Premium</span>
                </div>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="flex rounded-2xl overflow-hidden border border-[var(--border)]">
            {[{ label: 'Services', value: '12' }, { label: 'En cours', value: '1' }, { label: 'Avis', value: '8' }].map((s, i) => (
              <div key={s.label} className={`flex-1 flex flex-col items-center py-3 bg-[var(--bg-surface)] ${i < 2 ? 'border-r border-[var(--border)]' : ''}`}>
                <p className="text-[18px] font-bold text-[var(--text-primary)]">{s.value}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 pt-4 pb-2 space-y-4">
          {menuSections.map(section => (
            <div key={section.title}>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-2 px-1">{section.title}</p>
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
                {section.items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <button key={item.label} onClick={() => onNavigate(item.nav as any)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 active:bg-[var(--bg-surface)] transition-colors ${i < section.items.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}>
                          <Icon size={16} className={item.color} />
                        </div>
                        <span className="text-[14px] font-medium text-[var(--text-primary)]">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Apparence */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-2 px-1">Apparence</p>
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-500/10">
                    {mounted && theme === 'dark' ? <Moon size={16} className="text-slate-400" /> : <Sun size={16} className="text-yellow-500" />}
                  </div>
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">
                    Mode {mounted && theme === 'dark' ? 'Sombre' : 'Clair'}
                  </span>
                </div>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${mounted && theme === 'dark' ? 'bg-[#2d7ff9]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${mounted && theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Déconnexion */}
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-400/30 bg-red-400/5 active:bg-red-400/10 transition-colors">
            <LogOut size={18} className="text-red-400" />
            <span className="text-[15px] font-bold text-red-400">Se déconnecter</span>
          </button>
          <p className="text-center text-[11px] text-[var(--text-muted)] pb-4">Wekan v1.0.0 · Bénin</p>
        </div>
      </div>
      <TabBar active="profil" onNavigate={nav => onNavigate(nav as Screen)} />
    </div>
  )
}
