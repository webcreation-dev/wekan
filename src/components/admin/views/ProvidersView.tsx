'use client'

import { useState } from 'react'
import { Search, Star, CheckCircle, XCircle, UserCheck, Plus, Pencil, Trash2, X } from 'lucide-react'
import { ProviderStatusBadge, formatAmount } from '@/components/admin/ui/AdminUI'
import { MOCK_ADMIN_PROVIDERS } from '@/data/admin/mock'
import { AdminProvider, ProviderStatus } from '@/types/admin'

const EMPTY: Omit<AdminProvider, 'id' | 'joinedAt' | 'lastActive'> = {
  name: '', phone: '', email: '', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  specialities: [], zone: '', rating: 0, reviewCount: 0, completedJobs: 0, activeJobs: 0,
  totalEarnings: 0, pendingPayout: 0, status: 'pending_verification', verified: false,
}

const SPECIALITIES_LIST = ['Électricité', 'Plomberie', 'Climatisation', 'Peinture', 'Maçonnerie', 'Menuiserie', 'Nettoyage', 'Mécanique', 'Informatique', 'Métallerie']
const ZONES = ['Cotonou / Plateau', 'Cotonou / Akpakpa', 'Cotonou / Fidjrossè', 'Cotonou / Cadjehoun', 'Abomey-Calavi', 'Calavi / Godomey', 'Porto-Novo']

