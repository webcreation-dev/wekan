'use client'

import { useState } from 'react'
import { Search, Filter, CheckCircle, UserPlus, X, Eye, MessageSquare, ChevronDown } from 'lucide-react'
import { RequestStatusBadge, formatAmount, PaymentMethodBadge } from '@/components/admin/ui/AdminUI'
import { MOCK_REQUESTS, MOCK_ADMIN_PROVIDERS } from '@/data/admin/mock'
import { ServiceRequest, RequestStatus } from '@/types/admin'

const STATUS_FILTERS: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'pending' },
  { label: 'Validées', value: 'validated' },
  { label: 'Assignées', value: 'assigned' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Terminées', value: 'completed' },
  { label: 'Litiges', value: 'disputed' },
]

// Modal: assign provider
function AssignModal({ request, onClose, onAssign }: {
  request: ServiceRequest
  onClose: () => void
  onAssign: (providerId: string, name: string) => void
}) {
  const [selectedId, setSelectedId] = useState('')
  const available = MOCK_ADMIN_PROVIDERS.filter(p =>
    p.status === 'active' &&
    (p.specialities.some(s => s.toLowerCase().includes(request.serviceId.replace('_', ' ').toLowerCase()))
      || true) // show all for demo
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[520px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Assigner un prestataire</h2>
            <p className="text-[12px] text-[var(--text-muted)]">{request.reference} · {request.serviceType}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
            <X size={16} className="text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
          {available.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                selectedId === p.id ? 'border-[#2d7ff9] bg-[#2d7ff9]/10' : 'border-[var(--border)] hover:border-[#2d7ff9]/40'
              }`}
            >
              <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold text-[var(--text-primary)]">{p.name}</p>
                  {p.verified && <span className="w-4 h-4 rounded-full bg-[#2d7ff9] flex items-center justify-center"><span className="text-white text-[8px] font-bold">✓</span></span>}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{p.specialities.join(', ')} · {p.zone}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-yellow-400">★ {p.rating}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{p.completedJobs} missions</span>
                  {p.activeJobs > 0 && <span className="text-[11px] text-orange-400">{p.activeJobs} active</span>}
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${selectedId === p.id ? 'border-[#2d7ff9] bg-[#2d7ff9]' : 'border-[var(--text-muted)]'}`}>
                {selectedId === p.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]">Annuler</button>
          <button
            onClick={() => {
              const p = available.find(p => p.id === selectedId)
              if (p) onAssign(p.id, p.name)
            }}
            disabled={!selectedId}
            className="flex-1 h-10 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold disabled:opacity-40 hover:bg-[#1a6ce8] transition-colors"
          >
            Confirmer l&apos;assignation
          </button>
        </div>
      </div>
    </div>
  )
}

