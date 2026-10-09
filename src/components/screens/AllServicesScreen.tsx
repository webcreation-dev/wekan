'use client'

import { useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useServices } from '@/hooks/useServices'

interface AllServicesScreenProps {
  onBack: () => void
  onSelectService: (id: string) => void
}

export default function AllServicesScreen({ onBack, onSelectService }: AllServicesScreenProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Tous')
  const { services, loading } = useServices()

  const categories = ['Tous', ...Array.from(new Set(services.map(s => s.category)))]
  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'Tous' || s.category === activeCategory
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={24} className="text-[var(--text-primary)]" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)] flex-1">Tous les Services</h1>
        <span className="text-[12px] text-[var(--text-muted)]">{filtered.length} service{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[44px]">
          <Search size={16} className="text-[var(--text-muted)] flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un service..."
            className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-[var(--border)]" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${activeCategory === cat ? 'bg-[#2d7ff9] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-4 pb-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-[130px] rounded-2xl bg-[var(--bg-card)] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[14px] text-[var(--text-muted)]">Aucun service trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(s => (
              <button key={s.id} onClick={() => onSelectService(s.id)}
                className="relative h-[130px] rounded-2xl overflow-hidden active:scale-[0.97] transition-transform">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[10px]">{s.icon}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="text-white font-bold text-[13px] leading-tight drop-shadow">{s.name}</p>
                  {s.basePrice && <p className="text-white/65 text-[9px] mt-0.5">Dès {s.basePrice.toLocaleString('fr-FR')} FCFA</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
