import StatCard from './StatCard'
import SessionTimer from './SessionTimer'
import NotesPanel from './NotesPanel'
import HabitsTracker from './HabitsTracker'
import Quick from './quick';

export default function Dashboard({ mode, notes, onAddNote }) {
  return (
    <div className="content">
      {/* Deep Work banner */}
      {mode === 'deepwork' && (
        <div className="mode-banner">
          <i className="ti ti-brain"></i>
          <div><strong>Deep Work mode active.</strong> Distractions hidden. Stay locked in.</div>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: '11px' }}>
            Exit
          </button>
        </div>
      )}

      {/* Stats */}
      <div>
        <div className="sec-label">today at a glance</div>
        <div className="stats">
          <StatCard icon="ti-clock" label="Study time" value="2h 14m" subtext="↑ 34m vs yesterday" isPositive={true} />
          <StatCard icon="ti-checklist" label="Habits done" value="4 / 6" subtext="2 remaining" />
          <StatCard icon="ti-flame" label="Streak" value="11 days" subtext="personal best" isPositive={true} />
          <StatCard icon="ti-notes" label="Notes" value="3 new" subtext="12 total this week" />
        </div>
      </div>

      {/* Heatmap (visible in overview only) */}
      {mode === 'overview' && (
        <div className="heatmap-card">
          <div className="heatmap-header">
            <div className="card-title"><i className="ti ti-chart-dots-3"></i>Activity heatmap</div>
            <div className="hm-legend">
              <span>Less</span>
              <div className="hm-legend-cells">
                {['#2a2a2f', '#0d3322', '#0f6e56', '#1D9E75', '#5DCAA5', '#9FE1CB'].map((color, i) => (
                  <div key={i} className="hm-legend-cell" style={{ background: color }}></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          <div style={{ padding: '20px', color: 'var(--text3)', fontSize: '12px' }}>
            Activity heatmap data coming soon...
          </div>
        </div>
      )}

      {/* Mid row: Timer + Notes */}
      <div className="mid-row">
        <SessionTimer />
        <NotesPanel notes={notes} onAddNote={onAddNote} />
      </div>
      
      {/* Bottom row: Habits */}
      <div className="bot-row">
          <Quick />
          <HabitsTracker />
      </div>
    </div>
  )
}
