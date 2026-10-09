'use client'

import { useEffect, useState, useRef } from 'react'
import './landing.css'

/* ── Scroll reveal ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useNavScroll() {
  const [s, setS] = useState(false)
  useEffect(() => {
    const h = () => setS(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return s
}

/* ── Data ──────────────────────────────────────────────────────── */
const SERVICES = [
  { tag: 'Plumbing', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop', title: 'Precision Plumbing', desc: 'Fast, certified plumbing fixes. Leaks, installations, drainage — solved within hours.' },
  { tag: 'Painting', img: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&h=300&fit=crop', title: 'Master Painting', desc: 'Interior and exterior painting with premium finishes. Walls, ceilings, facades.' },
  { tag: 'Masonry', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=300&fit=crop', title: 'Stone Masonry', desc: 'Structural construction and repairs. Walls, slabs, cracks — handled by experts.' },
  { tag: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=300&fit=crop', title: 'Electrical Work', desc: 'Certified electricians for safe wiring, panel upgrades and smart home integration.' },
  { tag: 'Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=300&fit=crop', title: 'Deep Cleaning', desc: 'Professional home cleaning — post-construction, move-in/out, regular deep cleans.' },
  { tag: 'Carpentry', img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&h=300&fit=crop', title: 'Custom Carpentry', desc: 'Bespoke furniture, doors, and woodwork crafted to match your vision exactly.' },
]

const STEPS = [
  { n: '01', active: true,  title: 'Download & Register', desc: 'Download the Wekan app on Android or iOS. Create your account in under 60 seconds.' },
  { n: '02', active: false, title: 'Choose Your Service', desc: 'Browse 10+ services. Select the type of work you need — from plumbing to carpentry.' },
  { n: '03', active: true,  title: 'Book & Plan', desc: 'Pick your date, time and address. A verified professional is assigned within 2 hours.' },
  { n: '04', active: false, title: 'Track & Pay', desc: 'Follow your pro live on the map. Secure payment via MTN MoMo, Flooz or card.' },
]

const FEATURES = [
  { icon: '✅', title: 'Verified Professionals', desc: 'Every artisan passes a 14-point background check before joining Wekan. Identity, skills, and reviews verified.' },
  { icon: '📍', title: 'Real-Time GPS Tracking', desc: 'See exactly where your professional is on the map. Get sound alerts when they start, are nearby, or arrive.' },
  { icon: '💬', title: 'Direct Messaging', desc: 'Chat with your professional on the platform or WhatsApp. No friction, instant communication.' },
  { icon: '🛡️', title: '100% Satisfaction Guarantee', desc: 'Not happy? Get a full refund within 24 hours. We stand behind every single intervention, no questions asked.' },
]

const TESTIMONIALS = [
  { stars: 5, quote: '"Wekan transformed how I manage my property. The plumber arrived in 90 minutes and fixed everything perfectly. The live tracking was incredibly reassuring."', name: 'Emmanuel Adjovi', role: 'Property Owner · Cotonou', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { stars: 5, quote: '"Excellent service. I booked a painter and the result was flawless. The app is clean and easy to use — booking took less than 3 minutes."', name: 'Fatoumata Diallo', role: 'Interior Designer · Calavi', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face' },
  { stars: 5, quote: '"The masonry team was professional, on time, and incredibly skilled. I trusted the platform and it delivered beyond my expectations."', name: 'Carlos Akognon', role: 'Entrepreneur · Porto-Novo', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
]

export default function LandingPage() {
  useReveal()
  const navScrolled = useNavScroll()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3500)
  }

  // Phone UI mock screens
  const PhoneHomeScreen = () => (
    <div style={{ background: '#f0f4f8', minHeight: 480, position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2d7ff9)', padding: '1.5rem 1rem 3rem', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <div>
            <p style={{ fontSize: '.6rem', opacity: .7 }}>Good morning</p>
            <p style={{ fontSize: '.85rem', fontWeight: 700 }}>Kofi Mensah 👋</p>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem' }}>🔔</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 8, padding: '.5rem .75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <span style={{ fontSize: '.7rem', opacity: .8 }}>🔍</span>
          <span style={{ fontSize: '.65rem', opacity: .6 }}>Search a service...</span>
        </div>
      </div>
      {/* Cards */}
      <div style={{ padding: '.75rem', marginTop: -20 }}>
        <div style={{ background: 'white', borderRadius: 14, padding: '.75rem', boxShadow: '0 4px 20px rgba(30,58,138,.1)', marginBottom: '.6rem' }}>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
            {['🔧','⚡','🎨','🧹'].map((ic,i) => (
              <div key={i} style={{ flex: 1, background: '#eff6ff', borderRadius: 8, padding: '.4rem', textAlign: 'center', fontSize: '.9rem' }}>{ic}</div>
            ))}
          </div>
          <p style={{ fontSize: '.6rem', fontWeight: 600, color: '#1e3a8a' }}>Our Services</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2d7ff9)', borderRadius: 14, padding: '.8rem', color: 'white', marginBottom: '.6rem' }}>
          <p style={{ fontSize: '.6rem', opacity: .7 }}>Scheduled</p>
          <p style={{ fontSize: '.75rem', fontWeight: 700 }}>Plumbing · Today 2:30 PM</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: '.4rem' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.3)', fontSize: '.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            <p style={{ fontSize: '.6rem', opacity: .8 }}>Alex Johnson · ★ 4.9</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
          {['Painting','Masonry'].map((s,i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(30,58,138,.07)' }}>
              <div style={{ height: 45, background: `linear-gradient(135deg, #${i===0?'3b82f6,60a5fa':'1e3a8a,2d7ff9'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{i===0?'🎨':'🧱'}</div>
              <p style={{ fontSize: '.6rem', fontWeight: 600, padding: '.35rem', color: '#0f172a' }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const PhoneTrackingScreen = () => (
    <div style={{ background: '#f0f4f8', minHeight: 400, position: 'relative' }}>
      {/* Map area */}
      <div style={{ height: 200, background: 'linear-gradient(180deg,#dbeafe 0%,#eff6ff 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Grid lines */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: i*50, height: 1, background: 'rgba(147,197,253,.3)' }} />
        ))}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: i*60, width: 1, background: 'rgba(147,197,253,.3)' }} />
        ))}
        {/* Route line */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 30 180 Q 80 100 150 80 Q 200 60 230 40" stroke="#2d7ff9" strokeWidth="2.5" fill="none" strokeDasharray="6,3" />
        </svg>
        {/* Provider pin */}
        <div style={{ position: 'absolute', top: 55, left: 115, zIndex: 5 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50% 50% 50% 0', background: '#2d7ff9', border: '3px solid white', transform: 'rotate(-45deg)', boxShadow: '0 4px 12px rgba(45,127,249,.5)' }} />
          <div style={{ background: 'white', borderRadius: 6, padding: '2px 6px', fontSize: '.55rem', fontWeight: 700, color: '#1e3a8a', marginTop: 2, boxShadow: '0 2px 8px rgba(0,0,0,.1)', whiteSpace: 'nowrap' }}>Alex J. · 3 min</div>
        </div>
        {/* Client pin */}
        <div style={{ position: 'absolute', top: 25, left: 200 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1e3a8a', border: '3px solid white', boxShadow: '0 3px 8px rgba(30,58,138,.4)' }} />
          <div style={{ background: '#1e3a8a', color: 'white', borderRadius: 5, padding: '1px 5px', fontSize: '.5rem', fontWeight: 700, marginTop: 2, textAlign: 'center' }}>You</div>
        </div>
        {/* Status pill */}
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 20, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,.1)', whiteSpace: 'nowrap' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2d7ff9', animation: 'none' }} />
          <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#1e3a8a' }}>On his way · 3 min</span>
        </div>
      </div>
      {/* Bottom sheet */}
      <div style={{ background: 'white', padding: '.8rem', borderRadius: '14px 14px 0 0', marginTop: -14, boxShadow: '0 -4px 20px rgba(30,58,138,.08)' }}>
        <div style={{ width: 30, height: 3, background: '#e2e8f0', borderRadius: 2, margin: '0 auto .6rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2d7ff9,#1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>👷</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '.72rem', fontWeight: 700, color: '#0f172a' }}>Alex Johnson</p>
            <p style={{ fontSize: '.6rem', color: '#94a3b8' }}>Plumber · ★ 4.9 (127 reviews)</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: '.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '.55rem', color: '#94a3b8' }}>ETA</p>
            <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#1e3a8a' }}>~3 min</p>
          </div>
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: '.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '.55rem', color: '#94a3b8' }}>Distance</p>
            <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#1e3a8a' }}>0.4 km</p>
          </div>
        </div>
      </div>
    </div>
  )

  const PhoneBookingScreen = () => (
    <div style={{ background: 'white', minHeight: 380 }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#2d7ff9)', padding: '1rem', color: 'white' }}>
        <p style={{ fontSize: '.6rem', opacity: .7 }}>Booking</p>
        <p style={{ fontSize: '.85rem', fontWeight: 700 }}>Schedule Plumbing</p>
      </div>
      <div style={{ padding: '.75rem' }}>
        <p style={{ fontSize: '.65rem', fontWeight: 700, color: '#475569', marginBottom: '.5rem' }}>Select Date</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: '.75rem' }}>
          {['M','T','W','T','F','S','S'].map((d,i) => (
            <div key={i} style={{ textAlign: 'center', padding: '4px 2px', borderRadius: 6, background: i===2?'#2d7ff9':'#f8fafc', color: i===2?'white':'#94a3b8', fontSize: '.5rem', fontWeight: 600 }}>
              <div style={{ marginBottom: 2 }}>{d}</div>
              <div style={{ fontWeight: 700, fontSize: '.6rem', color: i===2?'white':'#0f172a' }}>{12+i}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '.65rem', fontWeight: 700, color: '#475569', marginBottom: '.4rem' }}>Time Slot</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: '.75rem' }}>
          {['09:00','10:00','11:00','14:00','15:00','16:00'].map((t,i) => (
            <div key={i} style={{ textAlign: 'center', padding: '4px', borderRadius: 6, background: i===1?'#2d7ff9':'#eff6ff', color: i===1?'white':'#1e3a8a', fontSize: '.58rem', fontWeight: 600 }}>{t}</div>
          ))}
        </div>
        <div style={{ background: '#eff6ff', borderRadius: 8, padding: '.5rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <span style={{ fontSize: '.8rem' }}>📍</span>
          <div>
            <p style={{ fontSize: '.6rem', fontWeight: 700, color: '#1e3a8a' }}>Location</p>
            <p style={{ fontSize: '.55rem', color: '#94a3b8' }}>12 Rue des Jardins, Akpakpa</p>
          </div>
        </div>
        <div style={{ marginTop: '.6rem', background: 'linear-gradient(135deg,#1e3a8a,#2d7ff9)', borderRadius: 8, padding: '.6rem', textAlign: 'center', color: 'white', fontSize: '.72rem', fontWeight: 700 }}>
          Confirm Booking →
        </div>
      </div>
    </div>
  )

  return (
    <main>

      {/* ══ NAV ═══════════════════════════════════════════════════════ */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <img src="/logo.png" alt="Wekan" />
        </div>
        <ul className="nav-links">
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button className="nav-signin">Sign In</button>
          <a href="/" className="nav-cta">Get Started</a>
        </div>
      </nav>

      {/* ══ HERO — Design 1 (SEWO): text left, phones right ══════════ */}
      <section className="hero" id="home">
        {/* Left text */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-badge" style={{ animationDelay: '0s' }}>
            <div className="hero-badge-dot" />
            #1 Home Services App in Benin
          </div>
          <h1 style={{ animationDelay: '.1s' }}>
            Find your best <span>home service</span> with a tap
          </h1>
          <p className="hero-desc" style={{ animationDelay: '.2s' }}>
            Book verified professionals for plumbing, painting, electrical, masonry and more.
            Fast response, live tracking, guaranteed quality — right in your pocket.
          </p>
          <div className="hero-actions" style={{ animationDelay: '.3s' }}>
            <a href="/" className="btn-primary">Get Started ↗</a>
            <a href="#how" className="btn-secondary">How It Works</a>
          </div>
          <div className="hero-stats" style={{ animationDelay: '.4s' }}>
            <div><span className="stat-val">16K+</span><span className="stat-lbl">Active Users</span></div>
            <div><span className="stat-val">8K+</span><span className="stat-lbl">Jobs Completed</span></div>
            <div><span className="stat-val">500+</span><span className="stat-lbl">Verified Pros</span></div>
          </div>
        </div>

        {/* Right — phone mockups (Design 1 style: 3 phones stacked/rotated) */}
        <div className="hero-visual">
          {/* Main phone */}
          <div className="phone-main">
            <PhoneHomeScreen />
          </div>
          {/* Secondary phone */}
          <div className="phone-secondary">
            <PhoneTrackingScreen />
          </div>
          {/* Tertiary */}
          <div className="phone-tertiary">
            <PhoneBookingScreen />
          </div>

          {/* Floating cards */}
          <div className="float-card float-1">
            <div className="float-card-icon" style={{ background: '#eff6ff' }}>⭐</div>
            <div>
              <p>4.9 / 5.0</p>
              <span>Average rating</span>
            </div>
          </div>
          <div className="float-card float-2">
            <div className="float-card-icon" style={{ background: '#dcfce7' }}>✅</div>
            <div>
              <p>2h Response</p>
              <span>Average time</span>
            </div>
          </div>
          <div className="float-card float-3">
            <div className="float-card-icon" style={{ background: '#fef3c7' }}>🔒</div>
            <div>
              <p>100% Secure</p>
              <span>All payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER — Design 3 (Banko) style ══════════════════ */}
      <div className="stats-banner">
        {[
          { val: '16K', suf: '+', lbl: 'Active Users' },
          { val: '3m',  suf: '',  lbl: 'App Downloads' },
          { val: '25',  suf: '+', lbl: 'Service Types' },
          { val: '50k', suf: '',  lbl: 'Jobs Completed' },
        ].map((s, i) => (
          <div key={i} className="stats-banner-item reveal" style={{ animationDelay: `${i*80}ms` }}>
            <span className="stats-banner-val">{s.val}<span>{s.suf}</span></span>
            <span className="stats-banner-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ══ HOW IT WORKS — Design 1 (SEWO) easy steps ══════════════ */}
      <section className="how-section" id="how">
        <div className="how-inner">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p className="section-tag reveal">Process</p>
            <h2 className="section-title reveal">Easy steps to use <span>the service</span></h2>
            <p className="section-sub reveal" style={{ margin: '.75rem auto 0', textAlign: 'center' }}>
              From download to job done — Wekan makes the entire process seamless, fast and transparent.
            </p>
          </div>
          <div className="how-grid" style={{ marginTop: '4rem' }}>
            {/* Left — phone + map visual */}
            <div className="how-visual reveal-left">
              <div className="how-phone">
                <PhoneTrackingScreen />
              </div>
              <div className="how-map-overlay">
                <PhoneBookingScreen />
              </div>
              <div className="how-stat-pill">
                <div className="pill-icon">📍</div>
                <div>
                  <p>Live Tracking</p>
                  <span>Real-time GPS</span>
                </div>
              </div>
            </div>

            {/* Right — steps */}
            <div className="how-steps reveal-right">
              {STEPS.map((step, i) => (
                <div key={i}>
                  <div className="how-step">
                    <div className={`how-step-num ${step.active ? 'active' : ''}`}>{step.n}</div>
                    <div className="how-step-content">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && <div className="how-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES — Design 2 (Travellers) grid ══════════════════ */}
      <section className="services-section" id="services">
        <div className="services-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-tag reveal">Our Services</p>
              <h2 className="section-title reveal">Professional services <span>at your doorstep</span></h2>
              <p className="section-sub reveal">10+ service categories covered by certified professionals across all of Cotonou and surroundings.</p>
            </div>
            <a href="/" className="btn-primary reveal" style={{ alignSelf: 'flex-end' }}>See All →</a>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <img src={s.img} alt={s.title} className="service-card-img" />
                <div className="service-card-body">
                  <span className="service-card-tag">{s.tag}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <a href="/" className="service-link">View Service →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GET THE APP — Design 2 (Travellers) CTA banner ═════════ */}
      <section className="getapp-section">
        <div className="getapp-inner">
          <div className="getapp-text reveal-left">
            <p style={{ color: 'rgba(147,197,253,.9)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
              ✦ Mobile App
            </p>
            <h2>Get your property <span>serviced very easily</span></h2>
            <p>
              Download Wekan on your smartphone. Book a professional in 3 taps, track them live on the map,
              and pay securely with MTN MoMo, Flooz, or Celtiis Cash.
            </p>
            <div className="store-buttons">
              <a href="/" className="store-btn">
                <span className="store-btn-icon">▶</span>
                <div className="store-btn-text">
                  <span className="store-btn-sub">Get it on</span>
                  <span className="store-btn-label">Google Play</span>
                </div>
              </a>
              <a href="/" className="store-btn">
                <span className="store-btn-icon">🍎</span>
                <div className="store-btn-text">
                  <span className="store-btn-sub">Download on the</span>
                  <span className="store-btn-label">App Store</span>
                </div>
              </a>
            </div>
          </div>
          <div className="getapp-visual reveal-right">
            <div className="getapp-phone">
              <PhoneHomeScreen />
            </div>
            <div className="getapp-phone-2">
              <PhoneTrackingScreen />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES — Design 3 (Banko) grid bento ════════════════ */}
      <section className="features-section">
        <div className="features-inner">
          <div style={{ textAlign: 'center' }}>
            <p className="section-tag reveal">Why Wekan</p>
            <h2 className="section-title reveal">All the best features <span>in one app</span></h2>
            <p className="section-sub reveal" style={{ margin: '.75rem auto 0', textAlign: 'center' }}>
              Everything you need to book, track and pay for home services — built into one clean experience.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card reveal ${i === 1 ? 'blue-bg' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`feature-icon ${i === 1 ? 'dark' : 'light'}`}>{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — Design 1+2 combined ═════════════════════ */}
      <section className="testimonials-section" id="testimonials">
        <div className="testimonials-inner">
          <div style={{ textAlign: 'center' }}>
            <p className="section-tag reveal">Reviews</p>
            <h2 className="section-title reveal">What our people <span>are saying</span></h2>
          </div>
          <div className="testimonials-grid">
            {/* Featured wide testimonial */}
            <div className="testimonial-card featured reveal">
              <div>
                <div className="testimonial-stars">
                  {[1,2,3,4,5].map(j => <span key={j} className="testimonial-star">★</span>)}
                </div>
                <p className="testimonial-quote">{TESTIMONIALS[0].quote}</p>
                <div className="testimonial-author">
                  <img src={TESTIMONIALS[0].img} alt={TESTIMONIALS[0].name} className="testimonial-avatar" />
                  <div>
                    <p className="testimonial-name">{TESTIMONIALS[0].name}</p>
                    <p className="testimonial-role">{TESTIMONIALS[0].role}</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-score">
                <div className="testimonial-score-val">4.9</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '.5rem 0' }}>
                  {[1,2,3,4,5].map(j => <span key={j} style={{ color: '#fbbf24', fontSize: '1rem' }}>★</span>)}
                </div>
                <p className="testimonial-score-lbl">Average Rating<br />on 8,000+ reviews</p>
              </div>
            </div>

            {/* Regular cards */}
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={i} className="testimonial-card reveal" style={{ animationDelay: `${(i+1)*120}ms` }}>
                <div className="testimonial-stars">
                  {[1,2,3,4,5].map(j => <span key={j} className="testimonial-star">★</span>)}
                </div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <img src={t.img} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER — Design 1 footer newsletter ════════════════ */}
      <section className="newsletter-section" id="contact">
        <div className="newsletter-inner">
          <p className="section-tag reveal" style={{ justifyContent: 'center' }}>Stay Updated</p>
          <h3 className="reveal">Get new information<br /><span>about Wekan</span></h3>
          <p className="reveal" style={{ marginTop: '.5rem' }}>
            Be the first to know about new services, exclusive offers and app updates.
          </p>
          <form className="newsletter-form reveal" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              {sent ? '✓ Done!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* ══ FOOTER — Dark navy footer (Design 1 style) ════════════ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt="Wekan" className="footer-logo" />
            <p>
              The smarter way to book home services in Benin. Verified professionals, live tracking, and secure payments — all in one app.
            </p>
          </div>
          <div>
            <h5>Services</h5>
            <ul className="footer-links">
              {['Plumbing','Painting','Electrical','Masonry','Cleaning','Carpentry'].map(s => (
                <li key={s}><a href="/">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Help</h5>
            <ul className="footer-links">
              {['About Us','Careers','Privacy Policy','Terms of Use','Contact'].map(s => (
                <li key={s}><a href="/">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Get the App</h5>
            <ul className="footer-links">
              {['Android App','iOS App','How It Works','Become a Pro'].map(s => (
                <li key={s}><a href="/">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Wekan. All rights reserved.</p>
          <p>Built with ❤️ for Benin</p>
        </div>
      </footer>

    </main>
  )
}
