import React, { useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Globe,
  Laptop,
  MapPin,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  Users,
} from 'lucide-react'
import { Modal } from '../../components/ui/modal.tsx'
import type {
  ActivityLog,
  ActivityStatsResponse,
} from '../../interface/activity.types.ts'
import { activityService } from '../../services/activity.service.ts'

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<ActivityStatsResponse | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [deviceType, setDeviceType] = useState<string>('')
  const [reloadKey, setReloadKey] = useState<number>(0)

  // Metadata inspect modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    let active = true
    activityService
      .getActivityLogs({
        page,
        limit: 20,
        search: searchTerm.trim() || undefined,
        category: category || undefined,
        device_type: deviceType || undefined,
      })
      .then((res) => {
        if (active) {
          setLogs(res.items)
          setTotal(res.total)
          setTotalPages(res.total_pages)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch activity logs.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    activityService
      .getActivityStats()
      .then((st) => {
        if (active) setStats(st)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [page, category, deviceType, searchTerm, reloadKey])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setLoading(true)
    setSearchTerm(search)
  }

  const handleRefresh = () => {
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  const handleExportCsv = () => {
    activityService.exportToCsv(logs)
  }

  const handleInspect = (log: ActivityLog) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  const getDeviceIcon = (dev?: string | null) => {
    if (dev === 'Mobile') return <Smartphone className="w-4 h-4 text-sky-400" />
    if (dev === 'Tablet') return <Tablet className="w-4 h-4 text-amber-400" />
    return <Laptop className="w-4 h-4 text-indigo-400" />
  }

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'auth':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'billing':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'appointment':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20'
      case 'navigation':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'settings':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700/60'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Visitor & Activity Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of system visits, authenticated users, IP addresses, device types, and operating activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Snapshot Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Total Activity Logs</div>
              <div className="text-xl font-bold text-white mt-1">{stats.total_logs}</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Distinct Visitors (IP)</div>
              <div className="text-xl font-bold text-white mt-1">{stats.unique_visitors}</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Desktop Traffic</div>
              <div className="text-xl font-bold text-white mt-1">{stats.desktop_count}</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Laptop className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Mobile & Tablet</div>
              <div className="text-xl font-bold text-white mt-1">
                {stats.mobile_count + stats.tablet_count}
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, action, IP address, city, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="auth">Auth & Sessions</option>
              <option value="navigation">Navigation & Visits</option>
              <option value="billing">Billing & Checkout</option>
              <option value="appointment">Appointments</option>
              <option value="settings">General Settings</option>
              <option value="system">System Events</option>
            </select>
          </div>

          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Devices</option>
            <option value="Desktop">Desktop Only</option>
            <option value="Mobile">Mobile Only</option>
            <option value="Tablet">Tablet Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        {loading && logs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs font-mono">Fetching activity logs...</span>
          </div>
        ) : error && logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-rose-400">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No activity logs matched your search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Time & Date</th>
                  <th className="py-3.5 px-4">Visitor / User</th>
                  <th className="py-3.5 px-4">Action & Category</th>
                  <th className="py-3.5 px-4">Device & OS</th>
                  <th className="py-3.5 px-4">IP & Location</th>
                  <th className="py-3.5 px-4">Description / Target</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200">
                        {new Date(log.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(log.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* User / Visitor */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">
                        {log.user_email || <span className="text-slate-400 italic">Visitor</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono capitalize">
                          {log.user_role || 'Visitor'}
                        </span>
                        {log.salon_name && (
                          <span className="text-[10px] text-indigo-400 truncate max-w-[120px]">
                            {log.salon_name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-100 font-medium">
                        {log.action}
                      </div>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryBadgeClass(
                          log.category
                        )}`}
                      >
                        {log.category}
                      </span>
                    </td>

                    {/* Device & OS */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        {getDeviceIcon(log.device_type)}
                        <span>{log.device_type || 'Desktop'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {log.os || 'Unknown'} · {log.browser || 'Unknown'}
                      </div>
                    </td>

                    {/* IP & Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-300 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{log.ip_address || '127.0.0.1'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{[log.city, log.country].filter(Boolean).join(', ') || 'Localhost'}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-300 truncate" title={log.description || ''}>
                        {log.description || '-'}
                      </div>
                      {log.path && (
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          {log.method ? `${log.method} ` : ''}
                          {log.path}
                        </div>
                      )}
                    </td>

                    {/* Inspect button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleInspect(log)}
                        title="View Detailed Payload"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{logs.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> total logs (Page {page} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true)
                setPage((p) => Math.max(1, p - 1))
              }}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setLoading(true)
                setPage((p) => Math.min(totalPages, p + 1))
              }}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* INSPECT METADATA MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Event Inspection & Metadata"
        subtitle={`Log ID: ${selectedLog?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-400">Timestamp:</span>
                <div className="font-mono text-white mt-0.5">
                  {new Date(selectedLog.created_at).toISOString()}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Action:</span>
                <div className="font-mono text-indigo-400 mt-0.5 font-bold">
                  {selectedLog.action}
                </div>
              </div>
              <div>
                <span className="text-slate-400">User / Identity:</span>
                <div className="text-slate-200 mt-0.5">
                  {selectedLog.user_email || 'Anonymous Visitor'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">IP Address:</span>
                <div className="font-mono text-slate-200 mt-0.5">
                  {selectedLog.ip_address || '127.0.0.1'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Location:</span>
                <div className="text-slate-200 mt-0.5">
                  {[selectedLog.city, selectedLog.country].filter(Boolean).join(', ') || 'Localhost'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Device Hardware:</span>
                <div className="text-slate-200 mt-0.5">
                  {selectedLog.device_type} · {selectedLog.os} · {selectedLog.browser}
                </div>
              </div>
            </div>

            {selectedLog.user_agent && (
              <div>
                <span className="text-slate-400 block mb-1">Raw User Agent:</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                  {selectedLog.user_agent}
                </div>
              </div>
            )}

            {selectedLog.metadata_json && Object.keys(selectedLog.metadata_json).length > 0 && (
              <div>
                <span className="text-slate-400 block mb-1">Structured Metadata JSON:</span>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata_json, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
