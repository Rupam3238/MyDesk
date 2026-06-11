import React from 'react'
import { TopBar, Sidebar } from './index'

export default function MainLayout({ children }) {
  return (
    <div className="app-root">
      <TopBar />
      <div className="app-body" style={{ display: 'flex' }}>
        <aside style={{ width: 210 }}>
          <Sidebar />
        </aside>
        <main style={{ flex: 1, padding: 16 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
