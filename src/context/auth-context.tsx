import React, { useState } from 'react'
import type { LoginPayload, SuperAdminUser } from '../interface/auth.types.ts'
import { authService } from '../services/auth.service.ts'
import { AuthContext } from './auth-context-def.ts'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SuperAdminUser | null>(() => {
    const stored = authService.getUser()
    return stored && stored.is_superuser ? stored : null
  })
  const [token, setToken] = useState<string | null>(() => {
    const storedUser = authService.getUser()
    const storedToken = authService.getToken()
    return storedUser?.is_superuser && storedToken ? storedToken : null
  })
  const [isLoading] = useState<boolean>(false)

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload)
    const newUser: SuperAdminUser = {
      id: res.user_id,
      email: payload.email,
      salon_id: res.salon_id,
      role: res.role,
      is_superuser: res.is_superuser,
      salon_name: res.salon_name,
    }
    setUser(newUser)
    setToken(res.access_token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    authService.logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user?.is_superuser),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
