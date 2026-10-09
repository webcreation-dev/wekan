'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, Settings, Bell, Shield, Globe, DollarSign, Plus, Pencil, Trash2, X, CheckCircle, Upload } from 'lucide-react'
import { MOCK_SERVICES } from '@/data/mock'
import { Service } from '@/types'

// ─── Services Catalogue View — Full CRUD ─────────────────────────────────────

interface ServiceFormData {
  id: string
  name: string
  category: string
  image: string
  icon: string
  description: string
  basePrice: number
  available: boolean
}

const EMPTY_SERVICE: ServiceFormData = { id: '', name: '', category: '', image: '', icon: '🔧', description: '', basePrice: 0, available: true }

const CATEGORIES = ['Construction', 'Technique', 'Décoration', 'Entretien', 'Automobile', 'Tech']

export function ServicesView() {
  const [services, setServices] = useState<ServiceFormData[]>(
    MOCK_SERVICES.map(s => ({ id: s.id, name: s.name, category: s.category, image: s.image, icon: s.icon, description: s.description, basePrice: s.basePrice ?? 0, available: s.available ?? true }))
  )
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ServiceFormData | null>(null)
  const [form, setForm] = useState<ServiceFormData>(EMPTY_SERVICE)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const setF = (k: keyof ServiceFormData) => (v: any) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY_SERVICE); setShowModal(true) }
  const openEdit   = (s: ServiceFormData) => { setEditing(s); setForm(s); setShowModal(true) }

  const handleSave = () => {
    if (!form.name || !form.category) return
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing.id ? { ...form, id: editing.id } : s))
    } else {
      setServices(prev => [...prev, { ...form, id: `svc-${Date.now()}` }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
  }

  const toggleAvailable = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">Catalogue des Services</h2>
          <p className="text-[12px] text-[var(--text-muted)]">{services.length} services · Gérez votre offre</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors">
          <Plus size={15} /> Ajouter un service
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${s.available ? 'bg-[var(--bg-card)] border-[var(--border)]' : 'bg-[var(--bg-surface)] border-[var(--border)] opacity-60'}`}>
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-surface)]">
              <img src={s.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop'} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px]">{s.icon}</span>
                <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{s.name}</p>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">{s.category}</p>
              <p className="text-[11px] font-semibold text-[#2d7ff9] mt-0.5">
                {s.basePrice > 0 ? `${s.basePrice.toLocaleString('fr-FR')} FCFA` : '—'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <button onClick={() => toggleAvailable(s.id)}>
                {s.available
                  ? <ToggleRight size={24} className="text-[#2d7ff9]" />
                  : <ToggleLeft size={24} className="text-[var(--text-muted)]" />
                }
              </button>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                  <Pencil size={13} className="text-[var(--text-secondary)]" />
                </button>
                <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[500px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)]">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{editing ? 'Modifier' : 'Nouveau'} service</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
                <X size={16} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Photo */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Photo du service (URL)</label>
                <input type="text" value={form.image} onChange={e => setF('image')(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
                {form.image && (
                  <div className="mt-2 w-full h-[100px] rounded-xl overflow-hidden bg-[var(--bg-surface)]">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Nom + Icône */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Nom du service</label>
                  <input type="text" value={form.name} onChange={e => setF('name')(e.target.value)}
                    placeholder="Ex: Plomberie"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Icône (emoji)</label>
                  <input type="text" value={form.icon} onChange={e => setF('icon')(e.target.value)}
                    placeholder="🔧" maxLength={2}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[18px] text-center focus:outline-none focus:border-[#2d7ff9]" />
                </div>
              </div>

              {/* Catégorie + Prix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Catégorie</label>
                  <select value={form.category} onChange={e => setF('category')(e.target.value)}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]">
                    <option value="">Choisir...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Prix de base (FCFA)</label>
                  <input type="number" value={form.basePrice} onChange={e => setF('basePrice')(Number(e.target.value))}
                    placeholder="15000"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setF('description')(e.target.value)}
                  placeholder="Décrivez ce service..." rows={3} style={{ resize: 'none' }}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
              </div>

              {/* Disponible */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">Service disponible</span>
                <button onClick={() => setF('available')(!form.available)}>
                  {form.available
                    ? <ToggleRight size={28} className="text-[#2d7ff9]" />
                    : <ToggleLeft size={28} className="text-[var(--text-muted)]" />
                  }
                </button>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-5">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Annuler</button>
              <button onClick={handleSave}
                className="flex-1 h-10 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={14} /> {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[360px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl">
            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-2">Supprimer ce service ?</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mb-5">Cette action est irréversible.</p>
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

// ─── Settings View — All toggles functional ───────────────────────────────────

export function SettingsView() {
  const [settings, setSettings] = useState({
    commission: '15',
    acompte: '20',
    tva: '18',
    emailNewDemande: true,
    smsConfirmation: true,
    pushPrestataire: true,
    alerteLitige: true,
    twoFa: true,
    sessionTimeout: '60',
    ipWhitelist: false,
    langue: 'Français',
    timezone: 'Africa/Porto-Novo (UTC+1)',
  })

  const toggle = (key: string) => setSettings(s => ({ ...s, [key]: !(s as any)[key] }))
  const set = (key: string) => (v: string | number) => setSettings(s => ({ ...s, [key]: v }))

  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-[#2d7ff9]' : 'bg-[var(--border)]'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )

  const sections = [
    {
      title: 'Général', icon: Settings,
      items: [
        { label: 'Langue par défaut', type: 'select', key: 'langue', options: ['Français', 'English'] },
        { label: 'Fuseau horaire', type: 'select', key: 'timezone', options: ['Africa/Porto-Novo (UTC+1)', 'UTC', 'Europe/Paris (UTC+2)'] },
      ],
    },
    {
      title: 'Finance', icon: DollarSign,
      items: [
        { label: 'Commission plateforme (%)', type: 'number', key: 'commission' },
        { label: 'Acompte minimum (%)', type: 'number', key: 'acompte' },
        { label: 'TVA (%)', type: 'number', key: 'tva' },
      ],
    },
    {
      title: 'Notifications', icon: Bell,
      items: [
        { label: 'Email admin nouvelles demandes', type: 'toggle', key: 'emailNewDemande' },
        { label: 'SMS confirmation client', type: 'toggle', key: 'smsConfirmation' },
        { label: 'Push notification prestataire', type: 'toggle', key: 'pushPrestataire' },
        { label: 'Alerte litige', type: 'toggle', key: 'alerteLitige' },
      ],
    },
    {
      title: 'Sécurité', icon: Shield,
      items: [
        { label: 'Authentification 2FA admin', type: 'toggle', key: 'twoFa' },
        { label: 'Session timeout (min)', type: 'number', key: 'sessionTimeout' },
        { label: 'IP whitelist admin', type: 'toggle', key: 'ipWhitelist' },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <div key={section.title} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#2d7ff9]/10 flex items-center justify-center">
                  <Icon size={16} className="text-[#2d7ff9]" />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">{section.title}</h3>
              </div>
              <div className="space-y-3.5">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-3">
                    <label className="text-[12px] text-[var(--text-secondary)] flex-1">{item.label}</label>
                    {item.type === 'toggle' ? (
                      <Toggle value={(settings as any)[item.key]} onToggle={() => toggle(item.key)} />
                    ) : item.type === 'select' ? (
                      <select value={(settings as any)[item.key]} onChange={e => set(item.key)(e.target.value)}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[12px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]">
                        {(item as any).options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="number" value={(settings as any)[item.key]} onChange={e => set(item.key)(e.target.value)}
                        className="w-20 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[12px] text-[var(--text-primary)] text-right focus:outline-none focus:border-[#2d7ff9]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => setSettings(s => ({ ...s }))} className="h-10 px-5 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">
          Réinitialiser
        </button>
        <button onClick={handleSave}
          className="h-10 px-5 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors flex items-center gap-2">
          {saved ? <><CheckCircle size={14} /> Sauvegardé !</> : 'Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  )
}
