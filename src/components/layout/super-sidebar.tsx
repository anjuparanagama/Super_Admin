import React from 'react'
import { Link, useLocation } from 'react-router'
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Store,
} from 'lucide-react'
import { useAuth } from '../../context/use-auth.ts'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pricing Plans', href: '/plans', icon: CreditCard },
  { name: 'Visitor & Activity Logs', href: '/activity-logs', icon: Activity },
  { name: 'Salons & Tenants', href: '/salons', icon: Store },
]

export const SuperSidebar: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Sribees <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-medium">HQ</span>
            </div>
            <div className="text-[11px] text-slate-400">Super Admin Panel</div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Management
          </div>
          {navigation.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30">
        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80 mb-2">
          <div className="text-xs font-semibold text-slate-200 truncate">{user?.email}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Super Administrator
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out HQ</span>
        </button>
      </div>
    </aside>
  )
}
