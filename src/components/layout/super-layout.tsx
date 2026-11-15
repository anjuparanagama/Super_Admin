import React from 'react'
import { Outlet } from 'react-router'
import { SuperHeader } from './super-header.tsx'
import { SuperSidebar } from './super-sidebar.tsx'

export const SuperLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <SuperSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SuperHeader />
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
