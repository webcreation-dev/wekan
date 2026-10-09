'use client'

import { useState } from 'react'
import { ChevronLeft, Home, Hammer, Layers, Plus } from 'lucide-react'

interface MaconnerieScreenProps { onBack: () => void; onProceed: () => void }

const options = [
  { id: 'mur',      icon: Home,   title: 'Construction de mur',      description: 'Briques, parpaings ou pierres de taille' },
  { id: 'fissures', icon: Hammer, title: 'Réparation de fissures',   description: 'Traitement structurel intérieur ou extérieur' },
  { id: 'chape',    icon: Layers, title: 'Chape de sol',             description: 'Nivellement de surface et lissage' },
]

export default function MaconnerieScreen({ onBack, onProceed }: MaconnerieScreenProps) {
  const [selected, setSelected] = useState<string[]>(['mur'])
  const [notes, setNotes] = useState('')
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])

  return (
    <div className="flex flex-col h-full bg-transparent animate-fade-in">
      {/* Header with transparent bg */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">Détail Maçonnerie</h1>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-1">Quel type de travaux ?</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">Sélectionnez une ou plusieurs options pour votre projet.</p>

        <div className="space-y-3 mb-5">
          {options.map(opt => {
            const isChecked = selected.includes(opt.id)
            const Icon = opt.icon
            return (
              <button key={opt.id} onClick={() => toggle(opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${isChecked ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-[#2d7ff9]/20' : 'bg-[var(--bg-surface)]'}`}>
                  <Icon size={18} className={isChecked ? 'text-[#2d7ff9]' : 'text-[var(--text-secondary)]'} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{opt.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isChecked ? 'border-[#2d7ff9] bg-[#2d7ff9]' : 'border-[var(--text-muted)]'}`}>
                  {isChecked && <span className="text-white text-[11px] font-bold">✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[var(--border)] mb-5">
          <Plus size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-semibold text-[#2d7ff9]">Autre problème ?</span>
        </button>

        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-[var(--text-primary)] mb-2">Notes supplémentaires</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Ex: Longueur du mur, accès difficile..." rows={3}
            className="w-full px-4 py-3 rounded-2xl text-[14px] resize-none focus:outline-none bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2d7ff9] transition-colors" />
        </div>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-0.5">Estimation Globale</p>
            <p className="text-[28px] font-bold text-[#2d7ff9] leading-none">45 000 <span className="text-[16px]">FCFA</span></p>
          </div>
          <span className="text-[11px] font-bold text-[#2d7ff9] bg-[#2d7ff9]/10 px-2 py-1 rounded-lg">+ TVA 18%</span>
        </div>
        <button onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Confirmer la demande <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
