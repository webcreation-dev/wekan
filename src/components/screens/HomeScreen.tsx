'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Screen } from '@/types'
import TabBar from '@/components/ui/TabBar'
import AppHeader from '@/components/ui/AppHeader'
import { TRADES, Trade, TradeFilter } from '@/data/trades'

interface HomeScreenProps {
  onSelectService: (id: string) => void
  onNavigate: (screen: Screen) => void
}

type Filter = 'Tous' | TradeFilter

const FILTERS: { label: Filter; emoji: string }[] = [
  { label: 'Tous',         emoji: '✦' },
  { label: 'Construction', emoji: '🧱' },
  { label: 'Technique',    emoji: '🔧' },
  { label: 'Décoration',   emoji: '🎨' },
]

function TradeCard({ trade, onTap }: { trade: Trade; onTap: () => void }) {
  return (
    <button onClick={onTap} className="relative h-[128px] w-full overflow-hidden rounded-2xl bg-[#f2f4f8] text-left transition-transform active:scale-[0.97]">
      {trade.collage ? (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px">
          {trade.collage.map(src => <img key={src} src={src} alt="" className="h-full w-full object-cover" />)}
        </div>
      ) : (
        <img src={trade.image} alt={trade.label} className="h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <p className="absolute bottom-3 left-3.5 right-3 text-[15px] font-bold text-white">{trade.label}</p>
    </button>
  )
}

export default function HomeScreen({ onSelectService, onNavigate }: HomeScreenProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>('Tous')

  const query = search.trim().toLowerCase()
  const visibleTrades = TRADES.filter(trade =>
    (activeFilter === 'Tous' || trade.filter === null || trade.filter === activeFilter) &&
    (!query || trade.label.toLowerCase().includes(query))
  )

  const openTrade = (trade: Trade) =>
    trade.id === 'autre' ? onNavigate('all-services') : onSelectService(trade.id)

  return (
    <div className="flex h-full flex-col bg-[var(--bg-card)]">
      <div className="screen-scroll flex-1 overflow-y-auto pb-28">
        <header className="px-4 pb-4 pt-5">
          <AppHeader onNavigate={onNavigate} />

          <div className="mt-5 flex h-12 items-center gap-2 rounded-2xl border border-[#e6e9ef] bg-[var(--bg-card)] pl-4 pr-2 shadow-[0_2px_10px_rgba(15,23,42,0.04)] focus-within:border-[#2d7ff9]/40 dark:border-white/10">
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Un plombier, un électricien..."
              className="min-w-0 flex-1 truncate bg-transparent text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <Search size={22} strokeWidth={2.2} className="mr-1.5 flex-shrink-0 text-[#2d7ff9]" />
          </div>
        </header>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map(({ label, emoji }) => {
            const selected = activeFilter === label
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`flex h-10 flex-shrink-0 items-center gap-2 rounded-full border px-3.5 text-[12px] font-semibold transition-colors ${
                  selected ? 'border-[#2d7ff9] bg-[#2d7ff9] text-white shadow-[0_5px_12px_rgba(45,127,249,0.2)]' : 'border-transparent bg-[#f5f6fa] text-[var(--text-secondary)] dark:bg-white/5'
                }`}
              >
                <span className="text-[15px]">{emoji}</span>{label}
              </button>
            )
          })}
        </div>

        {/* Métiers : grille 2 colonnes */}
        <div className="flex items-center justify-between px-4 pt-6">
          <h2 className="text-[21px] font-bold tracking-[-0.035em] text-[var(--text-primary)]">Services populaires</h2>
          <button onClick={() => onNavigate('all-services')} className="text-[12px] font-semibold text-[#2d7ff9]">Voir tout</button>
        </div>
        <section className="grid grid-cols-2 gap-3 px-4 pt-3">
          {visibleTrades.map(trade => <TradeCard key={trade.id} trade={trade} onTap={() => openTrade(trade)} />)}
          {!visibleTrades.length && (
            <p className="col-span-2 py-8 text-center text-[13px] text-[var(--text-muted)]">Aucun métier trouvé</p>
          )}
        </section>
      </div>

      <TabBar active="home" onNavigate={onNavigate} />
    </div>
  )
}
