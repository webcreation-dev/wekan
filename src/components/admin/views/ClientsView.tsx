'use client'

import { useState } from 'react'
import { Search, Star, ShieldCheck, Ban } from 'lucide-react'
import { formatAmount } from '@/components/admin/ui/AdminUI'
import { MOCK_ADMIN_CLIENTS } from '@/data/admin/mock'
import { AdminClient } from '@/types/admin'

export default function ClientsView() {
  const [clients] = useState<AdminClient[]>(MOCK_ADMIN_CLIENTS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminClient | null>(null)

  const filtered = clients.filter(c =>
    !search ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-9 w-[280px]">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, téléphone..." className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
          <span className="text-[12px] text-[var(--text-muted)]">{filtered.length} client(s)</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[var(--bg-surface)] z-10">
              <tr>
                {['Client', 'Téléphone', 'Zone', 'Demandes', 'Dépenses totales', 'Dernière activité', 'Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)}
                  className={`border-b border-[var(--border)] cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-[#2d7ff9]/5' : 'hover:bg-[var(--bg-surface)]'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={`${c.firstName} ${c.lastName}`} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-bold text-[var(--text-primary)]">{c.firstName} {c.lastName}</p>
                          {c.isPremium && <span className="text-[9px] font-bold text-[#2d7ff9] bg-[#2d7ff9]/10 px-1.5 py-0.5 rounded">PREMIUM</span>}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">{c.email ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">{c.phone}</td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{c.zone}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">
                    {c.completedRequests}/{c.totalRequests}
                    <p className="text-[10px] text-[var(--text-muted)]">{c.totalRequests - c.completedRequests} en cours</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)]">{formatAmount(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{c.lastActivity}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${c.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-400/10 text-red-400'}`}>
                      {c.status === 'active' ? 'Actif' : 'Bloqué'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="w-[280px] flex-shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] p-5 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-5">
            <img src={selected.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover mb-3" />
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-[16px] font-bold text-[var(--text-primary)]">{selected.firstName} {selected.lastName}</p>
              {selected.isPremium && <Star size={14} className="text-yellow-400" fill="#FACC15" />}
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">{selected.phone}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Demandes', value: selected.totalRequests },
              { label: 'Terminées', value: selected.completedRequests },
              { label: 'Dépenses', value: `${(selected.totalSpent / 1000).toFixed(0)}k` },
              { label: 'Inscrit', value: selected.joinedAt.split('-')[0] },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                <p className="text-[15px] font-bold text-[var(--text-primary)]">{item.value}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Adresse</span><span className="font-medium text-[var(--text-primary)] text-right max-w-[140px] leading-tight">{selected.address}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Zone</span><span className="font-medium text-[var(--text-primary)]">{selected.zone}</span></div>
          </div>
          <div className="flex gap-2 mt-5">
            <button className="flex-1 h-9 rounded-xl border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)] flex items-center justify-center gap-1 hover:bg-[var(--bg-surface)]">
              <ShieldCheck size={13} /> Vérifier
            </button>
            <button className="flex-1 h-9 rounded-xl border border-red-400/30 text-[12px] font-semibold text-red-400 flex items-center justify-center gap-1 hover:bg-red-400/10">
              <Ban size={13} /> Bloquer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
