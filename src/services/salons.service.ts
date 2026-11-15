import { apiClient } from './api.ts'
import type { AssignPlanPayload, SuperAdminSalonListResponse } from '../interface/salon.types.ts'

export const salonsService = {
  async getSalons(search?: string): Promise<SuperAdminSalonListResponse> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    return apiClient<SuperAdminSalonListResponse>(`/api/v1/super-admin/salons${qs}`)
  },

  async assignSalonPlan(
    salonId: string,
    payload: AssignPlanPayload
  ): Promise<{ message: string; subscription_id: string; plan_name: string }> {
    return apiClient<{ message: string; subscription_id: string; plan_name: string }>(
      `/api/v1/super-admin/salons/${salonId}/assign-plan`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },
}
