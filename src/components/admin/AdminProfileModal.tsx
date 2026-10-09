'use client'

import { X, Mail, Phone, Shield, Calendar, Key } from 'lucide-react'

interface AdminProfileModalProps {
  role: 'superadmin' | 'admin'
  onClose: () => void
}

export default function AdminProfileModal({ role, onClose }: AdminProfileModalProps) {
  const profile = role === 'superadmin'
    ? { name: 'Super Administrateur', username: 'superadmin', email: 'superadmin@homefix.bj', phone: '+229 97 00 00 01', since: '01 Jan 2024', lastLogin: "Aujourd'hui à 08:30" }
    : { name: 'Jean Koudou', username: 'jkoudou', email: 'jean.k@homefix.bj', phone: '+229 96 12 34 56', since: '10 Jun 2024', lastLogin: 'Hier à 14:22' }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="w-[400px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Mon profil</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
            <X size={16} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-6 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-2xl bg-[#2d7ff9] flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
            <span className="text-white text-[28px] font-bold">{profile.name[0]}</span>
          </div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">{profile.name}</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">@{profile.username}</p>
          <span className={`mt-2 text-[11px] font-bold px-3 py-1 rounded-full ${role === 'superadmin' ? 'bg-purple-500/10 text-purple-500' : 'bg-[#2d7ff9]/10 text-[#2d7ff9]'}`}>
            {role === 'superadmin' ? 'Super Admin' : 'Administrateur'}
          </span>
        </div>

        {/* Info rows */}
        <div className="p-5 space-y-3">
          {[
            { icon: Mail,     label: 'Email',              val: profile.email },
            { icon: Phone,    label: 'Téléphone',          val: profile.phone },
            { icon: Shield,   label: 'Rôle',               val: role === 'superadmin' ? 'Super Administrateur' : 'Administrateur' },
            { icon: Calendar, label: 'Membre depuis',      val: profile.since },
            { icon: Key,      label: 'Dernière connexion', val: profile.lastLogin },
          ].map(row => {
            const Icon = row.icon
            return (
              <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                <div className="w-8 h-8 rounded-lg bg-[#2d7ff9]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[#2d7ff9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase">{row.label}</p>
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{row.val}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