// Detail panel
function RequestDetail({ request, onClose, onValidate, onAssign }: {
  request: ServiceRequest
  onClose: () => void
  onValidate: () => void
  onAssign: () => void
}) {
  return (
    <div className="w-[360px] flex-shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{request.reference}</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-[var(--bg-surface)] flex items-center justify-center">
          <X size={14} className="text-[var(--text-secondary)]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Status */}
        <div className="flex items-center gap-2">
          <RequestStatusBadge status={request.status} />
          {request.notes && (
            <span className="text-[11px] text-red-400 bg-red-400/10 px-2 py-1 rounded-lg">⚠ Note</span>
          )}
        </div>

        {/* Client */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">Client</p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <img src={request.clientAvatar} alt={request.clientName} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="text-[13px] font-bold text-[var(--text-primary)]">{request.clientName}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{request.clientPhone}</p>
            </div>
          </div>
        </div>

        {/* Service info */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">Détails du service</p>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Service</span><span className="font-semibold text-[var(--text-primary)]">{request.serviceType}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Date</span><span className="font-semibold text-[var(--text-primary)]">{request.scheduledDate} {request.scheduledTime}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Zone</span><span className="font-semibold text-[var(--text-primary)]">{request.zone}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Adresse</span><span className="font-semibold text-[var(--text-primary)] text-right max-w-[180px] leading-tight">{request.address}</span></div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">Description</p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border)]">{request.description}</p>
        </div>

        {/* Payment */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">Paiement</p>
          <div className="space-y-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <div className="flex justify-between text-[13px]">
              <span className="text-[var(--text-secondary)]">Estimation</span>
              <span className="font-bold text-[var(--text-primary)]">{formatAmount(request.estimatedAmount)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[var(--text-secondary)]">Acompte versé</span>
              <span className="font-bold text-green-500">{formatAmount(request.depositPaid)}</span>
            </div>
            <div className="flex justify-between text-[13px] items-center">
              <span className="text-[var(--text-secondary)]">Via</span>
              <PaymentMethodBadge method={request.depositMethod.toLowerCase().replace(' ', '_')} />
            </div>
          </div>
        </div>

        {/* Assigned provider */}
        {request.assignedProviderName && (
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase mb-2">Prestataire assigné</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
              {request.assignedProviderAvatar && (
                <img src={request.assignedProviderAvatar} alt={request.assignedProviderName} className="w-9 h-9 rounded-full object-cover" />
              )}
              <p className="text-[13px] font-bold text-[var(--text-primary)]">{request.assignedProviderName}</p>
            </div>
          </div>
        )}

        {request.notes && (
          <div>
            <p className="text-[10px] font-bold tracking-wider text-red-400 uppercase mb-2">Note interne</p>
            <p className="text-[12px] text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 leading-relaxed">{request.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        {request.status === 'pending' && (
          <button onClick={onValidate} className="w-full h-10 rounded-xl bg-[#2d7ff9] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#1a6ce8]">
            <CheckCircle size={15} /> Valider la demande
          </button>
        )}
        {(request.status === 'validated' || request.status === 'pending') && (
          <button onClick={onAssign} className="w-full h-10 rounded-xl border border-[#2d7ff9] text-[#2d7ff9] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#2d7ff9]/10">
            <UserPlus size={15} /> Assigner un prestataire
          </button>
        )}
        <button className="w-full h-10 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--bg-surface)]">
          <MessageSquare size={15} /> Contacter le client
        </button>
      </div>
    </div>
  )
}

export default function RequestsView() {
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS)
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ServiceRequest | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const filtered = requests.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter
    const matchSearch = !search ||
      r.reference.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleValidate = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'validated' as RequestStatus } : r))
    setSelected(prev => prev?.id === id ? { ...prev, status: 'validated' as RequestStatus } : prev)
  }

  const handleAssign = (providerId: string, providerName: string) => {
    setRequests(prev => prev.map(r =>
      r.id === selected?.id
        ? { ...r, status: 'assigned' as RequestStatus, assignedProviderId: providerId, assignedProviderName: providerName }
        : r
    ))
    setSelected(prev => prev ? { ...prev, status: 'assigned', assignedProviderId: providerId, assignedProviderName: providerName } : prev)
    setShowAssignModal(false)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-9 flex-1 max-w-[280px]">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Référence, client, service..." className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${filter === f.value ? 'bg-[#2d7ff9] text-white' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[#2d7ff9]/40'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[12px] text-[var(--text-muted)]">{filtered.length} résultat(s)</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[var(--bg-surface)] z-10">
              <tr>
                {['Référence', 'Client', 'Service', 'Adresse / Zone', 'Planifié', 'Acompte', 'Prestataire', 'Statut', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`border-b border-[var(--border)] cursor-pointer transition-colors ${selected?.id === r.id ? 'bg-[#2d7ff9]/5' : 'hover:bg-[var(--bg-surface)]'}`}
                >
                  <td className="px-4 py-3 text-[12px] font-mono font-bold text-[#2d7ff9]">{r.reference}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={r.clientAvatar} alt={r.clientName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-[var(--text-primary)] whitespace-nowrap">{r.clientName}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{r.clientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">{r.serviceType}</td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] text-[var(--text-secondary)]">{r.zone}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)] whitespace-nowrap">{r.scheduledDate}<br />{r.scheduledTime}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)] whitespace-nowrap">{formatAmount(r.depositPaid)}</td>
                  <td className="px-4 py-3">
                    {r.assignedProviderName
                      ? <div className="flex items-center gap-1.5"><img src={r.assignedProviderAvatar} alt="" className="w-6 h-6 rounded-full object-cover" /><span className="text-[12px] text-[var(--text-secondary)]">{r.assignedProviderName}</span></div>
                      : <span className="text-[11px] text-[var(--text-muted)] italic">Non assigné</span>
                    }
                  </td>
                  <td className="px-4 py-3"><RequestStatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setSelected(r) }} className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                      <Eye size={14} className="text-[var(--text-muted)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <RequestDetail
          request={selected}
          onClose={() => setSelected(null)}
          onValidate={() => handleValidate(selected.id)}
          onAssign={() => setShowAssignModal(true)}
        />
      )}

      {/* Assign modal */}
      {showAssignModal && selected && (
        <AssignModal
          request={selected}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
    </div>
  )
}
