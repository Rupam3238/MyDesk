export default function ModeBar({ currentMode, onModeChange }) {
  const modes = [
    { id: 'overview', label: 'Overview' },
    { id: 'deepwork', label: 'Deep Work' },
    { id: 'review', label: 'Review' },
    { id: 'plan', label: 'Plan' },
  ]

  return (
    <div className="modebar">
      {modes.map(mode => (
        <button
          key={mode.id}
          className={`m-btn ${currentMode === mode.id ? 'active' : ''}`}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
