'use client'

import { useAuthStore } from '@/store/authStore'
import { ChevronLeft, HelpCircle, MessageSquare, Phone, Book, ChevronRight, Bell, Shield, Lock, Eye, Plus, MapPin, Trash2 } from 'lucide-react'
import { useState } from 'react'

// ─── Shared back header ───────────────────────────────────────────────────────
function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex-shrink-0">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-[#2d7ff9]">
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>
      <h1 className="flex-1 text-center text-[17px] font-bold text-[var(--text-primary)] mr-8">{title}</h1>
    </div>
  )
}

// ─── Adresses ────────────────────────────────────────────────────────────────
const DEFAULT_ADDRESSES = [
  { id: '1', label: 'Domicile', address: '12 Rue des Jardins, Akpakpa, Cotonou', isDefault: true },
  { id: '2', label: 'Bureau',   address: '45 Avenue Steinmetz, Plateau, Cotonou', isDefault: false },
]

export function AdressesScreen({ onBack }: { onBack: () => void }) {
  const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES)
  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newAddr, setNewAddr] = useState('')

  const handleAdd = () => {
    if (!newLabel || !newAddr) return
    setAddresses(prev => [...prev, { id: Date.now().toString(), label: newLabel, address: newAddr, isDefault: false }])
    setNewLabel(''); setNewAddr(''); setShowAdd(false)
  }

  const setDefault = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  const remove = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id))

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Mes Adresses" onBack={onBack} />
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 pb-6 space-y-3">
        <p className="text-[13px] text-[var(--text-secondary)] mb-4">Gérez vos adresses d&apos;intervention pour vos commandes.</p>

        {addresses.map(addr => (
          <div key={addr.id} className={`p-4 rounded-2xl border transition-all ${addr.isDefault ? 'border-[#2d7ff9] bg-[#2d7ff9]/8' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-[var(--text-primary)]">{addr.label}</span>
                {addr.isDefault && <span className="text-[10px] font-bold text-[#2d7ff9] bg-[#2d7ff9]/10 px-2 py-0.5 rounded-full">Défaut</span>}
              </div>
              <div className="flex items-center gap-1.5">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id)} className="text-[11px] text-[#2d7ff9] font-semibold px-2 py-1 rounded-lg hover:bg-[#2d7ff9]/10">
                    Définir
                  </button>
                )}
                <button onClick={() => remove(addr.id)} className="p-1.5 rounded-lg hover:bg-red-400/10">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-[var(--text-muted)] flex-shrink-0" />
              <p className="text-[12px] text-[var(--text-secondary)]">{addr.address}</p>
            </div>
          </div>
        ))}

        {showAdd ? (
          <div className="p-4 rounded-2xl border-2 border-dashed border-[#2d7ff9]/30 bg-[var(--bg-card)] space-y-3">
            <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Libellé (ex: Domicile)"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
            <input type="text" value={newAddr} onChange={e => setNewAddr(e.target.value)} placeholder="Adresse complète"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-10 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2d7ff9]" />
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 h-9 rounded-xl border border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)]">Annuler</button>
              <button onClick={handleAdd} className="flex-1 h-9 rounded-xl bg-[#2d7ff9] text-white text-[12px] font-bold">Ajouter</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[#2d7ff9]/40 transition-colors">
            <Plus size={16} className="text-[#2d7ff9]" />
            <span className="text-[13px] font-semibold text-[#2d7ff9]">Ajouter une adresse</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Centre d'aide ────────────────────────────────────────────────────────────
const FAQ = [
  { q: 'Comment réserver un service ?', a: 'Choisissez un service depuis l\'accueil, personnalisez votre demande (options, date, heure, lieu), puis payez l\'acompte. Un prestataire vous sera assigné rapidement.' },
  { q: 'Puis-je annuler une réservation ?', a: 'Oui, jusqu\'à 24h avant le rendez-vous. L\'acompte est remboursé intégralement en cas d\'annulation dans ce délai.' },
  { q: 'Comment contacter un prestataire ?', a: 'Rendez-vous dans la section Messagerie ou dans le suivi de votre mission pour échanger directement avec votre prestataire.' },
  { q: 'Les prestataires sont-ils vérifiés ?', a: 'Oui, tous nos prestataires passent par un processus de vérification d\'identité et de compétences avant d\'être acceptés sur Wekan.' },
  { q: 'Quels modes de paiement sont acceptés ?', a: 'MTN MoMo, Flooz, Celtiis Cash, et paiement par carte bancaire (Visa/Mastercard).' },
  { q: 'Que faire en cas de problème ?', a: 'Contactez notre support via le chat ou le téléphone. Notre équipe intervient sous 2h pour résoudre tout litige.' },
]

export function AideScreen({ onBack }: { onBack: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Centre d'aide" onBack={onBack} />
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        <p className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-3">Contact rapide</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: MessageSquare, label: 'Chat en direct', sub: 'Réponse < 5 min', color: 'text-[#2d7ff9]', bg: 'bg-[#2d7ff9]/10' },
            { icon: Phone,         label: 'Appel support',  sub: '+229 01 97 00 00', color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map(item => {
            const Icon = item.icon
            return (
              <button key={item.label} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} mb-3`}><Icon size={18} className={item.color} /></div>
                <p className="text-[14px] font-bold text-[var(--text-primary)]">{item.label}</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.sub}</p>
              </button>
            )
          })}
        </div>

        <p className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-3">Questions fréquentes</p>
        <div className="space-y-2 mb-6">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                <span className="text-[13px] font-semibold text-[var(--text-primary)] flex-1 pr-3">{item.q}</span>
                <ChevronRight size={16} className={`text-[var(--text-muted)] transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 border-t border-[var(--border)]">
                  <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed pt-3">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Confidentialité ──────────────────────────────────────────────────────────
export function ConfidentialiteScreen({ onBack }: { onBack: () => void }) {
  const [shareLocation, setShareLocation] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const Toggle = ({ val, onT }: { val: boolean; onT: () => void }) => (
    <button onClick={onT} className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${val ? 'bg-[#2d7ff9]' : 'bg-[var(--border)]'}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${val ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Confidentialité & Sécurité" onBack={onBack} />
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 space-y-4">
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
          {[
            { label: 'Partager ma localisation', sub: 'Pour trouver des prestataires proches', val: shareLocation, onT: () => setShareLocation(v => !v) },
            { label: 'Statistiques d\'utilisation', sub: 'Nous aide à améliorer l\'application', val: analytics, onT: () => setAnalytics(v => !v) },
            { label: 'Communications marketing', sub: 'Offres spéciales et promotions', val: marketing, onT: () => setMarketing(v => !v) },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{item.label}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{item.sub}</p>
              </div>
              <Toggle val={item.val} onT={item.onT} />
            </div>
          ))}
        </div>
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {[{ icon: Lock, label: 'Changer le mot de passe' }, { icon: Shield, label: 'Authentification 2 facteurs' }].map(item => {
            const Icon = item.icon
            return (
              <button key={item.label} className="w-full flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center"><Icon size={15} className="text-[#2d7ff9]" /></div>
                  <span className="text-[13px] font-semibold text-[var(--text-primary)]">{item.label}</span>
                </div>
                <ChevronRight size={15} className="text-[var(--text-muted)]" />
              </button>
            )
          })}
        </div>
        <button className="w-full py-3.5 rounded-2xl border border-red-400/30 bg-red-400/5 text-[14px] font-bold text-red-400">Supprimer mon compte</button>
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function ParametresNotifScreen({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState({ newProvider: true, statusUpdate: true, reminders: true, messages: true, promos: false, newsletter: false })
  const toggle = (k: keyof typeof settings) => setSettings(s => ({ ...s, [k]: !s[k] }))
  const items = [
    { key: 'newProvider',  label: 'Prestataire assigné',   sub: 'Quand un expert vous est attribué' },
    { key: 'statusUpdate', label: 'Mise à jour de statut', sub: 'Progression de votre mission' },
    { key: 'reminders',    label: 'Rappels de RDV',         sub: '30 min et 1h avant votre rendez-vous' },
    { key: 'messages',     label: 'Nouveaux messages',      sub: 'Messages de vos prestataires' },
    { key: 'promos',       label: 'Offres & promotions',    sub: 'Réductions et offres spéciales' },
    { key: 'newsletter',   label: 'Newsletter',             sub: 'Actualités Wekan par email' },
  ] as const
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Notifications" onBack={onBack} />
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5">
        <p className="text-[13px] text-[var(--text-secondary)] mb-5 leading-relaxed">Personnalisez les notifications que vous souhaitez recevoir.</p>
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
          {items.map(item => {
            const val = settings[item.key]
            return (
              <div key={item.key} className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${val ? 'bg-[#2d7ff9]/10' : 'bg-[var(--bg-surface)]'}`}>
                    <Bell size={15} className={val ? 'text-[#2d7ff9]' : 'text-[var(--text-muted)]'} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{item.sub}</p>
                  </div>
                </div>
                <button onClick={() => toggle(item.key)} className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${val ? 'bg-[#2d7ff9]' : 'bg-[var(--border)]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${val ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Phone ────────────────────────────────────────────────────────────────────
export function PhoneScreen({ onBack }: { onBack: () => void }) {
  const user = useAuthStore(s => s.user)
  const updateUser = useAuthStore(s => s.updateUser)
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)
  const save = () => { updateUser({ phone }); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Numéro de téléphone" onBack={onBack} />
      <div className="flex-1 px-4 pt-6">
        <p className="text-[13px] text-[var(--text-secondary)] mb-5">Votre numéro est utilisé pour la connexion et les communications.</p>
        <label className="block text-[13px] font-semibold text-[var(--text-primary)] mb-2">Numéro actuel</label>
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 h-[54px] focus-within:border-[#2d7ff9] mb-5">
          <span className="text-[14px]">🇧🇯</span>
          <span className="text-[12px] font-semibold text-[var(--text-secondary)] pr-3 border-r border-[var(--border)]">+229</span>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-[var(--text-primary)] focus:outline-none ml-3 font-mono" />
        </div>
        <button onClick={save} className="w-full h-[52px] rounded-2xl font-bold text-[15px] text-white bg-[#2d7ff9] hover:bg-[#1a6ce8] transition-all">
          {saved ? '✓ Enregistré !' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

// ─── CGU ──────────────────────────────────────────────────────────────────────
export function CGUScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] animate-fade-in">
      <BackHeader title="Conditions d'utilisation" onBack={onBack} />
      <div className="flex-1 overflow-y-auto screen-scroll px-4 pt-5 space-y-3">
        {[
          { title: '1. Acceptation', body: 'En utilisant Wekan, vous acceptez les présentes conditions d\'utilisation. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser nos services.' },
          { title: '2. Description', body: 'Wekan est une plateforme de mise en relation entre des clients et des prestataires de services à domicile au Bénin.' },
          { title: '3. Acompte et paiement', body: 'Un acompte minimum de 1 000 FCFA est requis pour confirmer toute réservation. Le solde est payable à la fin du service. L\'acompte est remboursable jusqu\'à 24h avant le rendez-vous.' },
          { title: '4. Responsabilité', body: 'Wekan agit comme intermédiaire. Nous vérifions nos prestataires mais ne sommes pas responsables de la qualité finale des travaux au-delà de notre garantie satisfaction.' },
          { title: '5. Données personnelles', body: 'Vos données sont traitées conformément à notre politique de confidentialité. Elles ne sont jamais vendues à des tiers.' },
        ].map(s => (
          <div key={s.title} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-4">
            <p className="text-[14px] font-bold text-[var(--text-primary)] mb-2">{s.title}</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{s.body}</p>
          </div>
        ))}
        <p className="text-[11px] text-[var(--text-muted)] text-center pb-6">Dernière mise à jour : Mars 2025</p>
      </div>
    </div>
  )
}
