const BASE_URL = ''

export interface ApiErrorResponse {
  detail?: string | { msg?: string }[]
  message?: string
}

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('sribees_super_token')

  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred'
    try {
      const errData = (await response.json()) as ApiErrorResponse
      if (typeof errData.detail === 'string') {
        errorDetail = errData.detail
      } else if (Array.isArray(errData.detail) && errData.detail[0]?.msg) {
        errorDetail = errData.detail[0].msg
      } else if (errData.message) {
        errorDetail = errData.message
      }
    } catch {
      errorDetail = `Server error ${response.status}: ${response.statusText}`
    }

    if (response.status === 401) {
      localStorage.removeItem('sribees_super_token')
      localStorage.removeItem('sribees_super_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    throw new ApiError(response.status, errorDetail)
  }

  // If response is 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}
