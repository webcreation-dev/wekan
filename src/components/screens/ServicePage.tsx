'use client'

import { ChevronLeft, Star, Clock, MapPin, CheckCircle } from 'lucide-react'
import { MOCK_SERVICES } from '@/data/mock'

interface ServicePageProps {
  serviceId: string
  onBack: () => void
  onBook: () => void
}

export default function ServicePage({ serviceId, onBack, onBook }: ServicePageProps) {
  const service = MOCK_SERVICES.find(s => s.id === serviceId) || MOCK_SERVICES[0]

  const priceRanges: Record<string, { label: string; price: string }[]> = {
    plomberie: [
      { label: 'Détection de fuite', price: '15 000 FCFA' },
      { label: 'Réparation robinet', price: '8 000 FCFA' },
      { label: 'Débouchage canalisation', price: '25 000 FCFA' },
      { label: 'Installation chauffe-eau', price: '45 000 FCFA' },
    ],
    electricite: [
      { label: 'Remplacement ampoule', price: '45 000 FCFA' },
      { label: 'Réparation interrupteur', price: '35 000 FCFA' },
      { label: 'Mise à niveau tableau', price: '150 000 FCFA' },
    ],
    nettoyage: [
      { label: 'Nettoyage complet', price: '25 000 FCFA' },
      { label: 'Nettoyage après travaux', price: '35 000 FCFA' },
      { label: 'Lavage vitres', price: '15 000 FCFA' },
    ],
    climatisation: [
      { label: 'Installation split', price: '85 000 FCFA' },
      { label: 'Entretien annuel', price: '15 000 FCFA' },
      { label: 'Recharge gaz', price: '12 000 FCFA' },
    ],
  }

  const prices = priceRanges[serviceId] || [
    { label: 'Prestation de base', price: `${service.basePrice?.toLocaleString('fr-FR') ?? '15 000'} FCFA` },
    { label: 'Prestation avancée', price: `${((service.basePrice ?? 15000) * 2).toLocaleString('fr-FR')} FCFA` },
  ]

  const features = [
    'Prestataire vérifié et certifié',
    'Intervention sous 2h à Cotonou',
    'Garantie satisfaction 30 jours',
    'Paiement sécurisé (Orange Money, Wave)',
  ]

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-[#2d7ff9]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">
          {service.name}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto screen-scroll">
        {/* Hero image */}
        <div className="relative h-[200px]">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-[20px]">{service.name}</p>
              <p className="text-white/70 text-[12px]">{service.category}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
              <Star size={12} className="text-yellow-400" fill="#FACC15" />
              <span className="text-white text-[12px] font-bold">4.8</span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 pb-6 space-y-5">
          {/* Description */}
          <div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)] mb-2">À propos de ce service</h2>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{service.description}. Nos professionnels certifiés interviennent rapidement dans toutes les zones de Cotonou et ses environs. Chaque intervention est réalisée avec du matériel de qualité professionnelle.</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-3">Nos engagements</h2>
            <div className="space-y-2.5">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={13} className="text-green-500" />
                  </div>
                  <span className="text-[13px] text-[var(--text-secondary)]">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price ranges */}
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-3">Tarifs indicatifs</h2>
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
              {prices.map((p, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3.5 ${i < prices.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                  <span className="text-[13px] text-[var(--text-secondary)]">{p.label}</span>
                  <span className="text-[13px] font-bold text-[#2d7ff9]">{p.price}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-2 px-1">
              * Prix indicatifs. L'acompte minimum est de 1 000 FCFA pour confirmer la réservation.
            </p>
          </div>

          {/* Info pills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <Clock size={16} className="text-[#2d7ff9]" />
              <div>
                <p className="text-[11px] text-[var(--text-muted)]">Délai</p>
                <p className="text-[12px] font-bold text-[var(--text-primary)]">Sous 2h</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <MapPin size={16} className="text-[#2d7ff9]" />
              <div>
                <p className="text-[11px] text-[var(--text-muted)]">Zone</p>
                <p className="text-[12px] font-bold text-[var(--text-primary)]">Tout Cotonou</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - "Avez-vous besoin de ce service ?" */}
      <div className="px-4 pt-3 pb-6 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <p className="text-[12px] text-[var(--text-muted)] text-center mb-3">
          Avez-vous besoin de ce service aujourd&apos;hui ?
        </p>
        <button
          onClick={onBook}
          className="w-full h-[56px] rounded-2xl font-bold text-[17px] text-white
            bg-[#2d7ff9] hover:bg-[#1a6ce8] active:scale-[0.98]
            transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <span className="text-xl">✨</span>
          Réserver maintenant
        </button>
      </div>
    </div>
  )
}
