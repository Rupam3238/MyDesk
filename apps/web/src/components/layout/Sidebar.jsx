import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // Auto-collapse sidebar on Timer page, expand on all other pages
  useEffect(() => {
    if (location.pathname === '/timer') {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [location.pathname])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard', path: '/' },
    { id: 'timer', label: 'Timer', icon: 'ti-clock', badge: '', path: '/timer' },
    { id: 'notes', label: 'Notes', icon: 'ti-notes', badge: '', path: '/notes' },
    { id: 'habits', label: 'Habits', icon: 'ti-checklist', path: '/habits' },
  ]

  const toolItems = [
    { id: 'analytics', label: 'Analytics', icon: 'ti-chart-bar', path: '/analytics' },
    { id: 'launch', label: 'Quick Launch', icon: 'ti-rocket', path: '/launch' },
    { id: 'reminders', label: 'Reminders', icon: 'ti-bell', badgeAlert: true, badge: '', path: '/reminders' },
  ]

  const isActive = (path) => location.pathname === path

  const go = (path) => navigate(path)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">

        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px 4px'}}>
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <i className="ti ti-menu"></i>
          </button>
          <div className="s-label">workspace</div>
        </div>

        {navItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`n-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              go(item.path)
            }}
          >
            <i className={`ti ${item.icon}`}></i>
            <span className="n-label">{item.label}</span>

            {item.badge && (
              <span className={`n-badge ${item.badgeAlert ? 'alert' : ''}`}>
                {item.badge}
              </span>
            )}
          </a>
        ))}

        <div className="s-label">tools</div>

        {toolItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`n-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              go(item.path)
            }}
          >
            <i className={`ti ${item.icon}`}></i>
            <span className="n-label">{item.label}</span>

            {item.badge && (
              <span className={`n-badge ${item.badgeAlert ? 'alert' : ''}`}>
                {item.badge}
              </span>
            )}
          </a>
        ))}

        <div className="s-label">system</div>

        <a
          href="#"
          className={`n-item ${isActive('/settings') ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            go('/settings')
          }}
        >
          <i className="ti ti-settings"></i>
          <span className="n-label">Settings</span>
        </a>

      </nav>

      <div className="sidebar-footer">
        <div className="sf-label">today's focus</div>
        <div className="sf-topic">React fundamentals</div>
        <div className="pbar-bg">
          <div className="pbar-fill" style={{ width: '62%' }}></div>
        </div>
        <div className="sf-pct">62% of daily goal</div>
      </div>
    </aside>
  )
}