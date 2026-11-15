import { apiClient } from './api.ts'
import { API_ENDPOINTS } from '../config/api.config.ts'
import type { LoginPayload, LoginResponse, SuperAdminUser } from '../interface/auth.types.ts'

const TOKEN_KEY = 'sribees_super_token'
const USER_KEY = 'sribees_super_user'

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (!res.is_superuser) {
      throw new Error('Access denied: Your account is not configured as a Super Administrator.')
    }

    localStorage.setItem(TOKEN_KEY, res.access_token)
    const user: SuperAdminUser = {
      id: res.user_id,
      email: payload.email,
      salon_id: res.salon_id,
      role: res.role,
      is_superuser: res.is_superuser,
      salon_name: res.salon_name,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return res
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    window.location.href = '/login'
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser(): SuperAdminUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as SuperAdminUser
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    return Boolean(token && user && user.is_superuser)
  },
}
