'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Search, ChevronRight, Star, Quote, Bell } from 'lucide-react'
import { Screen } from '@/types'
import { useServices } from '@/hooks/useServices'
import { MOCK_TESTIMONIALS, MOCK_REALISATIONS } from '@/data/mock'
import { useAuthStore } from '@/store/authStore'
import TabBar from '@/components/ui/TabBar'
import Image from 'next/image'

interface HomeScreenProps {
  onSelectService: (id: string) => void
  onNavigate:      (screen: Screen) => void
}

/* ── Auto-scroll ticker ─────────────────────────────────────────── */
function AutoScrollRow<T>({ items, renderItem, itemWidth = 200 }: {
  items:      T[]
  renderItem: (item: T, i: number) => React.ReactNode
  itemWidth?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const posRef = useRef(0)
  const rafRef = useRef<number>()
  const doubled = [...items, ...items]

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const totalW = itemWidth * items.length + items.length * 12
    let last = performance.now()
    const tick = (now: number) => {
      if (!paused) {
        const dt = now - last
        posRef.current += dt * 0.038
        if (posRef.current >= totalW) posRef.current = 0
        if (el) el.style.transform = `translateX(-${posRef.current}px)`
      }
      last = now
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused, items.length, itemWidth])

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-3 will-change-transform"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {doubled.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  )
}

