import { apiClient } from './api.ts'
import { API_ENDPOINTS } from '../config/api.config.ts'
import type {
  PricingPlan,
  PricingPlanCreatePayload,
  PricingPlanUpdatePayload,
} from '../interface/plan.types.ts'

export const plansService = {
  async getPlans(activeOnly = false): Promise<PricingPlan[]> {
    const query = activeOnly ? '?active_only=true' : ''
    return apiClient<PricingPlan[]>(`${API_ENDPOINTS.SUPER_ADMIN.PLANS}${query}`)
  },

  async getPlanById(planId: string): Promise<PricingPlan> {
    return apiClient<PricingPlan>(API_ENDPOINTS.SUPER_ADMIN.PLAN_BY_ID(planId))
  },

  async createPlan(payload: PricingPlanCreatePayload): Promise<PricingPlan> {
    return apiClient<PricingPlan>(API_ENDPOINTS.SUPER_ADMIN.PLANS, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updatePlan(planId: string, payload: PricingPlanUpdatePayload): Promise<PricingPlan> {
    return apiClient<PricingPlan>(API_ENDPOINTS.SUPER_ADMIN.PLAN_BY_ID(planId), {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async togglePlanStatus(
    planId: string,
    status: { is_active?: boolean; is_popular?: boolean }
  ): Promise<PricingPlan> {
    return apiClient<PricingPlan>(API_ENDPOINTS.SUPER_ADMIN.PLAN_STATUS(planId), {
      method: 'PATCH',
      body: JSON.stringify(status),
    })
  },

  async deletePlan(planId: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(API_ENDPOINTS.SUPER_ADMIN.PLAN_BY_ID(planId), {
      method: 'DELETE',
    })
  },
}
