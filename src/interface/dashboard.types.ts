import type { ActivityLog } from './activity.types.ts'

export interface SuperAdminDashboardStats {
  total_salons: number
  active_salons: number
  total_users: number
  active_plans_count: number
  estimated_mrr: number
  total_activities_today: number
  total_visitors_today: number
  devices_breakdown: Record<string, number>
  top_plan_subscriptions: Record<string, number>
  recent_activities: ActivityLog[]
}
