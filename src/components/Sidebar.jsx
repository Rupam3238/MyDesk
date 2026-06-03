import { useState } from 'react'

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
    { id: 'timer', label: 'Study Timer', icon: 'ti-clock', badge: '2h 14m' },
    { id: 'notes', label: 'Notes', icon: 'ti-notes', badge: '12' },
    { id: 'habits', label: 'Habits', icon: 'ti-checklist' },
  ]

  const toolItems = [
    { id: 'analytics', label: 'Analytics', icon: 'ti-chart-bar' },
    { id: 'launch', label: 'Quick Launch', icon: 'ti-rocket' },
    { id: 'reminders', label: 'Reminders', icon: 'ti-bell', badgeAlert: true, badge: '3' },
  ]

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="s-label">workspace</div>
        {navItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`n-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveNav(item.id)
            }}
          >
            <i className={`ti ${item.icon}`}></i>
            {item.label}
            {item.badge && <span className={`n-badge ${item.badgeAlert ? 'alert' : ''}`}>{item.badge}</span>}
          </a>
        ))}

        <div className="s-label">tools</div>
        {toolItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`n-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setActiveNav(item.id)
            }}
          >
            <i className={`ti ${item.icon}`}></i>
            {item.label}
            {item.badge && <span className={`n-badge ${item.badgeAlert ? 'alert' : ''}`}>{item.badge}</span>}
          </a>
        ))}

        <div className="s-label">system</div>
        <a href="#" className={`n-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={(e) => {
          e.preventDefault()
          setActiveNav('settings')
        }}>
          <i className="ti ti-settings"></i>Settings
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sf-label">today's focus</div>
        <div className="sf-topic">React fundamentals</div>
        <div className="pbar-bg"><div className="pbar-fill" style={{ width: '62%' }}></div></div>
        <div className="sf-pct">62% of daily goal</div>
      </div>
    </aside>
  )
}
