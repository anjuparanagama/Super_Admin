import { apiClient } from './api.ts'
import type {
  PricingPlan,
  PricingPlanCreatePayload,
  PricingPlanUpdatePayload,
} from '../interface/plan.types.ts'

export const plansService = {
  async getPlans(activeOnly = false): Promise<PricingPlan[]> {
    const query = activeOnly ? '?active_only=true' : ''
    return apiClient<PricingPlan[]>(`/api/v1/super-admin/plans${query}`)
  },

  async getPlanById(planId: string): Promise<PricingPlan> {
    return apiClient<PricingPlan>(`/api/v1/super-admin/plans/${planId}`)
  },

  async createPlan(payload: PricingPlanCreatePayload): Promise<PricingPlan> {
    return apiClient<PricingPlan>('/api/v1/super-admin/plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updatePlan(planId: string, payload: PricingPlanUpdatePayload): Promise<PricingPlan> {
    return apiClient<PricingPlan>(`/api/v1/super-admin/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async togglePlanStatus(
    planId: string,
    status: { is_active?: boolean; is_popular?: boolean }
  ): Promise<PricingPlan> {
    return apiClient<PricingPlan>(`/api/v1/super-admin/plans/${planId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    })
  },

  async deletePlan(planId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/api/v1/super-admin/plans/${planId}`, {
      method: 'DELETE',
    })
  },
}
