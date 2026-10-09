'use client'

import { useState } from 'react'
import { ChevronLeft, Plus, Minus } from 'lucide-react'

interface PeintureScreenProps { onBack: () => void; onProceed: () => void }

const types = [
  { id: 'murale',    label: 'Peinture murale',   image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&h=200&fit=crop' },
  { id: 'plafond',   label: 'Peinture plafond',  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' },
  { id: 'retouches', label: 'Retouches',         image: 'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?w=300&h=200&fit=crop' },
]

export default function PeintureScreen({ onBack, onProceed }: PeintureScreenProps) {
  const [selected, setSelected] = useState<string[]>(['murale'])
  const [surface, setSurface] = useState(45)
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])
  const estimation = surface * 1500

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Détail Peinture</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-4 bg-[var(--bg-primary)]">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-[var(--text-secondary)]">Progression du projet</span>
            <span className="text-[13px] text-[var(--text-secondary)]">4 sur 6</span>
          </div>
          <div className="w-full h-[4px] rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full rounded-full bg-[#2d7ff9]" style={{ width: '66%' }} />
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">Dites-nous en plus sur votre projet</h2>

        <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-1">Type de service</h3>
        <p className="text-[12px] text-[var(--text-secondary)] mb-3">Sélectionnez les zones à peindre</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {types.map(type => {
            const isActive = selected.includes(type.id)
            return (
              <button key={type.id} onClick={() => toggle(type.id)}
                className="relative rounded-2xl overflow-hidden h-[110px] transition-all"
                style={{ border: `3px solid ${isActive ? '#2d7ff9' : 'transparent'}` }}>
                <img src={type.image} alt={type.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
                <p className="absolute bottom-2 left-2.5 text-white text-[12px] font-bold">{type.label}</p>
              </button>
            )
          })}
        </div>

        <p className="text-[11px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-2">Surface totale à peindre</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 flex items-center bg-[var(--bg-card)] rounded-2xl px-4 h-[52px] border border-[var(--border)]">
            <span className="text-[20px] font-bold text-[var(--text-primary)]">{surface}</span>
            <span className="text-[14px] text-[var(--text-muted)] ml-auto">m²</span>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setSurface(s => s + 5)} className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border)]">
              <Plus size={16} className="text-[var(--text-primary)]" />
            </button>
            <button onClick={() => setSurface(s => Math.max(5, s - 5))} className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border)]">
              <Minus size={16} className="text-[var(--text-primary)]" />
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[var(--text-muted)] mb-4">Environ 1 500 FCFA par m² pour la peinture standard.</p>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[13px] text-[var(--text-secondary)]">Estimation totale</p>
          <p className="text-[22px] font-bold text-[#2d7ff9]">{estimation.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <button onClick={onProceed} className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Continuer <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
