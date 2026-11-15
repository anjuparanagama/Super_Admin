import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from '../components/layout/protected-route.tsx'
import { SuperLayout } from '../components/layout/super-layout.tsx'
import { ActivityLogsPage } from '../pages/activity-logs/index.tsx'
import { DashboardPage } from '../pages/dashboard/index.tsx'
import { LoginPage } from '../pages/login/index.tsx'
import { PlansPage } from '../pages/plans/index.tsx'
import { SalonsPage } from '../pages/salons/index.tsx'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Superuser Protected HQ Console */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SuperLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
          <Route path="salons" element={<SalonsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
