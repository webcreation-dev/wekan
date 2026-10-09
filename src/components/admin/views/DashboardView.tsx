'use client'

import { Users, Briefcase, ClipboardList, DollarSign, Star, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { StatCard, formatAmount } from '@/components/admin/ui/AdminUI'
import { MOCK_DASHBOARD_STATS, MOCK_REVENUE_DATA, MOCK_SERVICE_DIST, MOCK_REQUESTS } from '@/data/admin/mock'
import { RequestStatusBadge } from '@/components/admin/ui/AdminUI'
import { AdminView } from '@/types/admin'

interface DashboardViewProps {
  onNavigate: (v: AdminView) => void
}

// Simple bar chart using divs
function RevenueChart() {
  const maxRevenue = Math.max(...MOCK_REVENUE_DATA.map(d => d.revenue))
  const last7 = MOCK_REVENUE_DATA.slice(-7)
  return (
    <div className="h-[160px] flex items-end gap-2 px-2">
      {last7.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-t-lg bg-[#2d7ff9]/80 hover:bg-[#2d7ff9] transition-colors cursor-default"
              style={{ height: `${Math.round((d.revenue / maxRevenue) * 130)}px` }}
              title={`${d.date}: ${formatAmount(d.revenue)}`}
            />
          </div>
          <p className="text-[9px] text-[var(--text-muted)] whitespace-nowrap">{d.date.split(' ')[0]}</p>
        </div>
      ))}
    </div>
  )
}

// Donut-like distribution
function ServiceDistribution() {
  const total = MOCK_SERVICE_DIST.reduce((s, d) => s + d.count, 0)
  return (
    <div className="space-y-2.5">
      {MOCK_SERVICE_DIST.slice(0, 6).map(s => (
        <div key={s.serviceId} className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[12px] font-medium text-[var(--text-primary)]">{s.serviceName}</span>
              <span className="text-[11px] text-[var(--text-muted)]">{s.count} • {s.percentage}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const s = MOCK_DASHBOARD_STATS
  const recentRequests = MOCK_REQUESTS.slice(0, 5)

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Revenu du mois"
          value={`${(s.revenueMonth / 1_000_000).toFixed(1)}M FCFA`}
          sub={`Aujourd'hui : ${formatAmount(s.revenueToday)}`}
          growth={s.revenueGrowth}
          icon={<DollarSign size={18} color="#2d7ff9" />}
          iconBg="bg-[#2d7ff9]/10"
          highlight
        />
        <StatCard
          label="Demandes totales"
          value={s.totalRequests.toLocaleString()}
          sub={`${s.pendingRequests} en attente`}
          growth={s.requestsGrowth}
          icon={<ClipboardList size={18} className="text-purple-500" />}
          iconBg="bg-purple-500/10"
        />
        <StatCard
          label="Prestataires actifs"
          value={`${s.activeProviders} / ${s.totalProviders}`}
          sub={`${s.activeRequests} missions en cours`}
          icon={<Briefcase size={18} className="text-orange-500" />}
          iconBg="bg-orange-500/10"
        />
        <StatCard
          label="Clients"
          value={s.totalClients.toLocaleString()}
          sub={`+${s.newClientsToday} aujourd'hui`}
          icon={<Users size={18} className="text-green-500" />}
          iconBg="bg-green-500/10"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Terminées aujourd'hui"
          value={s.completedToday}
          icon={<CheckCircle size={18} className="text-green-500" />}
          iconBg="bg-green-500/10"
        />
        <StatCard
          label="Note moyenne"
          value={s.averageRating}
          icon={<Star size={18} className="text-yellow-400" />}
          iconBg="bg-yellow-400/10"
        />
        <StatCard
          label="Taux satisfaction"
          value={`${s.satisfactionRate}%`}
          icon={<TrendingUp size={18} className="text-[#2d7ff9]" />}
          iconBg="bg-[#2d7ff9]/10"
        />
        <StatCard
          label="En attente"
          value={s.pendingRequests}
          sub="À valider"
          icon={<AlertCircle size={18} className="text-yellow-500" />}
          iconBg="bg-yellow-500/10"
        />
      </div>

      {/* Charts + recent requests */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="col-span-2 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Revenus — 7 derniers jours</h3>
              <p className="text-[12px] text-[var(--text-muted)]">Montants en FCFA</p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#2d7ff9]" />
              <span className="text-[var(--text-secondary)]">Revenu</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Service distribution */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">Répartition Services</h3>
          <p className="text-[12px] text-[var(--text-muted)] mb-4">Par nombre de demandes</p>
          <ServiceDistribution />
        </div>
      </div>

      {/* Recent requests */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Demandes récentes</h3>
          <button
            onClick={() => onNavigate('requests')}
            className="text-[12px] font-semibold text-[#2d7ff9] hover:underline"
          >
            Voir tout →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Référence', 'Client', 'Service', 'Zone', 'Date', 'Acompte', 'Statut'].map(h => (
                <th key={h} className="text-left pb-2.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentRequests.map(r => (
              <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)] transition-colors">
                <td className="py-3 pr-4 text-[13px] font-mono font-bold text-[#2d7ff9]">{r.reference}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <img src={r.clientAvatar} alt={r.clientName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{r.clientName}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-[13px] text-[var(--text-secondary)]">{r.serviceType}</td>
                <td className="py-3 pr-4 text-[13px] text-[var(--text-secondary)]">{r.zone}</td>
                <td className="py-3 pr-4 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">{r.scheduledDate} {r.scheduledTime}</td>
                <td className="py-3 pr-4 text-[13px] font-semibold text-[var(--text-primary)]">{formatAmount(r.depositPaid)}</td>
                <td className="py-3"><RequestStatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
