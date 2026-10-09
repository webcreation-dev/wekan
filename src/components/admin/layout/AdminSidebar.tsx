'use client'

import { LayoutDashboard, ClipboardList, Users, Briefcase, DollarSign, Settings, Wrench, LogOut, Bell } from 'lucide-react'
import { AdminView } from '@/types/admin'

interface AdminSidebarProps {
  active: AdminView
  onNavigate: (v: AdminView) => void
  onLogout: () => void
  role: 'superadmin' | 'admin'
}

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'requests',   label: 'Demandes',         icon: ClipboardList,  badge: 23 },
  { id: 'providers',  label: 'Prestataires',     icon: Briefcase },
  { id: 'clients',    label: 'Clients',          icon: Users },
  { id: 'finance',    label: 'Finance',          icon: DollarSign },
  { id: 'services',   label: 'Catalogue',        icon: Wrench },
  { id: 'admins',     label: 'Administrateurs',  icon: Users,          superonly: true },
  { id: 'settings',   label: 'Paramètres',       icon: Settings },
] as const

export default function AdminSidebar({ active, onNavigate, onLogout, role }: AdminSidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-full bg-[#0d1b2a] border-r border-[#1e3a52]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1e3a52]">
           <img src="/favicon.png" alt="Wekan" style={{ height: 50,filter: 'brightness(0) invert(1)' }} />

        <div>
          <p className="text-white font-bold text-[15px] leading-none">Wekan</p>
          <p className="text-[#6b8cad] text-[10px] font-medium tracking-wider uppercase mt-0.5">
            {role === 'superadmin' ? 'Super Admin' : 'Admin'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.filter(item => !('superonly' in item) || !item.superonly || role === 'superadmin').map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button key={item.id} onClick={() => onNavigate(item.id as AdminView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive ? 'bg-[#2d7ff9] text-white' : 'text-[#6b8cad] hover:bg-[#1e3a52] hover:text-white'
              }`}>
              <Icon size={17} className="flex-shrink-0" />
              <span className="text-[13px] font-medium flex-1 text-left">{item.label}</span>
              {'badge' in item && item.badge && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-[#1e3a52] pt-3">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={17} />
          <span className="text-[13px] font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
