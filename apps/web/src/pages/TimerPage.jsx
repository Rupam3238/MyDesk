import SessionTimer from "../components/SessionTimer"
import NotesPanel from "../components/NotesPanel"

export default function TimerPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Timer</h2>

      <SessionTimer />

      <div style={{ marginTop: "20px" }}>
        <NotesPanel />
      </div>
    </div>
  )
}