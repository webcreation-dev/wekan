'use client'

import { useState } from 'react'
import { ChevronLeft, Info, Lightbulb, ToggleRight, Plug, Zap, Shield, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-[140px] rounded-2xl bg-[#e8f4e8] animate-pulse flex items-center justify-center"><p className="text-[12px] text-gray-500">Chargement carte...</p></div>,
})

interface ElectriciteScreenProps { onBack: () => void; onProceed: () => void }

// Cotonou default
const DEFAULT_LAT = 6.3654
const DEFAULT_LNG = 2.4183

const tasks = [
  { id: 'lamp',   icon: Lightbulb,   label: 'Remplacement ampoule',    price: 3000 },
  { id: 'switch', icon: ToggleRight, label: 'Réparation interrupteur', price: 5000 },
  { id: 'socket', icon: Plug,        label: 'Réparation prise',        price: 8000 },
  { id: 'panel',  icon: Zap,         label: 'Mise à niveau tableau',   price: 45000 },
]

export default function ElectriciteScreen({ onBack, onProceed }: ElectriciteScreenProps) {
  const [selected, setSelected] = useState<string[]>(['lamp'])
  const [lat, setLat] = useState(DEFAULT_LAT)
  const [lng, setLng] = useState(DEFAULT_LNG)
  const [address, setAddress] = useState('Cotonou, Bénin')
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])
  const total = tasks.filter(t => selected.includes(t.id)).reduce((s, t) => s + t.price, 0)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Détail Électricité</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Info size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-4">
        <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">Choisissez les tâches</h2>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {tasks.map(task => {
            const isActive = selected.includes(task.id)
            const Icon = task.icon
            return (
              <button key={task.id} onClick={() => toggle(task.id)}
                className={`relative p-4 rounded-2xl border text-left transition-all ${isActive ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#2d7ff9] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
                <Icon size={20} className={`mb-3 ${isActive ? 'text-[#2d7ff9]' : 'text-[var(--text-secondary)]'}`} />
                <p className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">{task.label}</p>
                <p className="text-[11px] text-[#2d7ff9] mt-0.5 font-semibold">{task.price.toLocaleString('fr-FR')} FCFA</p>
              </button>
            )
          })}
        </div>

        {/* Map section */}
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2">Lieu de l&apos;intervention</h3>
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 h-[44px] mb-2">
          <MapPin size={15} className="text-[#2d7ff9] flex-shrink-0" />
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Rue des Jardins, Akpakpa, Cotonou"
            className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>
        <div className="rounded-2xl overflow-hidden mb-2 border border-[var(--border)]">
          <MapPicker lat={lat} lng={lng}
            onLocationChange={(la, ln) => { setLat(la); setLng(ln) }}
            height={150} zoom={14} markerLabel="Lieu d'intervention" />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mb-4">Appuyez sur la carte pour ajuster votre position précise</p>

        {/* Guarantee */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-6">
          <Shield size={18} className="text-[#2d7ff9] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Garantie Pro</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Services électriques garantis 12 mois satisfaction client.</p>
          </div>
        </div>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] uppercase">Prix estimé</p>
            <p className="text-[18px] font-bold text-[#2d7ff9]">{total.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <button onClick={onProceed}
            className="flex-1 h-[52px] rounded-2xl font-bold text-[16px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all">
            Continuer →
          </button>
        </div>
      </div>
    </div>
  )
}
