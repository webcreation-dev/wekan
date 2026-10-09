'use client'

import { useState } from 'react'
import { ChevronLeft, MapPin } from 'lucide-react'

interface MenuiserieScreenProps {
  onBack: () => void
  onProceed: () => void
}

const options = [
  {
    id: 'meuble',
    title: 'Réparation de meuble',
    description: 'Chaises, tables et armoires abîmées',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=160&fit=crop',
  },
  {
    id: 'porte',
    title: 'Pose de porte',
    description: "Portes d'intérieur et d'extérieur",
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=160&fit=crop',
  },
  {
    id: 'rabotage',
    title: 'Rabotage',
    description: 'Ajustement et lissage des surfaces',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=160&fit=crop',
  },
]

export default function MenuiserieScreen({ onBack, onProceed }: MenuiserieScreenProps) {
  const [selected, setSelected] = useState<string[]>(['meuble'])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          Personnaliser votre service
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className="rounded-full transition-all"
              style={{
                width: i === 2 ? 24 : 10,
                height: 10,
                backgroundColor: i === 2 ? '#2d7ff9' : 'var(--border)',
              }} />
          ))}
        </div>

        <h2 className="text-[22px] font-bold text-[var(--text-primary)] mb-1">
          Choisissez le type de travaux
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">
          Sélectionnez un ou plusieurs services de menuiserie.
        </p>

        {/* Card options */}
        <div className="space-y-3 mb-6">
          {options.map((opt) => {
            const isActive = selected.includes(opt.id)
            return (
              <div
                key={opt.id}
                className={`rounded-2xl overflow-hidden border transition-all ${
                  isActive ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-start p-4 gap-3">
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                    <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 mb-3">{opt.description}</p>
                    <button
                      onClick={() => toggle(opt.id)}
                      className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all ${
                        isActive
                          ? 'bg-[#2d7ff9] text-white'
                          : 'bg-transparent border border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {isActive ? '✓ Sélectionné' : 'Sélectionner'}
                    </button>
                  </div>
                  <img
                    src={opt.image}
                    alt={opt.title}
                    className="w-[90px] h-[80px] rounded-xl object-cover flex-shrink-0"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Location */}
        <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3">Lieu de l&apos;intervention</h3>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-3 bg-[var(--bg-card)] border border-[var(--border)]">
          <MapPin size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-medium text-[var(--text-primary)]">Rue des Jardins, Cocody, Abidjan</span>
        </div>

        {/* Mini map */}
        <div className="relative rounded-2xl overflow-hidden mb-5" style={{ height: 110 }}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #c8d8c0 0%, #b8cca8 50%, #d4c9a8 100%)' }}>
            <svg className="w-full h-full opacity-50" viewBox="0 0 340 110">
              <line x1="0" y1="35" x2="340" y2="35" stroke="#a0b090" strokeWidth="1.5" />
              <line x1="0" y1="65" x2="340" y2="65" stroke="#a0b090" strokeWidth="2.5" />
              <line x1="0" y1="90" x2="340" y2="90" stroke="#a0b090" strokeWidth="1" />
              <line x1="80" y1="0" x2="80" y2="110" stroke="#a0b090" strokeWidth="1.5" />
              <line x1="170" y1="0" x2="170" y2="110" stroke="#a0b090" strokeWidth="2" />
              <line x1="260" y1="0" x2="260" y2="110" stroke="#a0b090" strokeWidth="1.5" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-7 h-7 rounded-full bg-[#2d7ff9] flex items-center justify-center shadow-lg">
                <MapPin size={14} color="white" fill="white" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase mb-0.5">
              Estimation du coût
            </p>
            <p className="text-[28px] font-bold text-[#2d7ff9] leading-none">
              15,000 <span className="text-[16px]">FCFA</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[var(--text-muted)]">TVA incluse</p>
            <p className="text-[11px] text-[var(--text-muted)]">Déplacement offert</p>
          </div>
        </div>
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          Continuer vers le paiement <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
