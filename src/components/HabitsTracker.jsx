export default function HabitsTracker() {
  const habits = [
    { id: 1, name: 'Study session', icon: 'ti-book', color: 'purple', streak: '11d', days: [true, true, true, true, true, true, false] },
    { id: 2, name: 'Exercise', icon: 'ti-run', color: 'green', streak: '5d', days: [true, false, true, true, true, true, false] },
    { id: 3, name: 'Journal', icon: 'ti-pencil', color: 'amber', streak: '3d', days: [true, true, false, false, true, true, false] },
    { id: 4, name: 'Drink water', icon: 'ti-droplet', color: 'blue', streak: '7d', days: [true, true, true, true, true, true, false] },
    { id: 5, name: 'Sleep by 11pm', icon: 'ti-moon', color: 'purple-muted', streak: '2d', days: [false, true, false, true, true, false, false] },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ti ti-checklist"></i>Habits</div>
        <div className="btn-row">
          <button className="btn btn-ghost"><i className="ti ti-plus"></i> Add</button>
          <span style={{ fontSize: '10px', color: 'var(--text3)' }}>this week</span>
        </div>
      </div>
      {habits.map(habit => (
        <div key={habit.id} className="h-row">
          <i className={`ti ${habit.icon}`} style={{ fontSize: '14px', color: `var(--${habit.color})` }}></i>
          <div className="h-name">{habit.name}</div>
          <div className="h-strk">{habit.streak}</div>
          <div className="h-dots">
            {habit.days.map((completed, i) => (
              <div
                key={i}
                className={`hd ${completed ? 'y' : i === habit.days.length - 1 ? 't' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
