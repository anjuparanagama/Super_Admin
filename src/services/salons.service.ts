import { apiClient } from './api.ts'
import { API_ENDPOINTS } from '../config/api.config.ts'
import type { AssignPlanPayload, SuperAdminSalonListResponse } from '../interface/salon.types.ts'

export const salonsService = {
  async getSalons(search?: string): Promise<SuperAdminSalonListResponse> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    return apiClient<SuperAdminSalonListResponse>(
      `${API_ENDPOINTS.SUPER_ADMIN.SALONS}${qs}`
    )
  },

  async assignSalonPlan(
    salonId: string,
    payload: AssignPlanPayload
  ): Promise<{ message: string; subscription_id: string; plan_name: string }> {
    return apiClient<{ message: string; subscription_id: string; plan_name: string }>(
      API_ENDPOINTS.SUPER_ADMIN.ASSIGN_PLAN(salonId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },
}
