'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AdminView } from '@/types/admin'
import { api } from '@/lib/api-client'
import AdminLogin, { AgentUser } from '@/components/admin/AdminLogin'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopbar from '@/components/admin/layout/AdminTopbar'
import DashboardView from '@/components/admin/views/DashboardView'
import RequestsView from '@/components/admin/views/RequestsView'
import ProvidersView from '@/components/admin/views/ProvidersView'
import ClientsView from '@/components/admin/views/ClientsView'
import FinanceView from '@/components/admin/views/FinanceView'
import { ServicesView, SettingsView } from '@/components/admin/views/OtherViews'

// Espace agent : connexion par session (compte agent), demandes branchées sur /api/agent.
// Les autres vues (tableau de bord, prestataires, clients, finance…) affichent encore des données de démonstration.
export default function AdminPage() {
  const [agent, setAgent] = useState<AgentUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [view, setView] = useState<AdminView>('requests')
  const [awaiting, setAwaiting] = useState(0)

  // Session déjà ouverte ?
  useEffect(() => {
    api<{ user: AgentUser | null }>('/auth/me')
      .then(({ user }) => { if (user?.role === 'agent') setAgent(user) })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setAgent(null)
  }

  const onCountChange = useCallback((n: number) => setAwaiting(n), [])

  if (checking) {
    return <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]"><Loader2 className="animate-spin text-[var(--text-muted)]" /></div>
  }
  if (!agent) return <AdminLogin onLogin={setAgent} />

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <AdminSidebar active={view} onNavigate={setView} onLogout={logout} role="admin" requestsBadge={awaiting} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar view={view} role="admin" agentName={`${agent.firstName} ${agent.lastName}`.trim() || 'Agent'} />

        <main className="flex-1 overflow-hidden">
          {view === 'dashboard'  && <div className="h-full overflow-y-auto"><DashboardView onNavigate={setView} /></div>}
          {view === 'requests'   && <RequestsView onCountChange={onCountChange} />}
          {view === 'providers'  && <ProvidersView />}
          {view === 'clients'    && <ClientsView />}
          {view === 'finance'    && <div className="h-full overflow-y-auto"><FinanceView /></div>}
          {view === 'services'   && <div className="h-full overflow-y-auto"><ServicesView /></div>}
          {view === 'settings'   && <div className="h-full overflow-y-auto"><SettingsView /></div>}
        </main>
      </div>
    </div>
  )
}
