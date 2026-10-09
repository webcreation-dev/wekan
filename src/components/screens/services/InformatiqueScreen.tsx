'use client'

import { useState } from 'react'
import { ChevronLeft, Info, Monitor, Wifi, HardDrive, Shield, Wrench, Plus } from 'lucide-react'

interface InformatiqueScreenProps {
  onBack: () => void
  onProceed: () => void
}

const options = [
  { id: 'depannage', icon: Monitor, title: 'Dépannage PC / Mac', price: 10000, description: 'Diagnostic et résolution de pannes' },
  { id: 'reseau', icon: Wifi, title: 'Installation réseau & Wi-Fi', price: 15000, description: 'Configuration box, routeur, répéteur' },
  { id: 'recuperation', icon: HardDrive, title: 'Récupération de données', price: 25000, description: 'Fichiers perdus, disque endommagé' },
  { id: 'antivirus', icon: Shield, title: 'Suppression virus / malware', price: 8000, description: 'Nettoyage complet et protection' },
  { id: 'installation', icon: Wrench, title: 'Installation logiciels', price: 5000, description: 'Windows, Office, drivers, imprimante' },
]

export default function InformatiqueScreen({ onBack, onProceed }: InformatiqueScreenProps) {
  const [selected, setSelected] = useState('depannage')
  const current = options.find(o => o.id === selected)

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)]">Service Informatique</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Info size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        <h2 className="text-[22px] font-bold text-[var(--text-primary)] mb-1">
          Quel est votre problème ?
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6 leading-relaxed">
          Sélectionnez le type d&apos;intervention informatique dont vous avez besoin.
        </p>

        <div className="space-y-3 mb-5">
          {options.map((opt) => {
            const isActive = selected === opt.id
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  isActive ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-[#2d7ff9]/20' : 'bg-[var(--bg-surface)]'
                }`}>
                  <Icon size={18} className={isActive ? 'text-[#2d7ff9]' : 'text-[var(--text-secondary)]'} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{opt.description}</p>
                  <p className="text-[12px] font-semibold text-[#2d7ff9] mt-1">À partir de {opt.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'border-[#2d7ff9]' : 'border-[var(--text-muted)]'
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#2d7ff9]" />}
                </div>
              </button>
            )
          })}
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mb-6">
          <Plus size={16} className="text-[#2d7ff9]" />
          <span className="text-[14px] font-semibold text-[#2d7ff9]">Autre problème ?</span>
        </button>

        {/* Estimation card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2d7ff9]/8 border border-[#2d7ff9]/20 mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#2d7ff9] uppercase mb-1">Estimation du service</p>
            <p className="text-[26px] font-bold text-[var(--text-primary)] leading-none">
              {(current?.price || 10000).toLocaleString('fr-FR')} <span className="text-[15px]">FCFA</span>
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1">Déplacement inclus, pièces en sus</p>
          </div>
          <div className="w-[70px] h-[70px] rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
            <Monitor size={30} className="text-[#2d7ff9]" />
          </div>
        </div>
        <div className="h-4" />
      </div>

      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)]">
        <button
          onClick={onProceed}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all duration-150 flex items-center justify-center gap-2"
        >
          Continuer la commande <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  )
}
