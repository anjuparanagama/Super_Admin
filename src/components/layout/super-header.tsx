import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Bell, Globe, Sparkles } from 'lucide-react'

export const SuperHeader: React.FC = () => {
  const location = useLocation()
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const getPageTitle = () => {
    if (location.pathname === '/') return 'HQ Executive Dashboard'
    if (location.pathname.startsWith('/plans')) return 'SaaS Pricing & Plan Management'
    if (location.pathname.startsWith('/activity-logs')) return 'Visitor & Activity Analytics'
    if (location.pathname.startsWith('/salons')) return 'Salons & Tenant Directory'
    return 'Super Admin Console'
  }

  return (
    <header className="h-16 px-8 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-white tracking-tight">{getPageTitle()}</h1>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Company Only
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{timeStr}</span>
        </div>

        {/* Operational Status */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Platform Live</span>
        </div>

        <button
          title="Notifications"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
