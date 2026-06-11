import { useState, useEffect } from "react"
import SessionTimer from "../components/SessionTimer"
import NotesPanel from "../components/NotesPanel"
import { getAllNotes, createNote, deleteNote } from '../api/notes'
import './TimerPage.css'

export default function TimerPage() {
  const [notesCollapsed, setNotesCollapsed] = useState(false)
  const [notesWidth, setNotesWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [notes, setNotes] = useState([])

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

  const onDeleteNote = async (id) => {
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

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

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing) return
      const newWidth = Math.max(260, window.innerWidth - e.clientX - 40)
      setNotesWidth(newWidth)
    }

    const onMouseUp = () => setIsResizing(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isResizing])

  return (
    <div className="timer-page-layout">
      <div className="timer-container">
        <SessionTimer />
      </div>

      <div
        className={`notes-sidebar ${notesCollapsed ? 'collapsed' : ''}`}
        style={{ width: notesCollapsed ? 0 : notesWidth }}
      >
        <div
          className="notes-resizer"
          onMouseDown={(e) => {
            e.preventDefault()
            setIsResizing(true)
          }}
          onDoubleClick={() => setNotesWidth(400)}
          title="Drag to resize (double-click to reset)"
        />

        <NotesPanel 
          notes={notes}
          onAddNote={addNote}
          onDeleteNote={onDeleteNote}
        />
      </div>

      <button 
        className="notes-toggle-btn"
        onClick={() => setNotesCollapsed(prev => !prev)}
        title={notesCollapsed ? "Open notes" : "Close notes"}
      >
        <i className={`ti ${notesCollapsed ? 'ti-plus' : 'ti-x'}`}></i>
      </button>
    </div>
  )
}