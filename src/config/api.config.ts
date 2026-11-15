const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  ''

// In development, if VITE_DIRECT_API is not set to true, use relative path ""
// so Vite dev server proxy transparently routes /api to VITE_BACKEND_TARGET (default http://127.0.0.1:8000)
// avoiding any CORS issues. In production or when VITE_DIRECT_API=true, uses VITE_API_BASE_URL.
export const API_BASE_URL =
  import.meta.env.DEV && import.meta.env.VITE_DIRECT_API !== 'true'
    ? ''
    : rawBaseUrl.replace(/\/+$/, '')

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
  },
  SUPER_ADMIN: {
    DASHBOARD_STATS: '/api/v1/super-admin/dashboard/stats',
    PLANS: '/api/v1/super-admin/plans',
    PLAN_BY_ID: (id: string) => `/api/v1/super-admin/plans/${id}`,
    PLAN_STATUS: (id: string) => `/api/v1/super-admin/plans/${id}/status`,
    ACTIVITY_LOGS: '/api/v1/super-admin/activity-logs',
    ACTIVITY_STATS: '/api/v1/super-admin/activity-logs/stats',
    SALONS: '/api/v1/super-admin/salons',
    ASSIGN_PLAN: (salonId: string) => `/api/v1/super-admin/salons/${salonId}/assign-plan`,
  },
} as const
