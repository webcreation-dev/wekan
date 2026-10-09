'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import PhoneInput from '@/components/ui/PhoneInput'
import Image from 'next/image'

const MOCK_USERS: Record<string, { firstName: string; lastName: string; password: string }> = {
  '97123456': { firstName: 'Kofi', lastName: 'Mensah', password: 'admin123' },
  '96789012': { firstName: 'Ama', lastName: 'Koffi', password: 'test123' },
}

interface LoginScreenProps {
  onLogin: () => void
  onGoRegister: () => void
}

export default function LoginScreen({ onLogin, onGoRegister }: LoginScreenProps) {
  const [phoneRaw, setPhoneRaw] = useState('')   // 8 digits after "01"
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [greeting, setGreeting] = useState<string | null>(null)
  const login = useAuthStore(s => s.login)

  const handlePhoneChange = (raw: string, full: string) => {
    setPhoneRaw(raw)
    const found = MOCK_USERS[raw]
    setGreeting(found ? `Bonjour ${found.firstName} ! 👋` : null)
    setError('')
  }

  const handleSubmit = async () => {
    if (!phoneRaw || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 700))
    const found = MOCK_USERS[phoneRaw]
    if (found) {
      login({ id: 'u1', firstName: found.firstName, lastName: found.lastName, phone: '01' + phoneRaw }, 'mock-token')
    } else {
      login({ id: 'u1', firstName: 'Utilisateur', lastName: '', phone: '01' + phoneRaw }, 'mock-token')
    }
    setLoading(false)
    onLogin()
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-6 px-6">
        <div className="relative w-[280px] h-[96px] overflow-hidden mb-2">
          <Image src="/logo.png" alt="Wekan" fill style={{ objectFit: 'cover' }} />
        </div>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Bienvenue</h1>
        <p className="text-[13px] text-[var(--text-secondary)] mt-1 text-center">
          Connectez-vous pour accéder à nos services
        </p>
      </div>

      <div className="flex-1 px-5 space-y-4 overflow-y-auto screen-scroll pb-6">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">
            <p className="text-[13px] text-red-400">{error}</p>
          </div>
        )}
        {greeting && (
          <div className="px-4 py-3 rounded-xl bg-[#2d7ff9]/10 border border-[#2d7ff9]/20 animate-fade-in">
            <p className="text-[13px] font-semibold text-[#2d7ff9]">{greeting} Ravi de vous revoir.</p>
          </div>
        )}

        <div>
          <label className="block text-[13px] font-semibold text-[var(--text-primary)] mb-2">
            Numéro de téléphone
          </label>
          <PhoneInput
            value={phoneRaw}
            onChange={handlePhoneChange}
            placeholder=""
            showCountryPrefix
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[var(--text-primary)] mb-2">
            Mot de passe
          </label>
          <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[54px] focus-within:border-[#2d7ff9] transition-colors">
            <Lock size={16} className="text-[var(--text-muted)]" />
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Votre mot de passe"
              className="flex-1 bg-transparent text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button onClick={() => setShowPwd(v => !v)}>
              {showPwd ? <EyeOff size={16} className="text-[var(--text-muted)]" /> : <Eye size={16} className="text-[var(--text-muted)]" />}
            </button>
          </div>
          <button className="block ml-auto text-[12px] text-[#2d7ff9] font-medium mt-2">Mot de passe oublié ?</button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] disabled:opacity-60 transition-all shadow-lg shadow-blue-500/25"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[12px] text-[var(--text-muted)]">ou</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          onClick={onGoRegister}
          className="w-full h-[52px] rounded-2xl font-bold text-[15px] text-[#2d7ff9] border-2 border-[#2d7ff9] hover:bg-[#2d7ff9]/5 active:scale-[0.98] transition-all"
        >
          Créer un compte
        </button>

        <p className="text-center text-[11px] text-[var(--text-muted)]">
          En vous connectant, vous acceptez nos{' '}
          <span className="text-[#2d7ff9]">Conditions d&apos;utilisation</span>
        </p>
      </div>
    </div>
  )
}
