import { useState, useEffect } from "react"

export default function FloatingPanel({ children }) {
  const [notesCollapsed, setNotesCollapsed] = useState(false)

  const toggleCollapse = () => {
    setNotesCollapsed((prev) => !prev)
  }

  return (
    <div
      className={`notes-sidebar-fixed ${notesCollapsed ? 'collapsed' : ''}`}
    >
      <div className="notes-header-fixed" title="Notes panel">
        <i className="ti ti-chevron-down notes-dropdown-icon"></i>
        <span className="notes-header-label">Notes</span>
        <button
          className="notes-toggle-btn-fixed"
          onClick={toggleCollapse}
          title={notesCollapsed ? 'Expand notes' : 'Collapse notes'}
        >
          <i className={`ti ${notesCollapsed ? 'ti-plus' : 'ti-minus'}`} />
        </button>
      </div>

      <div className="notes-panel-content-fixed">
        {children}
      </div>
    </div>
  )
}