'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'
import { RequestStatus, TransactionType, TransactionStatus, ProviderStatus } from '@/types/admin'

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  growth?: number
  icon: ReactNode
  iconBg: string
  highlight?: boolean
}

export function StatCard({ label, value, sub, growth, icon, iconBg, highlight }: StatCardProps) {
  const isPositive = growth !== undefined && growth >= 0
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      highlight
        ? 'bg-[#2d7ff9] border-[#2d7ff9] text-white'
        : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[#2d7ff9]/40'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-white/20' : iconBg}`}>
          {icon}
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${
            highlight ? 'bg-white/20 text-white' : isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-400/10 text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <p className={`text-[24px] font-bold leading-none mb-1 ${highlight ? 'text-white' : 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
      <p className={`text-[12px] font-medium ${highlight ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>{label}</p>
      {sub && <p className={`text-[11px] mt-0.5 ${highlight ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>{sub}</p>}
    </div>
  )
}

// ─── Request Status Badge ─────────────────────────────────────────────────────

const REQ_STATUS: Record<RequestStatus, { label: string; cls: string }> = {
  pending:     { label: 'En attente',     cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  validated:   { label: 'Validée',        cls: 'bg-blue-500/10 text-[#2d7ff9]' },
  assigned:    { label: 'Assignée',       cls: 'bg-purple-500/10 text-purple-500' },
  in_progress: { label: 'En cours',       cls: 'bg-orange-500/10 text-orange-500' },
  completed:   { label: 'Terminée',       cls: 'bg-green-500/10 text-green-500' },
  cancelled:   { label: 'Annulée',        cls: 'bg-slate-400/10 text-slate-400' },
  disputed:    { label: 'Litige',         cls: 'bg-red-500/10 text-red-400' },
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const cfg = REQ_STATUS[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ─── Provider Status Badge ────────────────────────────────────────────────────

const PROV_STATUS: Record<ProviderStatus, { label: string; cls: string }> = {
  active:               { label: 'Actif',               cls: 'bg-green-500/10 text-green-500' },
  pending_verification: { label: 'En vérification',     cls: 'bg-yellow-500/10 text-yellow-500' },
  suspended:            { label: 'Suspendu',            cls: 'bg-red-400/10 text-red-400' },
  inactive:             { label: 'Inactif',             cls: 'bg-slate-400/10 text-slate-400' },
}

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const cfg = PROV_STATUS[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ─── Transaction Type Badge ───────────────────────────────────────────────────

const TXN_TYPE: Record<TransactionType, { label: string; cls: string }> = {
  deposit:    { label: 'Acompte',    cls: 'bg-blue-500/10 text-[#2d7ff9]' },
  payment:    { label: 'Paiement',   cls: 'bg-green-500/10 text-green-500' },
  payout:     { label: 'Virement',   cls: 'bg-purple-500/10 text-purple-500' },
  refund:     { label: 'Remboursement', cls: 'bg-orange-500/10 text-orange-500' },
  commission: { label: 'Commission', cls: 'bg-slate-400/10 text-slate-500' },
}

const TXN_STATUS: Record<TransactionStatus, { label: string; cls: string }> = {
  success:  { label: 'Succès',  cls: 'bg-green-500/10 text-green-500' },
  pending:  { label: 'En cours', cls: 'bg-yellow-500/10 text-yellow-500' },
  failed:   { label: 'Échoué', cls: 'bg-red-400/10 text-red-400' },
  refunded: { label: 'Remboursé', cls: 'bg-orange-500/10 text-orange-500' },
}

export function TxnTypeBadge({ type }: { type: TransactionType }) {
  const cfg = TXN_TYPE[type]
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.cls}`}>{cfg.label}</span>
}

export function TxnStatusBadge({ status }: { status: TransactionStatus }) {
  const cfg = TXN_STATUS[status]
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.cls}`}>{cfg.label}</span>
}

// ─── Amount formatter ─────────────────────────────────────────────────────────

export function formatAmount(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

// ─── Payment method label ─────────────────────────────────────────────────────

export function PaymentMethodBadge({ method }: { method: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    orange_money: { label: 'Orange Money', color: 'bg-orange-500/10 text-orange-500' },
    wave:         { label: 'Wave',         color: 'bg-blue-400/10 text-blue-400' },
    card:         { label: 'Carte',        color: 'bg-slate-400/10 text-slate-500' },
    cash:         { label: 'Espèces',      color: 'bg-green-500/10 text-green-500' },
  }
  const cfg = labels[method] ?? { label: method, color: 'bg-slate-400/10 text-slate-500' }
  return <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.color}`}>{cfg.label}</span>
}
