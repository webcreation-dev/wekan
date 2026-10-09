'use client'

import { useState } from 'react'
import { ChevronLeft, DoorOpen } from 'lucide-react'
import { MOCK_NETTOYAGE_OPTIONS as nettoyageOptions } from '@/data/mock'

interface NettoyageScreenProps {
  onBack: () => void
  onProceed: () => void
}

export default function NettoyageScreen({ onBack, onProceed }: NettoyageScreenProps) {
  const [selected, setSelected] = useState('complet')

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          Service Nettoyage
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        {/* Step indicator */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Étape finale</span>
            <span className="text-[13px] text-[var(--text-secondary)]">6 sur 6</span>
          </div>
          <div className="w-full h-[4px] rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full w-full rounded-full bg-[#2d7ff9]" />
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-[var(--text-primary)] mb-1">
          Personnalisez votre service
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6">
          Derniers détails avant votre réservation
        </p>

        <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3">Type de prestation</h3>

        <div className="space-y-3 mb-6">
          {nettoyageOptions.map((opt: import('@/types').ServiceOption) => {
            const isActive = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'border-[#2d7ff9] bg-[#2d7ff9]/10'
                    : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div>
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{opt.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                  isActive ? 'border-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isActive && <div className="w-3 h-3 rounded-full bg-[#2d7ff9]" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Volume */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-8">
          <div>
            <p className="text-[15px] font-bold text-[var(--text-primary)]">Volume de travail</p>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Combien de pièces à nettoyer ?</p>
          </div>
          <DoorOpen size={22} className="text-[#2d7ff9]" />
        </div>

        <div className="h-4" />
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 pb-6 bg-[var(--bg-primary)] border-t border-[var(--border)]">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-0.5">
              Estimation Totale
            </p>
            <p className="text-[32px] font-bold text-[#2d7ff9] leading-none">
              25.000 <span className="text-[18px] font-bold">FCFA</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
            TVA INCLUSE
          </span>
        </div>
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 shadow-lg shadow-blue-500/25"
        >
          Terminer et Commander
        </button>
      </div>
    </div>
  )
}
