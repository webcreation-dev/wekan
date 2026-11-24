'use client'

/**
 * ─── RequestFlowScreen ──────────────────────────────────────────────────────
 * Parcours de demande en 3 étapes :
 *   1. Lieu      : position actuelle (GPS) ou lieu enregistré, ou « plus tard »
 *   2. Le souci  : message vocal + texte facultatif
 *   3. Envoyée   : un agent va appeler le client pour fixer date et prix
 */

import { useEffect, useRef, useState } from 'react'
import {
  Bookmark, Check, ChevronLeft, Loader2, MapPin, Mic, Phone, Trash2,
} from 'lucide-react'
import { RequestLocation, ServiceRequest } from '@/types'
import { getRequestService } from '@/data/trades'
import { DraftMessage, useRequestsStore } from '@/store/requestsStore'
import GoogleMapsIcon from '@/components/ui/GoogleMapsIcon'
import { errorMessage } from '@/lib/api-client'
import { VoiceBubble, VoiceComposer } from '@/components/ui/VoiceNote'

const ACCENT = '#2d7ff9'
const PLACE_LABELS = ['Domicile', 'Bureau', 'Autre']

interface RequestFlowScreenProps {
  serviceId: string
  onBack: () => void
  onSeeRequests: () => void
  onHome: () => void
}

type Step = 'location' | 'problem' | 'done'

// ── En-tête + progression ─────────────────────────────────────────────────────
function FlowHeader({ title, step, onBack }: { title: string; step: 1 | 2; onBack: () => void }) {
  return (
    <div className="flex-shrink-0 bg-[var(--bg-card)] px-4 pb-4 pt-4">
      <div className="flex items-center">
        <button onClick={onBack} aria-label="Retour" className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--bg-surface)]">
          <ChevronLeft size={24} strokeWidth={2.2} className="text-[var(--text-primary)]" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Étape {step} sur 3</p>
          <h1 className="text-[17px] font-bold leading-tight text-[var(--text-primary)]">{title}</h1>
        </div>
        <div className="w-10" />
      </div>
      <div className="mt-4 flex gap-1.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9edf3] dark:bg-white/10">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: i <= step ? '100%' : '0%', backgroundColor: ACCENT }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PrimaryButton({ children, onClick, disabled, loading }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(45,127,249,0.28)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
      style={{ backgroundColor: ACCENT }}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </button>
  )
}

function ServiceChip({ name, image }: { name: string; image: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[var(--bg-card)] p-2.5 pr-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
      <img src={image} alt="" className="h-11 w-11 rounded-xl object-cover" />
      <div className="min-w-0">
        <p className="text-[11px] text-[var(--text-muted)]">Service demandé</p>
        <p className="truncate text-[15px] font-bold text-[var(--text-primary)]">{name}</p>
      </div>
    </div>
  )
}

