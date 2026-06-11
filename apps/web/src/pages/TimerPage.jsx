import { useEffect, useState } from "react"
import { SessionTimer, NotesPanel } from "../components/features"
import FloatingPanel from "../components/layout/FloatingPanel"
import { getAllNotes, createNote, deleteNote } from '../api'
import '../styles/TimerPage.css'

export default function TimerPage() {
  const [notes, setNotes] = useState([])

  // Create a new note and append it to local state.
  const addNote = async (text, category = null) => {
    if (!text.trim()) return

    try {
      const newNote = await createNote({
        content: text.trim(),
        tags: [],
        color: 'purple',
        category
      })

      setNotes(prev => [newNote, ...prev])
    } catch (err) {
      console.error('Failed to create note', err)
    }
  }

  // Delete a note from the backend and update the local list.
  const onDeleteNote = async (id) => {
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

  // Load existing notes once when the timer page mounts.
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllNotes()
        setNotes(data)
      } catch (err) {
        console.error('Failed to load notes', err)
      }
    }

    load()
  }, [])

  return (
    <div className="timer-page-layout">
      <div className="timer-container">
        <SessionTimer />
      </div>

      <FloatingPanel>
        <NotesPanel notes={notes} onAddNote={addNote} onDeleteNote={onDeleteNote} />
      </FloatingPanel>
    </div>
  )
}