import { apiClient } from './api.ts'
import { API_ENDPOINTS } from '../config/api.config.ts'
import type { SuperAdminDashboardStats } from '../interface/dashboard.types.ts'

export const dashboardService = {
  async getDashboardStats(): Promise<SuperAdminDashboardStats> {
    return apiClient<SuperAdminDashboardStats>(API_ENDPOINTS.SUPER_ADMIN.DASHBOARD_STATS)
  },
}