// ── Étape 1 : lieu ────────────────────────────────────────────────────────────
function LocationStep({ serviceName, serviceImage, onBack, onNext }: {
  serviceName: string
  serviceImage: string
  onBack: () => void
  onNext: (location: RequestLocation | null) => void
}) {
  const { savedPlaces, savePlace, loadPlaces } = useRequestsStore()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  useEffect(() => { loadPlaces() }, [loadPlaces])
  const [selectedId, setSelectedId] = useState<string | null>(null) // 'current' ou id d'un lieu enregistré
  const [current, setCurrent] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [saveIt, setSaveIt] = useState(false)
  const [placeLabel, setPlaceLabel] = useState('Domicile')

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoError('La localisation n’est pas disponible sur cet appareil.')
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurrent({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSelectedId('current')
        setLocating(false)
      },
      err => {
        setLocating(false)
        setGeoError(err.code === err.PERMISSION_DENIED
          ? 'Autorisez l’accès à votre position dans le navigateur, puis réessayez.'
          : 'Impossible de récupérer votre position. Réessayez.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const confirm = async () => {
    if (selectedId === 'current' && current) {
      const location = { label: saveIt ? placeLabel : 'Position actuelle', ...current }
      if (saveIt) {
        setSaving(true); setSaveError(null)
        try { await savePlace(location) } catch (err) { setSaveError(errorMessage(err)); setSaving(false); return }
        setSaving(false)
      }
      onNext(location)
      return
    }
    const place = savedPlaces.find(p => p.id === selectedId)
    if (place) onNext({ label: place.label, lat: place.lat, lng: place.lng })
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg-primary)]">
      <FlowHeader title="Où doit-on intervenir ?" step={1} onBack={onBack} />

      <div className="screen-scroll flex-1 space-y-5 overflow-y-auto px-4 pb-6 pt-5">
        <ServiceChip name={serviceName} image={serviceImage} />

        {/* Position actuelle */}
        <div>
          <button
            onClick={locate}
            disabled={locating}
            className={`flex w-full items-center gap-3.5 rounded-2xl border-2 bg-[var(--bg-card)] p-4 text-left transition-colors ${
              selectedId === 'current' ? 'border-[#2d7ff9]' : 'border-transparent'
            }`}
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-card)] shadow-[0_2px_10px_rgba(15,23,42,0.10)] dark:border dark:border-white/10">
              {locating ? <Loader2 size={22} className="animate-spin text-[#2d7ff9]" /> : <GoogleMapsIcon size={20} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-[var(--text-primary)]">
                {locating ? 'Localisation en cours…' : current ? 'Position actuelle trouvée' : 'Utiliser ma position actuelle'}
              </span>
              <span className="mt-0.5 block text-[12px] text-[var(--text-secondary)]">
                {current
                  ? `${current.lat.toFixed(5)}, ${current.lng.toFixed(5)}`
                  : 'Si vous êtes sur le lieu de l’intervention'}
              </span>
            </span>
            {selectedId === 'current' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: ACCENT }}>
                <Check size={14} strokeWidth={3} />
              </span>
            )}
          </button>
          {geoError && <p className="mt-2 px-1 text-[12px] text-red-500">{geoError}</p>}

          {/* Enregistrer ce lieu */}
          {selectedId === 'current' && current && (
            <div className="mt-3 rounded-2xl bg-[var(--bg-card)] p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={saveIt} onChange={e => setSaveIt(e.target.checked)} className="peer sr-only" />
                <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#cfd6e2] text-white peer-checked:border-[#2d7ff9] peer-checked:bg-[#2d7ff9]">
                  {saveIt && <Check size={14} strokeWidth={3} />}
                </span>
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">Enregistrer ce lieu pour la prochaine fois</span>
              </label>
              {saveIt && (
                <div className="mt-3 flex gap-2">
                  {PLACE_LABELS.map(label => (
                    <button
                      key={label}
                      onClick={() => setPlaceLabel(label)}
                      className={`h-9 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                        placeLabel === label ? 'bg-[#2d7ff9] text-white' : 'bg-[#f2f4f8] text-[var(--text-secondary)] dark:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lieux enregistrés */}
        {savedPlaces.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-[13px] font-bold text-[var(--text-secondary)]">Mes lieux enregistrés</p>
            <div className="space-y-2">
              {savedPlaces.map(place => {
                const selected = selectedId === place.id
                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedId(place.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-[var(--bg-card)] p-3.5 text-left transition-colors ${
                      selected ? 'border-[#2d7ff9]' : 'border-transparent'
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f8] text-[var(--text-secondary)] dark:bg-white/5">
                      <Bookmark size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-[var(--text-primary)]">{place.label}</span>
                      <span className="block text-[11px] text-[var(--text-muted)]">{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
                    </span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: ACCENT }}>
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 space-y-2 bg-[var(--bg-primary)] px-4 pb-6 pt-3">
        {saveError && <p className="text-center text-[12px] text-red-500">{saveError}</p>}
        <PrimaryButton onClick={confirm} disabled={!selectedId} loading={saving}>Continuer</PrimaryButton>
        <button onClick={() => onNext(null)} className="h-11 w-full text-[14px] font-semibold text-[#2d7ff9]">
          Je le ferai plus tard
        </button>
      </div>
    </div>
  )
}

// ── Étape 2 : plusieurs vocaux et messages (façon WhatsApp) ───────────────────
// Chaque vocal / message envoyé ici devient un message de la conversation liée à la demande.
type Draft = DraftMessage & { id: string }

function ProblemStep({ serviceName, serviceImage, location, onBack, onSubmit }: {
  serviceName: string
  serviceImage: string
  location: RequestLocation | null
  onBack: () => void
  onSubmit: (messages: DraftMessage[]) => Promise<void>
}) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const pendingText = text.trim()
  const canSubmit = drafts.length > 0 || pendingText.length > 0

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [drafts.length])

  const add = (draft: DraftMessage) => setDrafts(prev => [...prev, { ...draft, id: `${Date.now()}-${prev.length}` }])
  const remove = (id: string) => setDrafts(prev => {
    const target = prev.find(d => d.id === id)
    if (target?.voiceNote) URL.revokeObjectURL(target.voiceNote.url)
    return prev.filter(d => d.id !== id)
  })

  const sendText = () => {
    if (!pendingText) return
    add({ text: pendingText })
    setText('')
  }

  // Le texte encore dans le champ est aussi envoyé
  const submit = async () => {
    setSending(true); setSendError(null)
    try {
      await onSubmit([
        ...drafts.map(({ text, voiceNote }) => ({ text, voiceNote })),
        ...(pendingText ? [{ text: pendingText }] : []),
      ])
    } catch (err) {
      setSendError(errorMessage(err))
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg-primary)]">
      <FlowHeader title="Expliquez votre souci" step={2} onBack={onBack} />

      {/* Fil façon messagerie */}
      <div className="screen-scroll flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-5">
        <ServiceChip name={serviceName} image={serviceImage} />
        <p className="flex items-center gap-1.5 px-1 text-[12px] text-[var(--text-secondary)]">
          <MapPin size={13} /> {location ? location.label : 'Lieu à préciser avec l’agent'}
        </p>

        <div className="mx-auto w-fit max-w-[90%] rounded-xl bg-[#fff6d9] px-3.5 py-2 text-center text-[12px] leading-snug text-[#6b5a1e] dark:bg-amber-500/10 dark:text-amber-300">
          Maintenez le micro <Mic size={12} className="inline -mt-0.5" /> pour envoyer des vocaux, ou écrivez des messages.
          Vous pouvez en envoyer plusieurs : ils seront dans la conversation de votre demande.
        </div>

        {drafts.map(draft => draft.voiceNote ? (
          <VoiceBubble key={draft.id} note={draft.voiceNote} onDelete={() => remove(draft.id)} />
        ) : (
          <div key={draft.id} className="flex items-center justify-end gap-2">
            <button onClick={() => remove(draft.id)} aria-label="Supprimer le message" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] active:bg-red-500/10 active:text-red-500">
              <Trash2 size={18} />
            </button>
            <div className="max-w-[78%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#2d7ff9] px-4 py-3 text-[15px] leading-relaxed text-white">
              {draft.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 space-y-3 bg-[var(--bg-primary)] px-3 pb-6 pt-2">
        <VoiceComposer
          text={text}
          onTextChange={setText}
          onSendText={sendText}
          onVoice={note => add({ voiceNote: note })}
          placeholder="Écrire un message…"
        />
        {sendError && <p className="text-center text-[12px] text-red-500">{sendError}</p>}
        <PrimaryButton onClick={submit} disabled={!canSubmit} loading={sending}>
          {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </PrimaryButton>
      </div>
    </div>
  )
}

// ── Étape 3 : confirmation ────────────────────────────────────────────────────
function DoneStep({ request, onSeeRequests, onHome }: { request: ServiceRequest; onSeeRequests: () => void; onHome: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[var(--bg-card)]">
      <div className="flex-shrink-0 px-4 pt-4">
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: ACCENT }} />)}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-7">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#2d7ff9]/20" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-[0_12px_28px_rgba(45,127,249,0.35)]" style={{ backgroundColor: ACCENT }}>
            <Phone size={40} strokeWidth={2} />
          </span>
        </div>
        <h1 className="text-[24px] font-bold leading-tight tracking-[-0.03em] text-[var(--text-primary)]">
          Un agent va vous appeler dans un instant
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          Il prendra en charge votre demande de <span className="font-semibold text-[var(--text-primary)]">{request.serviceName.toLowerCase()}</span>,
          puis fixera avec vous la date d’intervention et le prix. Gardez votre téléphone à portée de main.
        </p>
      </div>

      <div className="flex-shrink-0 space-y-2 px-4 pb-6">
        <PrimaryButton onClick={onSeeRequests}>Voir mes demandes</PrimaryButton>
        <button onClick={onHome} className="h-11 w-full text-[14px] font-semibold text-[#2d7ff9]">Retour à l’accueil</button>
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function RequestFlowScreen({ serviceId, onBack, onSeeRequests, onHome }: RequestFlowScreenProps) {
  const service = getRequestService(serviceId)
  const createRequest = useRequestsStore(state => state.createRequest)
  const [step, setStep] = useState<Step>('location')
  const [location, setLocation] = useState<RequestLocation | null>(null)
  const [created, setCreated] = useState<ServiceRequest | null>(null)

  if (step === 'done' && created) {
    return <DoneStep request={created} onSeeRequests={onSeeRequests} onHome={onHome} />
  }

  if (step === 'problem') {
    return (
      <ProblemStep
        serviceName={service.name}
        serviceImage={service.image}
        location={location}
        onBack={() => setStep('location')}
        onSubmit={async messages => {
          setCreated(await createRequest({ serviceId: service.id, location, messages }))
          setStep('done')
        }}
      />
    )
  }

  return (
    <LocationStep
      serviceName={service.name}
      serviceImage={service.image}
      onBack={onBack}
      onNext={loc => { setLocation(loc); setStep('problem') }}
    />
  )
}
