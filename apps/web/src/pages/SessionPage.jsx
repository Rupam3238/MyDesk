import SessionTimer from '../components/SessionTimer'
import NotesPanel from '../components/NotesPanel'

export default function SessionPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Focus Session</h2>

      <SessionTimer />

      <div style={{ marginTop: 20 }}>
        <NotesPanel />
      </div>
    </div>
  )
}