export default function ProvidersView() {
  const [providers, setProviders] = useState<AdminProvider[]>(MOCK_ADMIN_PROVIDERS)
  const [filter, setFilter] = useState<ProviderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminProvider | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AdminProvider | null>(null)
  const [form, setForm] = useState<any>({...EMPTY})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const setF = (k: string) => (v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const filtered = providers.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialities.join(',').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openCreate = () => { setEditing(null); setForm({...EMPTY, specialities: []}); setShowModal(true) }
  const openEdit   = (p: AdminProvider) => { setEditing(p); setForm({...p}); setShowModal(true) }

  const handleSave = () => {
    if (!form.name || !form.phone) return
    if (editing) {
      setProviders(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p))
      if (selected?.id === editing.id) setSelected({ ...editing, ...form })
    } else {
      const newP: AdminProvider = { ...form, id: `prov-${Date.now()}`, joinedAt: new Date().toISOString().split('T')[0], lastActive: new Date().toISOString().split('T')[0] }
      setProviders(prev => [...prev, newP])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => { setProviders(prev => prev.filter(p => p.id !== id)); setDeleteId(null); if (selected?.id === id) setSelected(null) }

  const updateStatus = (id: string, status: ProviderStatus) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const FILTER_TABS: { label: string; value: ProviderStatus | 'all' }[] = [
    { label: 'Tous', value: 'all' }, { label: 'Actifs', value: 'active' },
    { label: 'En vérification', value: 'pending_verification' }, { label: 'Suspendus', value: 'suspended' },
  ]

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-9 w-[220px]">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, spécialité..." className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
          {FILTER_TABS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${filter === f.value ? 'bg-[#2d7ff9] text-white' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]'}`}>
              {f.label}
            </button>
          ))}
          <button onClick={openCreate}
            className="ml-auto flex items-center gap-2 h-9 px-4 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors">
            <Plus size={15} /> Ajouter
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[var(--bg-surface)] z-10">
              <tr>
                {['Prestataire', 'Spécialités', 'Zone', 'Note', 'Missions', 'Gains', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => setSelected(p)}
                  className={`border-b border-[var(--border)] cursor-pointer transition-colors ${selected?.id === p.id ? 'bg-[#2d7ff9]/5' : 'hover:bg-[var(--bg-surface)]'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                        {p.verified && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2d7ff9] border-2 border-[var(--bg-card)] flex items-center justify-center"><span className="text-white text-[6px] font-bold">✓</span></div>}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[var(--text-primary)]">{p.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{p.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.specialities.slice(0, 2).map(s => <span key={s} className="text-[10px] bg-[var(--bg-surface)] border border-[var(--border)] px-1.5 py-0.5 rounded-lg text-[var(--text-secondary)]">{s}</span>)}
                      {p.specialities.length > 2 && <span className="text-[10px] text-[var(--text-muted)]">+{p.specialities.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{p.zone}</td>
                  <td className="px-4 py-3">
                    {p.rating > 0 ? <div className="flex items-center gap-1"><Star size={12} className="text-yellow-400" fill="#FACC15" /><span className="text-[13px] font-semibold text-[var(--text-primary)]">{p.rating}</span></div>
                      : <span className="text-[11px] text-[var(--text-muted)] italic">Nouveau</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-primary)]">{p.completedJobs}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-[var(--text-primary)]">{p.totalEarnings > 0 ? formatAmount(p.totalEarnings) : '—'}</td>
                  <td className="px-4 py-3"><ProviderStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"><Pencil size={13} className="text-[var(--text-secondary)]" /></button>
                      {p.status === 'pending_verification' && <button onClick={() => updateStatus(p.id, 'active')} className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20"><UserCheck size={13} className="text-green-500" /></button>}
                      {p.status === 'active' && <button onClick={() => updateStatus(p.id, 'suspended')} className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20"><XCircle size={13} className="text-red-400" /></button>}
                      {p.status === 'suspended' && <button onClick={() => updateStatus(p.id, 'active')} className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20"><CheckCircle size={13} className="text-green-500" /></button>}
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"><Trash2 size={13} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-[280px] flex-shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] p-5 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-2">
              <img src={selected.avatar} alt={selected.name} className="w-16 h-16 rounded-2xl object-cover" />
              {selected.verified && <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2d7ff9] border-2 border-[var(--bg-card)] flex items-center justify-center"><span className="text-white text-[9px] font-bold">✓</span></div>}
            </div>
            <p className="text-[16px] font-bold text-[var(--text-primary)]">{selected.name}</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{selected.phone}</p>
            <div className="mt-2"><ProviderStatusBadge status={selected.status} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[{ label: 'Missions', value: selected.completedJobs }, { label: 'Note', value: selected.rating > 0 ? `${selected.rating}/5` : '—' }, { label: 'Gains', value: selected.totalEarnings > 0 ? `${(selected.totalEarnings/1000).toFixed(0)}k` : '—' }, { label: 'En attente', value: selected.pendingPayout > 0 ? `${(selected.pendingPayout/1000).toFixed(0)}k` : '0' }].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                <p className="text-[16px] font-bold text-[var(--text-primary)]">{item.value}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-[12px] mb-4">
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Zone</span><span className="font-medium text-[var(--text-primary)]">{selected.zone || '—'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Inscrit le</span><span className="font-medium text-[var(--text-primary)]">{selected.joinedAt}</span></div>
            <div className="flex flex-col gap-1"><span className="text-[var(--text-secondary)]">Spécialités</span><div className="flex flex-wrap gap-1 mt-1">{selected.specialities.map(s => <span key={s} className="text-[10px] bg-[#2d7ff9]/10 text-[#2d7ff9] px-2 py-0.5 rounded-lg">{s}</span>)}</div></div>
          </div>
          <div className="space-y-2">
            <button onClick={() => openEdit(selected)} className="w-full h-9 rounded-xl bg-[#2d7ff9] text-white text-[12px] font-bold hover:bg-[#1a6ce8] transition-colors">Modifier</button>
            {selected.pendingPayout > 0 && <button className="w-full h-9 rounded-xl border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Virer {formatAmount(selected.pendingPayout)}</button>}
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[520px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)]">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{editing ? 'Modifier' : 'Nouveau'} prestataire</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center"><X size={16} className="text-[var(--text-secondary)]" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[{ label: 'Nom complet', key: 'name', placeholder: 'Marcus Johnson' }, { label: 'Téléphone', key: 'phone', placeholder: '+229 97 00 11 22' }, { label: 'Email', key: 'email', placeholder: 'marcus@gmail.com' }, { label: 'URL Avatar', key: 'avatar', placeholder: 'https://...' }].map(f => (
                  <div key={f.key} className={f.key === 'avatar' ? 'col-span-2' : ''}>
                    <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">{f.label}</label>
                    <input type="text" value={form[f.key] || ''} onChange={e => setF(f.key)(e.target.value)} placeholder={f.placeholder}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Zone d&apos;intervention</label>
                <select value={form.zone || ''} onChange={e => setF('zone')(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]">
                  <option value="">Choisir une zone...</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-2">Spécialités</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALITIES_LIST.map(s => {
                    const active = (form.specialities || []).includes(s)
                    return (
                      <button key={s} type="button" onClick={() => {
                        const curr = form.specialities || []
                        setF('specialities')(active ? curr.filter((x: string) => x !== s) : [...curr, s])
                      }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${active ? 'bg-[#2d7ff9] text-white border-[#2d7ff9]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Annuler</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={14} /> {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[360px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl">
            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-2">Supprimer ce prestataire ?</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mb-5">Action irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)]">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 rounded-xl bg-red-500 text-white text-[13px] font-bold">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
