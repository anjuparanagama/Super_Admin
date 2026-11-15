import { createContext } from 'react'
import type { LoginPayload, SuperAdminUser } from '../interface/auth.types.ts'

export interface AuthContextType {
  user: SuperAdminUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
