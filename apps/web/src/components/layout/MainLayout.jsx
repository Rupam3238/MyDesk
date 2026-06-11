import React from 'react'
import { TopBar, Sidebar } from './index'

export default function MainLayout({ children }) {
  return (
    <div className="app-root">
      <TopBar />
      <div className="layout">
        <Sidebar />
        <main className="main" style={{ padding: 16 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
