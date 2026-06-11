export default function TopBar({ theme, onToggleTheme }) {
  const now = new Date()
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateStr = `${dayOfWeek}, ${now.getDate()} ${months[now.getMonth()]}`

  const hour = now.getHours()
  const greeting = hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening'

  return (
    <div className="topbar">
      <div className="logo">
        <div className="logo-dot"></div>
        <span className="logo-text">MYDESK</span>
        <span className="greeting">— {greeting}, Dev</span>
      </div>
      <div className="topbar-right">
        <div className="pill">
          <div className="pill-dot"></div>
          <span>Focus mode on</span>
        </div>
        <div className="divider"></div>
        <span className="topdate">{dateStr}</span>
        <button className="theme-btn" onClick={onToggleTheme} title="Toggle light/dark">
          <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`}></i>
        </button>
        <div className="avatar">DV</div>
      </div>
    </div>
  )
}