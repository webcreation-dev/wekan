'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X, User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  username: string
  email: string
  role: 'superadmin' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
}

const INITIAL: AdminUser[] = [
  { id: 'a1', name: 'Super Administrateur', username: 'superadmin', email: 'superadmin@homefix.bj', role: 'superadmin', status: 'active', createdAt: '2024-01-01', lastLogin: "Aujourd'hui" },
  { id: 'a2', name: 'Jean Koudou', username: 'jkoudou', email: 'jean.k@homefix.bj', role: 'admin', status: 'active', createdAt: '2024-06-10', lastLogin: 'Hier' },
  { id: 'a3', name: 'Ama Sossou', username: 'asossou', email: 'ama.s@homefix.bj', role: 'admin', status: 'inactive', createdAt: '2025-01-15', lastLogin: 'Il y a 5 jours' },
]

interface FormState { name: string; username: string; email: string; role: 'admin' | 'superadmin'; password: string }
const EMPTY: FormState = { name: '', username: '', email: '', role: 'admin', password: '' }

export default function AdminsView() {
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [showPwd, setShowPwd] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const set = (k: keyof FormState) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (a: AdminUser) => {
    setEditing(a)
    setForm({ name: a.name, username: a.username, email: a.email, role: a.role, password: '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.username || !form.email) return
    if (editing) {
      setAdmins(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a))
    } else {
      const newAdmin: AdminUser = {
        id: `a${Date.now()}`, name: form.name, username: form.username,
        email: form.email, role: form.role, status: 'active',
        createdAt: new Date().toLocaleDateString('fr-FR'), lastLogin: '—',
      }
      setAdmins(prev => [...prev, newAdmin])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id))
    setDeleteId(null)
  }

  const toggleStatus = (id: string) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">Gestion des Administrateurs</h2>
          <p className="text-[12px] text-[var(--text-muted)]">{admins.length} administrateur(s) • Accès Super Admin requis</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors">
          <Plus size={15} /> Ajouter un admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)]">
              {['Administrateur', 'Identifiant', 'Email', 'Rôle', 'Dernière connexion', 'Statut', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2d7ff9]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#2d7ff9] text-[14px] font-bold">{a.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Depuis {a.createdAt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-mono text-[var(--text-primary)]">@{a.username}</td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{a.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${a.role === 'superadmin' ? 'bg-purple-500/10 text-purple-500' : 'bg-[#2d7ff9]/10 text-[#2d7ff9]'}`}>
                    {a.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{a.lastLogin}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(a.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${a.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-400/10 text-slate-400'}`}>
                    {a.status === 'active' ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                      <Pencil size={14} className="text-[var(--text-secondary)]" />
                    </button>
                    {a.role !== 'superadmin' && (
                      <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-[460px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                {editing ? 'Modifier' : 'Nouvel'} administrateur
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
                <X size={16} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nom complet', key: 'name', type: 'text', placeholder: 'Jean Koudou', icon: User },
                { label: 'Identifiant', key: 'username', type: 'text', placeholder: 'jkoudou', icon: User },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'jean@homefix.bj', icon: User },
              ].map(field => {
                const Icon = field.icon
                return (
                  <div key={field.key}>
                    <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">{field.label}</label>
                    <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 focus-within:border-[#2d7ff9] transition-colors">
                      <Icon size={14} className="text-[var(--text-muted)]" />
                      <input type={field.type} value={form[field.key as keyof FormState]}
                        onChange={e => set(field.key as keyof FormState)(e.target.value)}
                        placeholder={field.placeholder}
                        className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
                    </div>
                  </div>
                )
              })}

              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">
                  {editing ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                </label>
                <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 focus-within:border-[#2d7ff9] transition-colors">
                  <Lock size={14} className="text-[var(--text-muted)]" />
                  <input type={showPwd ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password')(e.target.value)} placeholder="••••••••"
                    className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
                  <button onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={13} className="text-[var(--text-muted)]" /> : <Eye size={13} className="text-[var(--text-muted)]" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Rôle</label>
                <div className="flex gap-2">
                  {(['admin', 'superadmin'] as const).map(r => (
                    <button key={r} onClick={() => set('role')(r)}
                      className={`flex-1 h-10 rounded-xl text-[13px] font-bold transition-all border ${form.role === r ? 'bg-[#2d7ff9] text-white border-[#2d7ff9]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
                      {r === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)]">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Annuler</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors flex items-center justify-center gap-2">
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
            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-2">Confirmer la suppression</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mb-5">Cette action est irréversible. L&apos;administrateur sera définitivement supprimé.</p>
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
