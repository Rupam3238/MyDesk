export default function StatCard({ icon, label, value, subtext, isPositive }) {
  return (
    <div className="s-card">
      <div className="sc-label">
        <i className={`ti ${icon}`}></i>{label}
      </div>
      <div className="sc-val">{value}</div>
      <div className={`sc-sub ${isPositive ? 'up' : ''}`}>{subtext}</div>
    </div>
  )
}
