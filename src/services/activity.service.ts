import { apiClient } from './api.ts'
import type {
  ActivityFilterParams,
  ActivityLog,
  ActivityLogListResponse,
  ActivityStatsResponse,
} from '../interface/activity.types.ts'

export const activityService = {
  async getActivityLogs(params: ActivityFilterParams = {}): Promise<ActivityLogListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)
    if (params.action) searchParams.set('action', params.action)
    if (params.category) searchParams.set('category', params.category)
    if (params.device_type) searchParams.set('device_type', params.device_type)
    if (params.user_email) searchParams.set('user_email', params.user_email)
    if (params.salon_id) searchParams.set('salon_id', params.salon_id)
    if (params.from_date) searchParams.set('from_date', params.from_date)
    if (params.to_date) searchParams.set('to_date', params.to_date)

    const qs = searchParams.toString()
    return apiClient<ActivityLogListResponse>(`/api/v1/super-admin/activity-logs${qs ? `?${qs}` : ''}`)
  },

  async getActivityStats(): Promise<ActivityStatsResponse> {
    return apiClient<ActivityStatsResponse>('/api/v1/super-admin/activity-logs/stats')
  },

  exportToCsv(logs: ActivityLog[]): void {
    if (!logs.length) return

    const headers = [
      'Timestamp',
      'Action',
      'Category',
      'Description',
      'User Email',
      'Role',
      'Salon Name',
      'Device Type',
      'OS',
      'Browser',
      'IP Address',
      'Location',
      'Path',
      'Method',
      'Status Code',
    ]

    const rows = logs.map((log) => [
      new Date(log.created_at).toLocaleString(),
      log.action,
      log.category,
      `"${(log.description || '').replace(/"/g, '""')}"`,
      log.user_email || 'Anonymous',
      log.user_role || 'Visitor',
      log.salon_name || '-',
      log.device_type || 'Unknown',
      log.os || 'Unknown',
      log.browser || 'Unknown',
      log.ip_address || '-',
      `"${[log.city, log.country].filter(Boolean).join(', ') || 'Unknown'}"`,
      log.path || '-',
      log.method || '-',
      log.status_code || '-',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
}
