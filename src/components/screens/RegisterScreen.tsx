'use client'

import { useState } from 'react'
import { ChevronLeft, Eye, EyeOff, Lock, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import PhoneInput from '@/components/ui/PhoneInput'

interface RegisterScreenProps {
  onBack: () => void
  onSuccess: () => void
}

export default function RegisterScreen({ onBack, onSuccess }: RegisterScreenProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phoneRaw: '', password: '', confirm: ''
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore(s => s.login)

  const set = (key: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [key]: v }))

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phoneRaw || !form.password) {
      setError('Veuillez remplir tous les champs.'); return
    }
    if (form.phoneRaw.length < 8) {
      setError('Le numéro de téléphone doit comporter 10 chiffres.'); return
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.'); return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.'); return
    }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 800))
    login({
      id: 'u' + Date.now(),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: '01' + form.phoneRaw,
    }, 'mock-token')
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-[#2d7ff9]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          Créer un compte
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-5 pt-5 pb-6">
        <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-1">Rejoignez Wekan</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">
          Créez votre compte pour accéder à tous nos services au Bénin.
        </p>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20 mb-4">
            <p className="text-[13px] text-red-400">{error}</p>
          </div>
        )}

        {/* Prénom + Nom */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { key: 'firstName', label: 'Prénom', placeholder: 'Kofi' },
            { key: 'lastName',  label: 'Nom',    placeholder: 'Mensah' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1.5">{f.label}</label>
              <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 h-[50px] focus-within:border-[#2d7ff9] transition-colors">
                <User size={14} className="text-[var(--text-muted)]" />
                <input type="text" value={form[f.key as keyof typeof form]}
                  onChange={e => set(f.key as keyof typeof form)(e.target.value)}
                  placeholder={f.placeholder}
                  className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Téléphone */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1.5">Téléphone</label>
          <PhoneInput
            value={form.phoneRaw}
            onChange={(raw) => set('phoneRaw')(raw)}
            placeholder="XX XX XX XX"
          />
          <p className="text-[11px] text-[var(--text-muted)] mt-1 ml-1">
            Format : 01 XX XX XX XX · 10 chiffres requis
          </p>
        </div>

        {/* Mots de passe */}
        {[
          { key: 'password', label: 'Mot de passe',           placeholder: 'Minimum 6 caractères' },
          { key: 'confirm',  label: 'Confirmer le mot de passe', placeholder: 'Répétez le mot de passe' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="block text-[12px] font-semibold text-[var(--text-primary)] mb-1.5">{f.label}</label>
            <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 h-[50px] focus-within:border-[#2d7ff9] transition-colors">
              <Lock size={14} className="text-[var(--text-muted)]" />
              <input type={showPwd ? 'text' : 'password'}
                value={form[f.key as keyof typeof form]}
                onChange={e => set(f.key as keyof typeof form)(e.target.value)}
                placeholder={f.placeholder}
                className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
              {f.key === 'password' && (
                <button onClick={() => setShowPwd(v => !v)}>
                  {showPwd
                    ? <EyeOff size={14} className="text-[var(--text-muted)]" />
                    : <Eye size={14} className="text-[var(--text-muted)]" />}
                </button>
              )}
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] disabled:opacity-60 transition-all shadow-lg shadow-blue-500/25 mb-4">
          {loading ? 'Création...' : "S'inscrire"}
        </button>

        <p className="text-center text-[11px] text-[var(--text-secondary)] px-2">
          En vous inscrivant, vous acceptez nos{' '}
          <span className="text-[#2d7ff9] underline">Conditions d&apos;utilisation</span>
          {' '}et notre{' '}
          <span className="text-[#2d7ff9] underline">Politique de confidentialité</span>.
        </p>
      </div>
    </div>
  )
}
