export interface SuperAdminUser {
  id: string
  email: string
  salon_id: string
  role: string
  is_superuser: boolean
  salon_name?: string | null
}

export interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
  user_id: string
  salon_id: string
  role: string
  is_superuser: boolean
  salon_name?: string | null
}

export interface LoginPayload {
  email: string
  password: string
}
