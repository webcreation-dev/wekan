'use client'

import { useState } from 'react'
import { ChevronLeft, Plus, MapPin, Home, Briefcase, Trash2, Check } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-[140px] rounded-2xl bg-[#e8f4e8] animate-pulse" />,
})

interface Address {
  id: string
  label: string
  type: 'home' | 'work' | 'other'
  fullAddress: string
  lat: number
  lng: number
  isDefault: boolean
}

const INITIAL_ADDRESSES: Address[] = [
  { id: '1', label: 'Domicile', type: 'home', fullAddress: '12 Rue des Jardins, Akpakpa, Cotonou', lat: 6.3654, lng: 2.4183, isDefault: true },
  { id: '2', label: 'Bureau', type: 'work', fullAddress: '45 Avenue Steinmetz, Plateau, Cotonou', lat: 6.3700, lng: 2.4220, isDefault: false },
]

interface AddressesScreenProps {
  onBack: () => void
}

export default function AddressesScreen({ onBack }: AddressesScreenProps) {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
  const [showAdd, setShowAdd] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: 'Nouveau lieu', fullAddress: '', lat: 6.3654, lng: 2.4183 })

  const handleAddSave = () => {
    if (!newAddr.fullAddress) return
    setAddresses(prev => [...prev, {
      id: Date.now().toString(),
      label: newAddr.label,
      type: 'other',
      fullAddress: newAddr.fullAddress,
      lat: newAddr.lat,
      lng: newAddr.lng,
      isDefault: false,
    }])
    setShowAdd(false)
    setNewAddr({ label: 'Nouveau lieu', fullAddress: '', lat: 6.3654, lng: 2.4183 })
  }

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  }

  const remove = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const TypeIcon = ({ type }: { type: Address['type'] }) => {
    if (type === 'home') return <Home size={16} className="text-[#2d7ff9]" />
    if (type === 'work') return <Briefcase size={16} className="text-purple-500" />
    return <MapPin size={16} className="text-green-500" />
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-[#2d7ff9]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Mes Adresses</h1>
        <button onClick={() => setShowAdd(true)}
          className="w-8 h-8 rounded-xl bg-[#2d7ff9]/10 flex items-center justify-center">
          <Plus size={18} className="text-[#2d7ff9]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-4 pb-4 space-y-3">
        {/* Address cards */}
        {addresses.map(addr => (
          <div key={addr.id}
            className={`p-4 rounded-2xl border transition-all ${addr.isDefault ? 'border-[#2d7ff9] bg-[#2d7ff9]/5' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${addr.type === 'home' ? 'bg-[#2d7ff9]/10' : addr.type === 'work' ? 'bg-purple-500/10' : 'bg-green-500/10'}`}>
                  <TypeIcon type={addr.type} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#2d7ff9] bg-[#2d7ff9]/10 px-2 py-0.5 rounded-full">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{addr.fullAddress}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id)}
                    className="p-1.5 rounded-lg hover:bg-[#2d7ff9]/10 transition-colors" title="Définir par défaut">
                    <Check size={14} className="text-[#2d7ff9]" />
                  </button>
                )}
                <button onClick={() => remove(addr.id)}
                  className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
            {/* Mini map */}
            <div className="rounded-xl overflow-hidden mt-2 border border-[var(--border)]">
              <MapPicker lat={addr.lat} lng={addr.lng} readonly height={90} zoom={14} />
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MapPin size={36} className="text-[var(--text-muted)]" />
            <p className="text-[14px] text-[var(--text-muted)]">Aucune adresse enregistrée</p>
          </div>
        )}
      </div>

      {/* Add address form */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-[var(--bg-card)] rounded-t-3xl border-t border-[var(--border)] p-5 pb-8 animate-slide-up">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
            </div>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-4">Ajouter une adresse</h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Libellé</label>
                <input type="text" value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))}
                  placeholder="Ex: Maison familiale, Bureau..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 h-11 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">Adresse complète</label>
                <input type="text" value={newAddr.fullAddress} onChange={e => setNewAddr(p => ({ ...p, fullAddress: e.target.value }))}
                  placeholder="Rue, Quartier, Ville..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 h-11 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5">
                  Positionnez sur la carte
                </label>
                <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
                  <MapPicker
                    lat={newAddr.lat} lng={newAddr.lng}
                    onLocationChange={(la, ln) => setNewAddr(p => ({ ...p, lat: la, lng: ln }))}
                    height={140} zoom={13}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Appuyez sur la carte pour ajuster la position</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 h-11 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)]">
                Annuler
              </button>
              <button onClick={handleAddSave}
                className="flex-1 h-11 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold hover:bg-[#1a6ce8] transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
