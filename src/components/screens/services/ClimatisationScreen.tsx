'use client'

import { useState } from 'react'
import { ChevronLeft, Snowflake, Wrench, Flame, HelpCircle } from 'lucide-react'

interface ClimatisationScreenProps {
  onBack: () => void
  onProceed: () => void
}

const options = [
  {
    id: 'installation',
    icon: Snowflake,
    title: 'Installation climatiseur',
    description: 'Pose complète de votre unité intérieure et extérieure',
    price: 15000,
  },
  {
    id: 'entretien',
    icon: Wrench,
    title: 'Entretien climatiseur',
    description: 'Nettoyage haute pression et vérification annuelle',
    price: 8000,
  },
  {
    id: 'recharge',
    icon: Flame,
    title: 'Recharge gaz',
    description: 'Appoint de fluide frigorigène (R32, R410A)',
    price: 12000,
  },
  {
    id: 'depannage',
    icon: Wrench,
    title: 'Dépannage',
    description: 'Diagnostic panne et réparation rapide',
    price: 10000,
  },
]

export default function ClimatisationScreen({ onBack, onProceed }: ClimatisationScreenProps) {
  const [selected, setSelected] = useState('installation')

  const current = options.find(o => o.id === selected)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          Service Climatisation
        </h1>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-6">
        <h2 className="text-[24px] font-bold text-[var(--text-primary)] mb-1">
          Choisissez votre service
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6 leading-relaxed">
          Sélectionnez le type d&apos;intervention nécessaire pour votre installation.
        </p>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {options.map((opt) => {
            const isActive = selected === opt.id
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full flex items-start justify-between p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'border-[#2d7ff9] bg-[#2d7ff9]/8'
                    : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isActive ? 'bg-[#2d7ff9]/15' : 'bg-[var(--bg-surface)]'
                  }`}>
                    <Icon size={16} className={isActive ? 'text-[#2d7ff9]' : 'text-[var(--text-secondary)]'} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1 ml-3 ${
                  isActive ? 'border-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#2d7ff9]" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Autre problème */}
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-6">
          <HelpCircle size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-semibold text-[#2d7ff9]">Autre problème ?</span>
        </button>

        {/* Estimation card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2d7ff9]/8 border border-[#2d7ff9]/20 mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#2d7ff9] uppercase mb-1">
              Estimation du service
            </p>
            <p className="text-[28px] font-bold text-[var(--text-primary)] leading-none">
              {(current?.price || 15000).toLocaleString('fr-FR')} <span className="text-[16px]">FCFA</span>
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1">
              Prix de base, hors pièces de rechange
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1631567091596-a1c0c8c4c0f3?w=200&h=160&fit=crop"
            alt="Climatisation"
            className="w-[90px] h-[75px] rounded-xl object-cover"
          />
        </div>

        <div className="h-4" />
      </div>

      {/* CTA */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          Continuer la commande
          <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  )
}
