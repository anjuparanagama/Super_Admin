import React from 'react'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/auth-context.tsx'
import { AppRoutes } from './routes/index.tsx'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
