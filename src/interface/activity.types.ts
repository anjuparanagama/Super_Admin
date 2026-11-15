export interface ActivityLog {
  id: string
  user_id?: string | null
  user_email?: string | null
  user_role?: string | null
  salon_id?: string | null
  salon_name?: string | null
  action: string
  category: string
  description?: string | null
  ip_address?: string | null
  city?: string | null
  country?: string | null
  user_agent?: string | null
  browser?: string | null
  os?: string | null
  device_type?: string | null
  path?: string | null
  method?: string | null
  status_code?: number | null
  metadata_json?: Record<string, unknown> | null
  created_at: string
}

export interface ActivityLogListResponse {
  items: ActivityLog[]
  total: int_or_num
  page: int_or_num
  limit: int_or_num
  total_pages: int_or_num
}

type int_or_num = number

export interface ActivityStatsDevice {
  device: string
  count: number
  percentage: number
}

export interface ActivityStatsItem {
  key: string
  count: number
}

export interface ActivityStatsResponse {
  total_logs: number
  unique_visitors: number
  desktop_count: number
  mobile_count: number
  tablet_count: number
  devices: ActivityStatsDevice[]
  top_actions: ActivityStatsItem[]
  top_locations: ActivityStatsItem[]
  top_browsers: ActivityStatsItem[]
}

export interface ActivityFilterParams {
  page?: number
  limit?: number
  search?: string
  action?: string
  category?: string
  device_type?: string
  user_email?: string
  salon_id?: string
  from_date?: string
  to_date?: string
}
