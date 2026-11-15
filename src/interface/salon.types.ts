export interface SuperAdminSalon {
  id: string
  name: string
  slug?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  is_active: boolean
  created_at: string
  owner_name?: string | null
  owner_email?: string | null
  staff_count: number
  current_plan_name?: string | null
  current_plan_code?: string | null
  subscription_status?: string | null
  billing_cycle?: string | null
}

export interface SuperAdminSalonListResponse {
  items: SuperAdminSalon[]
  total: number
}

export interface AssignPlanPayload {
  plan_id: string
  billing_cycle: 'monthly' | 'yearly'
  status?: 'active' | 'past_due' | 'canceled' | 'trialing'
  auto_renew?: boolean
}
