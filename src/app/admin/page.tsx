'use client'

import { useState } from 'react'
import { AdminView } from '@/types/admin'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopbar from '@/components/admin/layout/AdminTopbar'
import AdminProfileModal from '@/components/admin/AdminProfileModal'
import DashboardView from '@/components/admin/views/DashboardView'
import RequestsView from '@/components/admin/views/RequestsView'
import ProvidersView from '@/components/admin/views/ProvidersView'
import ClientsView from '@/components/admin/views/ClientsView'
import FinanceView from '@/components/admin/views/FinanceView'
import AdminsView from '@/components/admin/views/AdminsView'
import { ServicesView, SettingsView } from '@/components/admin/views/OtherViews'

type Role = 'superadmin' | 'admin'

export default function AdminPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<AdminView>('dashboard')
  const [showProfile, setShowProfile] = useState(false)

  if (!role) return <AdminLogin onLogin={r => setRole(r)} />

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <AdminSidebar active={view} onNavigate={setView} onLogout={() => setRole(null)} role={role} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar view={view} role={role} onShowProfile={() => setShowProfile(true)} />

        <main className="flex-1 overflow-hidden">
          {view === 'dashboard'  && <div className="h-full overflow-y-auto"><DashboardView onNavigate={setView} /></div>}
          {view === 'requests'   && <RequestsView />}
          {view === 'providers'  && <ProvidersView />}
          {view === 'clients'    && <ClientsView />}
          {view === 'finance'    && <div className="h-full overflow-y-auto"><FinanceView /></div>}
          {view === 'services'   && <div className="h-full overflow-y-auto"><ServicesView /></div>}
          {view === 'admins'     && role === 'superadmin' && <div className="h-full overflow-y-auto"><AdminsView /></div>}
          {view === 'settings'   && <div className="h-full overflow-y-auto"><SettingsView /></div>}
        </main>
      </div>

      {showProfile && <AdminProfileModal role={role} onClose={() => setShowProfile(false)} />}
    </div>
  )
}
