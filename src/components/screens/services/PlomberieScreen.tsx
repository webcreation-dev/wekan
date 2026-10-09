'use client'

import { useState } from 'react'
import { ChevronLeft, Info, Search, Home, Wrench, Droplet, Settings, Plus, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-[130px] rounded-2xl bg-[#e8f4e8] animate-pulse flex items-center justify-center"><p className="text-[12px] text-gray-500">Chargement...</p></div>,
})

interface PlomberieScreenProps { onBack: () => void; onProceed: () => void }

const options = [
  { id: 'fuite',      icon: Search,   title: 'Détection de fuite',       price: 15000 },
  { id: 'robinet',    icon: Home,     title: 'Réparation de robinet',     price: 8000 },
  { id: 'debouchage', icon: Wrench,   title: 'Débouchage canalisation',   price: 25000 },
  { id: 'chauffeeau', icon: Droplet,  title: 'Installation chauffe-eau',  price: 45000 },
  { id: 'joint',      icon: Settings, title: 'Remplacement de joint',     price: 5000 },
]

export default function PlomberieScreen({ onBack, onProceed }: PlomberieScreenProps) {
  const [selected, setSelected] = useState('fuite')
  const [lat, setLat] = useState(6.3654)
  const [lng, setLng] = useState(2.4183)
  const [address, setAddress] = useState('Cotonou, Bénin')
  const current = options.find(o => o.id === selected)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Détail Plomberie</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Info size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-2">Personnalisez votre service</h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">Sélectionnez l&apos;intervention pour une estimation précise.</p>

        <div className="space-y-3 mb-4">
          {options.map(opt => {
            const isActive = selected === opt.id
            const Icon = opt.icon
            return (
              <button key={opt.id} onClick={() => setSelected(opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${isActive ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#2d7ff9]/20' : 'bg-[var(--bg-surface)]'}`}>
                  <Icon size={18} className="text-[#2d7ff9]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-[12px] font-semibold text-[#2d7ff9] mt-0.5">À partir de {opt.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[#2d7ff9]' : 'border-[var(--text-muted)]'}`}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#2d7ff9]" />}
                </div>
              </button>
            )
          })}
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mb-4">
          <Plus size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-semibold text-[#2d7ff9]">Autre problème ?</span>
        </button>

        {/* Map */}
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2">Lieu de l&apos;intervention</h3>
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 h-[44px] mb-2">
          <MapPin size={15} className="text-[#2d7ff9] flex-shrink-0" />
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Rue des Jardins, Akpakpa, Cotonou"
            className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>
        <div className="rounded-2xl overflow-hidden mb-2 border border-[var(--border)]">
          <MapPicker lat={lat} lng={lng} onLocationChange={(la, ln) => { setLat(la); setLng(ln) }} height={130} zoom={14} />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mb-6">Appuyez sur la carte pour ajuster votre position</p>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-0.5">Estimation Totale</p>
            <p className="text-[26px] font-bold text-[#2d7ff9] leading-none">{(current?.price || 15000).toLocaleString('fr-FR')} <span className="text-[14px]">FCFA</span></p>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] text-right mt-1">Main d&apos;œuvre<br/>incluse, hors pièces.</p>
        </div>
        <button onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98] transition-all">
          Réserver maintenant
        </button>
      </div>
    </div>
  )
}
