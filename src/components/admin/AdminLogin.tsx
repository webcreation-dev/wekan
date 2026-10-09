'use client'

import { useState } from 'react'
import { Eye, EyeOff, Briefcase, Lock, User } from 'lucide-react'

interface AdminLoginProps {
  onLogin: (role: 'superadmin' | 'admin') => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!username || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 700))
    if (username === 'superadmin' && password === 'admin123') { onLogin('superadmin'); return }
    if (username === 'admin' && password === 'admin123') { onLogin('admin'); return }
    setError('Identifiants incorrects. (superadmin / admin123)')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
      <div className='flex items-center justify-center'>
         <img src="/logo.png" alt="Wekan" style={{ height: 200, }} />
     </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-xl">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-5">Connexion</h2>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20 mb-4">
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Identifiant</label>
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-11 focus-within:border-[#2d7ff9] transition-colors">
                <User size={15} className="text-[var(--text-muted)]" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="superadmin"
                  className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Mot de passe</label>
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-11 focus-within:border-[#2d7ff9] transition-colors">
                <Lock size={15} className="text-[var(--text-muted)]" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
                <button onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={15} className="text-[var(--text-muted)]" /> : <Eye size={15} className="text-[var(--text-muted)]" />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full h-11 rounded-xl bg-[#2d7ff9] text-white font-bold text-[15px] hover:bg-[#1a6ce8] disabled:opacity-60 transition-colors">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <p className="text-center text-[11px] text-[var(--text-muted)] mt-4">
            Démo : superadmin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
