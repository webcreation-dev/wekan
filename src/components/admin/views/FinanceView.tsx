'use client'

import { useState } from 'react'
import { Search, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { TxnTypeBadge, TxnStatusBadge, PaymentMethodBadge, StatCard, formatAmount } from '@/components/admin/ui/AdminUI'
import { MOCK_TRANSACTIONS, MOCK_FINANCE_STATS, MOCK_REVENUE_DATA } from '@/data/admin/mock'
import { TransactionType } from '@/types/admin'

const TYPE_FILTERS: { label: string; value: TransactionType | 'all' }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Acomptes', value: 'deposit' },
  { label: 'Paiements', value: 'payment' },
  { label: 'Virements', value: 'payout' },
  { label: 'Commissions', value: 'commission' },
  { label: 'Remboursements', value: 'refund' },
]

function MiniBarChart() {
  const max = Math.max(...MOCK_REVENUE_DATA.map(d => d.revenue))
  return (
    <div className="h-[80px] flex items-end gap-1">
      {MOCK_REVENUE_DATA.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
          <div className="w-full rounded-t-sm bg-[#2d7ff9]/60 hover:bg-[#2d7ff9] transition-colors"
            style={{ height: `${Math.round((d.revenue / max) * 70)}px` }}
            title={`${d.date}: ${formatAmount(d.revenue)}`} />
        </div>
      ))}
    </div>
  )
}

export default function FinanceView() {
  const [filter, setFilter] = useState<TransactionType | 'all'>('all')
  const [search, setSearch] = useState('')
  const s = MOCK_FINANCE_STATS

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchType = filter === 'all' || t.type === filter
    const matchSearch = !search ||
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.serviceType.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Revenu du mois"
          value={`${(s.totalRevenue / 1_000_000).toFixed(2)}M FCFA`}
          growth={s.revenueGrowth}
          icon={<DollarSign size={18} color="#2d7ff9" />}
          iconBg="bg-[#2d7ff9]/10"
          highlight
        />
        <StatCard
          label="Commission HomeFix (15%)"
          value={`${(s.totalCommission / 1_000_000).toFixed(2)}M FCFA`}
          growth={s.commissionGrowth}
          icon={<TrendingUp size={18} className="text-green-500" />}
          iconBg="bg-green-500/10"
        />
        <StatCard
          label="Virements en attente"
          value={formatAmount(s.pendingPayouts)}
          sub="Prestataires à payer"
          icon={<AlertTriangle size={18} className="text-orange-500" />}
          iconBg="bg-orange-500/10"
        />
        <StatCard
          label="Panier moyen"
          value={formatAmount(s.averageOrderValue)}
          sub={`${s.completedTransactions} transactions`}
          icon={<ArrowUpRight size={18} className="text-purple-500" />}
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Revenue chart */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Revenus — 14 derniers jours</h3>
            <p className="text-[12px] text-[var(--text-muted)]">Toutes transactions confondues</p>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-bold text-[#2d7ff9]">{formatAmount(MOCK_REVENUE_DATA.reduce((s, d) => s + d.revenue, 0))}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Total période</p>
          </div>
        </div>
        <MiniBarChart />
        <div className="flex justify-between mt-1">
          {MOCK_REVENUE_DATA.filter((_, i) => i % 2 === 0).map(d => (
            <span key={d.date} className="text-[9px] text-[var(--text-muted)]">{d.date}</span>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Transactions</h3>
          <div className="flex items-center gap-1.5 ml-2">
            {TYPE_FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${filter === f.value ? 'bg-[#2d7ff9] text-white' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 h-8 w-[200px]">
            <Search size={13} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher..." className="flex-1 bg-transparent text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--bg-surface)]">
              {['Référence', 'Type', 'Client / Pro', 'Service', 'Mode', 'Montant', 'Date', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors">
                <td className="px-4 py-3 text-[11px] font-mono font-bold text-[#2d7ff9]">{t.reference}</td>
                <td className="px-4 py-3"><TxnTypeBadge type={t.type} /></td>
                <td className="px-4 py-3">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">{t.clientName}</p>
                  {t.providerName && <p className="text-[11px] text-[var(--text-muted)]">→ {t.providerName}</p>}
                </td>
                <td className="px-4 py-3 text-[12px] text-[var(--text-secondary)]">{t.serviceType}</td>
                <td className="px-4 py-3"><PaymentMethodBadge method={t.method} /></td>
                <td className="px-4 py-3">
                  <span className={`text-[13px] font-bold ${
                    t.type === 'payout' || t.type === 'refund' ? 'text-red-400' : 'text-green-500'
                  }`}>
                    {t.type === 'payout' || t.type === 'refund' ? '−' : '+'}{formatAmount(t.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                  {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}<br />
                  {new Date(t.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3"><TxnStatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
