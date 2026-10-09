'use client'

import { useState } from 'react'
import { ChevronLeft, Car } from 'lucide-react'

interface MecaniqueScreenProps {
  onBack: () => void
  onProceed: () => void
}

const services = [
  { id: 'vidange', title: 'Vidange', description: 'Huile moteur & filtre inclus', price: 15000 },
  { id: 'diagnostic', title: 'Diagnostic moteur', description: 'Analyse complète des capteurs', price: 10000 },
  { id: 'freins', title: 'Changement de freins', description: 'Plaquettes avant ou arrière', price: 20000 },
]

export default function MecaniqueScreen({ onBack, onProceed }: MecaniqueScreenProps) {
  const [selected, setSelected] = useState<string[]>(['vidange'])
  const [vehicule, setVehicule] = useState('')

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const total = services
    .filter(s => selected.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          Personnalisation
        </h1>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={`rounded-full transition-all ${
              i === 4
                ? 'w-6 h-2.5 bg-[#2d7ff9]'
                : 'w-2.5 h-2.5 bg-[var(--border)]'
            }`} />
          ))}
        </div>

        <h2 className="text-[24px] font-bold text-[var(--text-primary)] mb-1">
          Choisissez vos services
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6">
          Sélectionnez les interventions nécessaires pour votre véhicule.
        </p>

        {/* Service options */}
        <div className="space-y-3 mb-7">
          {services.map((svc) => {
            const isChecked = selected.includes(svc.id)
            return (
              <button
                key={svc.id}
                onClick={() => toggle(svc.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  isChecked
                    ? 'border-[#2d7ff9] bg-[#2d7ff9]/10'
                    : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div>
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{svc.title}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{svc.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                  isChecked ? 'border-[#2d7ff9] bg-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isChecked && <span className="text-white text-[11px] font-bold">✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Vehicle info */}
        <h3 className="text-[18px] font-bold text-[var(--text-primary)] mb-3">Votre véhicule</h3>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-2">
          Modèle du véhicule
        </p>
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[52px] mb-2">
          <Car size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          <input
            type="text"
            value={vehicule}
            onChange={(e) => setVehicule(e.target.value)}
            placeholder="Ex: Toyota Corolla 2018"
            className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mb-6 leading-relaxed italic">
          Ces informations nous aident à préparer les pièces de rechange nécessaires.
        </p>

        <div className="h-4" />
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-0.5">
              Estimation Totale
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-[26px] font-bold text-[var(--text-primary)] leading-none">
                {total.toLocaleString('fr-FR')}
              </p>
              <p className="text-[14px] font-bold text-[#2d7ff9]">FCFA</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-2xl font-bold text-[12px] text-[#2d7ff9] border border-[#2d7ff9] bg-[#2d7ff9]/10">
            DEVIS GRATUIT
          </button>
        </div>
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          Suivant <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
