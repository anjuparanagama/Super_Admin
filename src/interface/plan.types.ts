export interface PricingPlan {
  id: string
  name: string
  code: string
  description?: string | null
  price_monthly: number
  price_yearly: number
  currency: string
  max_branches: number
  max_staff: number
  max_services: number
  features: string[]
  is_active: boolean
  is_popular: boolean
  subscriber_count: number
  created_at: string
  updated_at?: string | null
}

export interface PricingPlanCreatePayload {
  name: string
  code: string
  description?: string
  price_monthly: number
  price_yearly: number
  currency?: string
  max_branches: number
  max_staff: number
  max_services: number
  features: string[]
  is_active?: boolean
  is_popular?: boolean
}

export interface PricingPlanUpdatePayload {
  name?: string
  code?: string
  description?: string
  price_monthly?: number
  price_yearly?: number
  currency?: string
  max_branches?: number
  max_staff?: number
  max_services?: number
  features?: string[]
  is_active?: boolean
  is_popular?: boolean
}
