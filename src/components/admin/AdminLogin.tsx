'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Phone } from 'lucide-react'
import { api, errorMessage } from '@/lib/api-client'

export interface AgentUser {
  id: string
  firstName: string
  lastName: string
  phone: string
  role: string
}

interface AdminLoginProps {
  onLogin: (agent: AgentUser) => void
}

/** Connexion de l'agent Wekan (compte défini par AGENT_PHONE / AGENT_PASSWORD). */
export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!phone || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true); setError('')
    try {
      const { user } = await api<{ user: AgentUser }>('/auth/login', { method: 'POST', json: { phone, password } })
      if (user.role !== 'agent') {
        // Un compte client ne doit pas rester connecté sur l'espace agent
        await api('/auth/logout', { method: 'POST' }).catch(() => {})
        setError('Ce compte n’a pas accès à l’espace agent.')
        setLoading(false)
        return
      }
      onLogin(user)
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="Wekan" style={{ height: 200 }} />
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-xl">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">Espace agent</h2>
          <p className="mb-5 mt-0.5 text-[12px] text-[var(--text-muted)]">Connectez-vous avec le compte agent Wekan.</p>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20 mb-4">
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Numéro de téléphone</label>
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-11 focus-within:border-[#2d7ff9] transition-colors">
                <Phone size={15} className="text-[var(--text-muted)]" />
                <input type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="01 XX XX XX XX" autoComplete="username"
                  className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Mot de passe</label>
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-11 focus-within:border-[#2d7ff9] transition-colors">
                <Lock size={15} className="text-[var(--text-muted)]" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••" autoComplete="current-password"
                  className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
                <button type="button" onClick={() => setShowPwd(v => !v)} aria-label="Afficher le mot de passe">
                  {showPwd ? <EyeOff size={15} className="text-[var(--text-muted)]" /> : <Eye size={15} className="text-[var(--text-muted)]" />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full h-11 rounded-xl bg-[#2d7ff9] text-white font-bold text-[15px] hover:bg-[#1a6ce8] disabled:opacity-60 transition-colors">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