/* ── Banner carousel ────────────────────────────────────────────── */
function BannerCarousel({ banners, onTap }: { banners: any[]; onTap: (id?: string) => void }) {
  const [cur, setCur] = useState(0)
  const timerRef = useRef<any>()
  const next = useCallback(() => setCur(c => (c + 1) % banners.length), [banners.length])

  useEffect(() => {
    if (banners.length < 2) return
    timerRef.current = setInterval(next, 4000)
    return () => clearInterval(timerRef.current)
  }, [next])

  if (!banners.length) return null
  return (
    <div className="relative w-full h-[145px] rounded-2xl overflow-hidden">
      {banners.map((bn, i) => (
        <img key={bn.id} src={bn.image} alt={bn.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === cur ? 1 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <button
        type="button"
        aria-label={`Voir ${banners[cur].title}`}
        onClick={() => onTap(banners[cur].serviceId)}
        className="absolute inset-0 z-10 active:scale-[0.98] transition-transform"
      />
      <div className="pointer-events-none absolute top-3 left-3 z-20">
        <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-lg ${banners[cur].badgeColor}`}>
          {banners[cur].badge}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 right-14 z-20">
        <p className="text-white font-bold text-[17px] leading-tight drop-shadow">{banners[cur].title}</p>
        <p className="text-white/75 text-[12px] mt-0.5">{banners[cur].subtitle}</p>
      </div>
      <div className="absolute bottom-3.5 right-3 z-20 flex gap-1.5">
        {banners.map((_, i) => (
          <button key={i} type="button" aria-label={`Afficher la bannière ${i + 1}`} onClick={() => setCur(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === cur ? 16 : 6, height: 6, backgroundColor: i === cur ? 'white' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Service Card ───────────────────────────────────────────────── */
function ServiceCard({ service, onTap }: { service: any; onTap: () => void }) {
  return (
    <button onClick={onTap} className="relative h-[130px] rounded-2xl overflow-hidden active:scale-[0.97] transition-transform">
      <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <span className="text-[10px]">{service.icon}</span>
      </div>
      <div className="absolute bottom-2.5 left-2.5 right-2.5">
        <p className="text-white font-bold text-[13px] leading-tight drop-shadow">{service.name}</p>
        {service.basePrice && (
          <p className="text-white/65 text-[9px] mt-0.5">Dès {service.basePrice.toLocaleString('fr-FR')} FCFA</p>
        )}
      </div>
    </button>
  )
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function HomeScreen({ onSelectService, onNavigate }: HomeScreenProps) {
  const [search, setSearch] = useState('')
  const { services, banners, loading } = useServices()
  const user = useAuthStore(s => s.user)
  const firstName = user?.firstName ?? 'vous'
  const featured = services.slice(0, 4)
  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  // Live time
  const [now, setNow] = useState(new Date())
  useEffect(() => { const iv = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(iv) }, [])
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      <div className="flex-1 overflow-y-auto screen-scroll">

        {/* ── Header — soft, clean ── */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center justify-between">
            {/* Logo + greeting */}
            <div className="flex items-center gap-3">
              <div className="relative w-[90px] h-[28px]">
                <Image src="/favicon.png" alt="Wekan" fill style={{ objectFit: 'contain', objectPosition: 'left' }} priority />
              </div>
            </div>

            {/* Notifications bell */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center"
            >
              <Bell size={17} className="text-[var(--text-secondary)]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>

          {/* Greeting + date */}
          <div className="mt-3">
            <h2 className="text-[20px] font-bold text-[var(--text-primary)] leading-tight">
              {greeting}, <span className="text-[#2d7ff9]">{firstName}</span> 👋
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-[var(--text-muted)]" />
              <p className="text-[12px] text-[var(--text-secondary)] capitalize">{dateStr} · Cotonou, Bénin</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl px-4 h-[44px] mt-3 focus-within:border-[#2d7ff9] transition-colors">
            <Search size={15} className="text-[var(--text-muted)] flex-shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un service..."
              className="flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
        </div>

        {/* ── Search results ── */}
        {search ? (
          <div className="px-4 pt-4 pb-4">
            <p className="text-[13px] font-bold text-[var(--text-primary)] mb-3">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(s => <ServiceCard key={s.id} service={s} onTap={() => onSelectService(s.id)} />)}
              {!filtered.length && (
                <p className="col-span-2 text-center text-[13px] text-[var(--text-muted)] py-8">Aucun résultat</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Banner */}
            <div className="px-4 pt-4 mb-4">
              {loading
                ? <div className="w-full h-[145px] rounded-2xl bg-[var(--bg-card)] animate-pulse" />
                : <BannerCarousel banners={banners} onTap={id => id && onSelectService(id)} />
              }
            </div>

            {/* Catalogue — 4 services */}
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Nos services</h2>
              <button onClick={() => onNavigate('all-services')} className="flex items-center gap-0.5 text-[12px] font-semibold text-[#2d7ff9]">
                Voir tout <ChevronRight size={13} />
              </button>
            </div>
            <div className="px-4 mb-5">
              <div className="grid grid-cols-2 gap-3">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[130px] rounded-2xl bg-[var(--bg-card)] animate-pulse" />)
                  : featured.map(s => <ServiceCard key={s.id} service={s} onTap={() => onSelectService(s.id)} />)
                }
              </div>
            </div>

            {/* Réalisations */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Nos réalisations</h2>
                <span className="text-[11px] text-[var(--text-muted)]">{MOCK_REALISATIONS.length} projets</span>
              </div>
              <div className="px-4">
                <AutoScrollRow items={MOCK_REALISATIONS} itemWidth={180}
                  renderItem={(r: any, i: number) => (
                    <button key={i} onClick={() => onSelectService(r.serviceId)}
                      className="flex-shrink-0 w-[180px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
                      <div className="relative h-[110px]">
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <p className="text-white text-[12px] font-bold leading-tight">{r.title}</p>
                          <p className="text-white/65 text-[10px] mt-0.5">{r.location}</p>
                        </div>
                      </div>
                      <div className="bg-[var(--bg-card)] px-3 py-1.5">
                        <span className="text-[11px] font-semibold text-[#2d7ff9]">{r.serviceName}</span>
                      </div>
                    </button>
                  )}
                />
              </div>
            </div>

            {/* Avis */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Avis clients</h2>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400" fill="#FACC15" />
                  <span className="text-[12px] font-bold text-[var(--text-primary)]">4.8</span>
                </div>
              </div>
              <div className="px-4">
                <AutoScrollRow items={MOCK_TESTIMONIALS} itemWidth={220}
                  renderItem={(t: any, i: number) => (
                    <div key={i} className="flex-shrink-0 w-[220px] p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                      <Quote size={14} className="text-[#2d7ff9] mb-2" />
                      <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">{t.comment}</p>
                      <div className="flex items-center gap-2">
                        <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-[12px] font-bold text-[var(--text-primary)]">{t.name}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: t.rating }).map((_, j) => (
                              <Star key={j} size={9} className="text-yellow-400" fill="#FACC15" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar active="home" onNavigate={onNavigate} />
    </div>
  )
}
