'use client'

/**
 * Demandes (espace agent) — branché sur /api/agent/requests.
 * L'agent voit toutes les demandes, appelle le client, fixe la date, l'heure,
 * le prix et l'artisan, répond dans la conversation et change le statut.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarClock, CheckCircle, Loader2, MapPin, Phone, RotateCcw, Search, Send, X, XCircle,
} from 'lucide-react'
import { RequestStatus, ServiceRequest } from '@/types'
import { api, errorMessage } from '@/lib/api-client'
import { formatAmount } from '@/components/admin/ui/AdminUI'

export interface AgentRequest extends ServiceRequest {
  client: { firstName: string; lastName: string; phone: string }
}

const STATUS: Record<RequestStatus, { label: string; cls: string }> = {
  awaiting_call: { label: 'En attente d’appel', cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  scheduled:     { label: 'Planifiée',          cls: 'bg-blue-500/10 text-[#2d7ff9]' },
  completed:     { label: 'Terminée',           cls: 'bg-green-500/10 text-green-500' },
  cancelled:     { label: 'Annulée',            cls: 'bg-slate-400/10 text-slate-400' },
}

const FILTERS: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente d’appel', value: 'awaiting_call' },
  { label: 'Planifiées', value: 'scheduled' },
  { label: 'Terminées', value: 'completed' },
  { label: 'Annulées', value: 'cancelled' },
]

function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = STATUS[status]
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${cfg.cls}`}>{cfg.label}</span>
}

const clientName = (r: AgentRequest) => `${r.client.firstName} ${r.client.lastName}`.trim()
const formatPhone = (p: string) => p.replace(/(\d{2})(?=\d)/g, '$1 ')

/** « 2026-11-26 » → « Jeudi 26 nov. » (format affiché côté client). */
function dateLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const label = new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">{children}</p>
)

const inputCls = 'h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2d7ff9] focus:outline-none'

