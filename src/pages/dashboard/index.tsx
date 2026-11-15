import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Activity,
  ArrowRight,
  CreditCard,
  Laptop,
  Layers,
  MapPin,
  RefreshCw,
  Smartphone,
  Store,
  Tablet,
  Users,
} from 'lucide-react'
import { StatCard } from '../../components/ui/stat-card.tsx'
import type { SuperAdminDashboardStats } from '../../interface/dashboard.types.ts'
import { dashboardService } from '../../services/dashboard.service.ts'

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState<number>(0)

  useEffect(() => {
    let active = true
    dashboardService
      .getDashboardStats()
      .then((data) => {
        if (active) {
          setStats(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRefresh = () => {
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  const formatCurrency = (val: number) => {
    return `LKR ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getDeviceIcon = (deviceType?: string | null) => {
    if (deviceType === 'Mobile') return <Smartphone className="w-3.5 h-3.5 text-sky-400" />
    if (deviceType === 'Tablet') return <Tablet className="w-3.5 h-3.5 text-amber-400" />
    return <Laptop className="w-3.5 h-3.5 text-indigo-400" />
  }

  if (loading && !stats) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
        <span className="text-xs font-mono">Aggregating platform intelligence...</span>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex flex-col gap-3">
        <div className="font-semibold text-sm">Failed to load Dashboard data</div>
        <div className="text-xs">{error}</div>
        <button
          onClick={handleRefresh}
          className="self-start px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  const desktopCount = stats?.devices_breakdown?.Desktop || 0
  const mobileCount = stats?.devices_breakdown?.Mobile || 0
  const tabletCount = stats?.devices_breakdown?.Tablet || 0
  const totalDevices = desktopCount + mobileCount + tabletCount || 1

  const desktopPct = Math.round((desktopCount / totalDevices) * 100)
  const mobilePct = Math.round((mobileCount / totalDevices) * 100)
  const tabletPct = Math.round((tabletCount / totalDevices) * 100)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Headquarters Overview</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant monitoring, SaaS revenue tracking, and visitor intelligence across all salon shops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/plans"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Manage Plans</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Salons / Tenants"
          value={stats?.total_salons || 0}
          subtitle={`${stats?.active_salons || 0} active subscriptions`}
          trend="+100%"
          trendPositive={true}
          icon={Store}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />

        <StatCard
          title="Estimated Monthly Run Rate (MRR)"
          value={formatCurrency(stats?.estimated_mrr || 0)}
          subtitle="Recurring platform subscription"
          trend="Target LKR 500k"
          icon={CreditCard}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />

        <StatCard
          title="Unique Visitors Today"
          value={stats?.total_visitors_today || 0}
          subtitle={`${stats?.total_activities_today || 0} platform activities`}
          trend="Live tracking"
          icon={Users}
          iconColor="text-sky-400 bg-sky-500/10 border-sky-500/20"
        />

        <StatCard
          title="Active Pricing Tiers"
          value={stats?.active_plans_count || 0}
          subtitle="Published SaaS tiers"
          trend="Fully managed"
          icon={Layers}
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Analytics Grid: Device Breakdown & Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device & Browser Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Visitor Device Distribution</h3>
              <span className="text-[11px] text-slate-400 font-mono">Real-time</span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-indigo-400" /> Desktop
                  </span>
                  <span className="font-mono text-slate-400">
                    {desktopCount} ({desktopPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${desktopPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" /> Mobile Phones
                  </span>
                  <span className="font-mono text-slate-400">
                    {mobileCount} ({mobilePct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${mobilePct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Tablet className="w-3.5 h-3.5 text-amber-400" /> Tablets & iPads
                  </span>
                  <span className="font-mono text-slate-400">
                    {tabletCount} ({tabletPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${tabletPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              to="/activity-logs"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Explore detailed visitor audit logs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Plan Adoption Overview */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Pricing Plan Subscriptions</h3>
              <span className="text-[11px] text-slate-400 font-mono">Active tenants</span>
            </div>

            <div className="mt-6 space-y-3">
              {stats?.top_plan_subscriptions && Object.keys(stats.top_plan_subscriptions).length > 0 ? (
                Object.entries(stats.top_plan_subscriptions).map(([planName, count]) => (
                  <div
                    key={planName}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-xs font-semibold text-slate-200">{planName}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {count} salon{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active subscriptions assigned yet. Assign plans under Salons Directory.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              to="/salons"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Assign plans to registered salons</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick System Health */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">System Infrastructure</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="mt-6 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-semibold text-slate-200">PostgreSQL (Multi-tenant)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Security Gate</span>
                <span className="font-semibold text-emerald-400">Superuser RBAC Active</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Activity Auditing</span>
                <span className="font-semibold text-indigo-400">IP & Device Tracking Live</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 text-center">
              All administrative modifications require authorized Super Admin session.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Live Activity Stream (Recent 10 Events)</h3>
          </div>
          <Link
            to="/activity-logs"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all logs →
          </Link>
        </div>

        {stats?.recent_activities && stats.recent_activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/60 pb-2">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">User / Visitor</th>
                  <th className="pb-3 font-semibold">Device</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {stats.recent_activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-mono text-slate-400">
                      {new Date(act.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-slate-800 text-slate-200 border border-slate-700/60">
                        {act.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">
                      <div>{act.user_email || 'Anonymous Visitor'}</div>
                      {act.user_role && (
                        <span className="text-[10px] text-slate-400 capitalize">{act.user_role}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {getDeviceIcon(act.device_type)}
                        <span>{act.device_type || 'Desktop'}</span>
                        <span className="text-[10px] text-slate-400">({act.browser || 'Unknown'})</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{[act.city, act.country].filter(Boolean).join(', ') || 'Localhost'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs truncate" title={act.description || ''}>
                      {act.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">No recent activity logs recorded yet.</div>
        )}
      </div>
    </div>
  )
}
