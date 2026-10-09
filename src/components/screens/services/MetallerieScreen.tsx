'use client'

import { useState } from 'react'
import { ChevronLeft, Info, Shield, Grid, Columns, Lock, Plus } from 'lucide-react'

interface MetallerieScreenProps {
  onBack: () => void
  onProceed: () => void
}

const options = [
  { id: 'grille', icon: Grid, title: 'Pose de grilles de sécurité', price: 35000, description: 'Fenêtres, portes et accès extérieurs' },
  { id: 'portail', icon: Shield, title: 'Fabrication de portail', price: 80000, description: 'Portail coulissant ou battant sur mesure' },
  { id: 'garde', icon: Columns, title: 'Garde-corps / Rampe escalier', price: 45000, description: 'Inox, fer forgé ou aluminium' },
  { id: 'serrure', icon: Lock, title: 'Remplacement serrure / verrou', price: 12000, description: 'Sécurisation porte et accès' },
]

export default function MetallerieScreen({ onBack, onProceed }: MetallerieScreenProps) {
  const [selected, setSelected] = useState<string[]>(['grille'])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const total = options.filter(o => selected.includes(o.id)).reduce((s, o) => s + o.price, 0)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Service Métallerie</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Info size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        {/* Step */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Étape 1 sur 3</span>
            <span className="text-[13px] font-bold text-[#2d7ff9]">33% Complété</span>
          </div>
          <div className="w-full h-[4px] rounded-full bg-[var(--bg-card)] overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-[#2d7ff9]" />
          </div>
        </div>

        <h2 className="text-[22px] font-bold text-[var(--text-primary)] mb-1">
          Choisissez vos travaux
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6">
          Sélectionnez un ou plusieurs types d&apos;interventions en métallerie.
        </p>

        <div className="space-y-3 mb-5">
          {options.map((opt) => {
            const isChecked = selected.includes(opt.id)
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  isChecked ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isChecked ? 'bg-[#2d7ff9]/20' : 'bg-[var(--bg-surface)]'
                }`}>
                  <Icon size={18} className={isChecked ? 'text-[#2d7ff9]' : 'text-[var(--text-secondary)]'} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{opt.description}</p>
                  <p className="text-[12px] font-semibold text-[#2d7ff9] mt-1">À partir de {opt.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isChecked ? 'border-[#2d7ff9] bg-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isChecked && <span className="text-white text-[11px] font-bold">✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mb-6">
          <Plus size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-semibold text-[#2d7ff9]">Autre travail ?</span>
        </button>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-0.5">Estimation Totale</p>
            <p className="text-[28px] font-bold text-[#2d7ff9] leading-none">
              {total.toLocaleString('fr-FR')} <span className="text-[16px]">FCFA</span>
            </p>
          </div>
          <span className="text-[11px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">TVA INCLUSE</span>
        </div>
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          Continuer <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
