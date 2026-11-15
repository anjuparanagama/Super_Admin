import { apiClient } from './api.ts'
import type { SuperAdminDashboardStats } from '../interface/dashboard.types.ts'

export const dashboardService = {
  async getDashboardStats(): Promise<SuperAdminDashboardStats> {
    return apiClient<SuperAdminDashboardStats>('/api/v1/super-admin/dashboard/stats')
  },
}