// ── Planification : date, heure, prix, artisan ────────────────────────────────
function ScheduleForm({ request, onSaved }: { request: AgentRequest; onSaved: () => Promise<void> }) {
  const [date, setDate] = useState('') // vide = garder la date actuelle
  const [time, setTime] = useState(request.time ?? '')
  const [price, setPrice] = useState(request.price != null ? String(request.price) : '')
  const [provider, setProvider] = useState(request.providerName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const hasDate = Boolean(date || request.date)
  const canSave = hasDate && /^\d{2}:\d{2}$/.test(time) && Number(price) > 0

  const save = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      await api(`/agent/requests/${request.id}`, {
        method: 'PATCH',
        json: {
          ...(date ? { date: dateLabel(date) } : {}),
          time,
          price: Number(price),
          providerName: provider.trim(),
          ...(request.status === 'awaiting_call' ? { status: 'scheduled' } : {}),
        },
      })
      await onSaved()
      setDate('')
      setSaved(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-[var(--text-secondary)]">Date</span>
          <input type="date" value={date} onChange={e => { setDate(e.target.value); setSaved(false) }} className={inputCls} />
          {request.date && !date && <span className="mt-1 block text-[10px] text-[var(--text-muted)]">Actuelle : {request.date}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-[var(--text-secondary)]">Heure</span>
          <input type="time" value={time} onChange={e => { setTime(e.target.value); setSaved(false) }} className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-[var(--text-secondary)]">Prix convenu (FCFA)</span>
        <input type="text" inputMode="numeric" value={price ? Number(price).toLocaleString('fr-FR') : ''}
          onChange={e => { setPrice(e.target.value.replace(/\D/g, '').slice(0, 9)); setSaved(false) }}
          placeholder="Ex : 25 000" className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-[var(--text-secondary)]">Artisan qui intervient (facultatif)</span>
        <input type="text" value={provider} onChange={e => { setProvider(e.target.value); setSaved(false) }}
          placeholder="Ex : Marc Ahossi" maxLength={80} className={inputCls} />
      </label>

      {error && <p className="text-[12px] text-red-400">{error}</p>}
      {saved && <p className="flex items-center gap-1 text-[12px] font-medium text-green-500"><CheckCircle size={13} /> Enregistré. Le client a été prévenu dans la conversation.</p>}

      <button onClick={save} disabled={!canSave || saving}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2d7ff9] text-[13px] font-bold text-white hover:bg-[#1a6ce8] disabled:opacity-40">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <CalendarClock size={15} />}
        {request.status === 'awaiting_call' ? 'Planifier l’intervention' : 'Enregistrer les modifications'}
      </button>
    </div>
  )
}

// ── Conversation de la demande ────────────────────────────────────────────────
function Conversation({ request, onSent }: { request: AgentRequest; onSent: () => Promise<void> }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    if (!text.trim()) return
    setSending(true); setError('')
    try {
      await api(`/agent/requests/${request.id}/messages`, { method: 'POST', json: { text: text.trim() } })
      setText('')
      await onSent()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="space-y-2">
        {request.messages.map(m => {
          const mine = m.sender === 'agent'
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${mine ? 'rounded-br-md bg-[#2d7ff9] text-white' : 'rounded-bl-md border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]'}`}>
                {m.voiceNote
                  ? <audio controls preload="none" src={m.voiceNote.url} className="h-9 w-[220px]" />
                  : <p className="whitespace-pre-wrap text-[13px] leading-snug">{m.text}</p>}
                <p className={`mt-0.5 text-right text-[10px] ${mine ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                  {mine ? 'Wekan' : 'Client'} · {m.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={2000}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Répondre au client…"
          className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2d7ff9] focus:outline-none" />
        <button onClick={send} disabled={!text.trim() || sending} aria-label="Envoyer"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2d7ff9] text-white disabled:opacity-40">
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
      {error && <p className="mt-1 text-[12px] text-red-400">{error}</p>}
    </div>
  )
}

// ── Fiche de la demande ───────────────────────────────────────────────────────
function RequestDetail({ request, onClose, onChanged }: {
  request: AgentRequest
  onClose: () => void
  onChanged: () => Promise<void>
}) {
  const [busy, setBusy] = useState<RequestStatus | null>(null)
  const [error, setError] = useState('')
  const paid = request.paidAmount ?? 0
  const remaining = request.price != null ? Math.max(0, request.price - paid) : 0

  const setStatus = async (status: RequestStatus, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return
    setBusy(status); setError('')
    try {
      await api(`/agent/requests/${request.id}`, { method: 'PATCH', json: { status } })
      await onChanged()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="w-[420px] flex-shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">#{request.ref} · {request.serviceName}</h3>
          <p className="text-[11px] text-[var(--text-muted)]">Créée {request.createdAt.toLowerCase()}</p>
        </div>
        <button onClick={onClose} aria-label="Fermer" className="w-7 h-7 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
          <X size={14} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <StatusBadge status={request.status} />

        {/* Client */}
        <div>
          <SectionTitle>Client</SectionTitle>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d7ff9]/10 text-[13px] font-bold text-[#2d7ff9]">
              {(request.client.firstName[0] ?? '?').toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">{clientName(request) || 'Client'}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">+229 {formatPhone(request.client.phone)}</p>
            </div>
            <a href={`tel:+229${request.client.phone}`}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-green-500 px-3 text-[12px] font-bold text-white hover:bg-green-600">
              <Phone size={14} /> Appeler
            </a>
          </div>
        </div>

        {/* Lieu */}
        <div>
          <SectionTitle>Lieu d’intervention</SectionTitle>
          {request.location ? (
            <a href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-[13px] font-medium text-[#2d7ff9] hover:underline">
              <MapPin size={14} /> {request.location.label} — ouvrir dans Google Maps
            </a>
          ) : <p className="text-[13px] italic text-[var(--text-muted)]">Non renseigné (à demander au client)</p>}
        </div>

        {/* Planification */}
        {request.status !== 'cancelled' && request.status !== 'completed' && (
          <div>
            <SectionTitle>Date, heure et prix</SectionTitle>
            <ScheduleForm key={request.id} request={request} onSaved={onChanged} />
          </div>
        )}

        {/* Paiements */}
        {request.price != null && (
          <div>
            <SectionTitle>Paiement</SectionTitle>
            <div className="space-y-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Prix convenu</span><span className="font-bold text-[var(--text-primary)]">{formatAmount(request.price)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Déjà payé</span><span className="font-bold text-green-500">{formatAmount(paid)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Reste</span><span className="font-bold text-[var(--text-primary)]">{formatAmount(remaining)}</span></div>
            </div>
          </div>
        )}

        {/* Conversation */}
        <div>
          <SectionTitle>Conversation</SectionTitle>
          <Conversation request={request} onSent={onChanged} />
        </div>

        {error && <p className="text-[12px] text-red-400">{error}</p>}
      </div>

      {/* Changement de statut */}
      <div className="p-4 border-t border-[var(--border)] flex gap-2">
        {request.status === 'scheduled' && (
          <button onClick={() => setStatus('completed', 'Marquer cette intervention comme terminée ?')} disabled={!!busy}
            className="flex-1 h-10 rounded-xl bg-green-500 text-white text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-green-600 disabled:opacity-50">
            {busy === 'completed' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Terminée
          </button>
        )}
        {(request.status === 'awaiting_call' || request.status === 'scheduled') && (
          <button onClick={() => setStatus('cancelled', 'Annuler cette demande ?')} disabled={!!busy}
            className="flex-1 h-10 rounded-xl border border-red-400/40 text-red-400 text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-red-400/10 disabled:opacity-50">
            {busy === 'cancelled' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Annuler
          </button>
        )}
        {(request.status === 'completed' || request.status === 'cancelled') && (
          <button onClick={() => setStatus(request.price != null && request.date ? 'scheduled' : 'awaiting_call')} disabled={!!busy}
            className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[var(--bg-surface)] disabled:opacity-50">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />} Rouvrir la demande
          </button>
        )}
      </div>
    </div>
  )
}

// ── Vue principale ────────────────────────────────────────────────────────────
export default function RequestsView({ onCountChange }: { onCountChange?: (awaiting: number) => void }) {
  const [requests, setRequests] = useState<AgentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const { requests } = await api<{ requests: AgentRequest[] }>('/agent/requests')
      setRequests(requests)
      setLoadError('')
      onCountChange?.(requests.filter(r => r.status === 'awaiting_call').length)
    } catch (err) {
      setLoadError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [onCountChange])

  // Chargement + actualisation régulière (nouvelles demandes, nouveaux messages)
  useEffect(() => {
    load()
    const iv = setInterval(load, 10000)
    return () => clearInterval(iv)
  }, [load])

  const selected = requests.find(r => r.id === selectedId) ?? null

  // Ouvrir une demande = messages du client lus
  useEffect(() => {
    if (!selected || selected.unread === 0) return
    api(`/agent/requests/${selected.id}/read`, { method: 'POST' })
      .then(() => setRequests(prev => prev.map(r => (r.id === selected.id ? { ...r, unread: 0 } : r))))
      .catch(() => {})
  }, [selected])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length }
    for (const r of requests) c[r.status] = (c[r.status] ?? 0) + 1
    return c
  }, [requests])

  const q = search.trim().toLowerCase()
  const filtered = requests.filter(r =>
    (filter === 'all' || r.status === filter) &&
    (!q || r.ref.toLowerCase().includes(q) || clientName(r).toLowerCase().includes(q) || r.client.phone.includes(q.replace(/\s/g, '')) || r.serviceName.toLowerCase().includes(q)),
  )

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre d'outils */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-9 flex-1 max-w-[280px]">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Référence, client, téléphone, service..."
              className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${filter === f.value ? 'bg-[#2d7ff9] text-white' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[#2d7ff9]/40'}`}>
                {f.label} <span className="opacity-70">{counts[f.value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[var(--text-muted)]" /></div>
          ) : loadError ? (
            <p className="py-16 text-center text-[13px] text-red-400">{loadError}</p>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-[var(--text-muted)]">Aucune demande.</p>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-[var(--bg-surface)] z-10">
                <tr>
                  {['Référence', 'Client', 'Service', 'Lieu', 'Rendez-vous', 'Prix', 'Statut', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)}
                    className={`border-b border-[var(--border)] cursor-pointer transition-colors ${selectedId === r.id ? 'bg-[#2d7ff9]/5' : 'hover:bg-[var(--bg-surface)]'}`}>
                    <td className="px-4 py-3 text-[12px] font-mono font-bold text-[#2d7ff9] whitespace-nowrap">{r.ref}<br /><span className="font-sans font-normal text-[11px] text-[var(--text-muted)]">{r.createdAt}</span></td>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-[var(--text-primary)] whitespace-nowrap">{clientName(r) || 'Client'}</p>
                      <p className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">{formatPhone(r.client.phone)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={r.serviceImage} alt="" className="h-7 w-7 rounded-lg object-cover" />
                        <span className="text-[13px] text-[var(--text-secondary)] whitespace-nowrap">{r.serviceName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{r.location?.label ?? <span className="italic text-[var(--text-muted)]">—</span>}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)] whitespace-nowrap">
                      {r.date ? <>{r.date}<br />{r.time}</> : <span className="italic text-[var(--text-muted)]">À fixer</span>}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)] whitespace-nowrap">
                      {r.price != null ? formatAmount(r.price) : <span className="text-[12px] font-normal italic text-[var(--text-muted)]">À fixer</span>}
                      {!!r.paidAmount && <p className="text-[11px] font-medium text-green-500">Payé {formatAmount(r.paidAmount)}</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2d7ff9] px-1.5 text-[11px] font-bold text-white" title="Nouveaux messages du client">
                          {r.unread}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && <RequestDetail request={selected} onClose={() => setSelectedId(null)} onChanged={load} />}
    </div>
  )
}
