import { useEffect, useRef, useState } from "react"
import { SessionTimer, NotesPanel } from "../components/features"
import { getAllNotes, createNote, deleteNote } from '../api/notes'
import '../styles/TimerPage.css'

// Layout limits for the floating notes panel.
const BOUNDS = {
  minWidth: 280,
  maxWidth: 720,
  minHeight: 220,
  maxHeight: 820,
  margin: 16,
}

export default function TimerPage() {
  const initialHeight = Math.min(0.72 * window.innerHeight, 560)

  // Floating panel state.
  const [notesCollapsed, setNotesCollapsed] = useState(false)
  const [notesWidth, setNotesWidth] = useState(420)
  const [notesHeight, setNotesHeight] = useState(initialHeight)
  const [panelPos, setPanelPos] = useState({
    top: Math.round(Math.max(BOUNDS.margin, Math.min((window.innerHeight - initialHeight) / 2, window.innerHeight - initialHeight - BOUNDS.margin))),
    right: 20,
  })

  // Notes content state.
  const [notes, setNotes] = useState([])

  // Interaction flags used for styling and cursor state.
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  // Refs hold the latest state during mousemove callbacks.
  const panelPosRef = useRef(panelPos)
  const widthRef = useRef(notesWidth)
  const heightRef = useRef(notesHeight)
  const collapsedRef = useRef(notesCollapsed)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)
  const pendingRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    panelPosRef.current = panelPos
  }, [panelPos])

  useEffect(() => {
    widthRef.current = notesWidth
  }, [notesWidth])

  useEffect(() => {
    heightRef.current = notesHeight
  }, [notesHeight])

  useEffect(() => {
    collapsedRef.current = notesCollapsed
  }, [notesCollapsed])

  // Ensure panel top/right stay inside the viewport.
  const clampPanel = (top, right, width, height) => {
    const maxTop = window.innerHeight - height - BOUNDS.margin
    const maxRight = window.innerWidth - width - BOUNDS.margin

    return {
      top: Math.round(Math.min(Math.max(top, BOUNDS.margin), Math.max(maxTop, BOUNDS.margin))),
      right: Math.round(Math.min(Math.max(right, BOUNDS.margin), Math.max(maxRight, BOUNDS.margin))),
    }
  }

  // Batch DOM updates during drag/resize to avoid too many React renders.
  const scheduleUpdate = (update) => {
    pendingRef.current = { ...pendingRef.current, ...update }
    if (rafRef.current) return

    rafRef.current = window.requestAnimationFrame(() => {
      const next = pendingRef.current || {}
      pendingRef.current = null
      rafRef.current = null

      if (next.panelPos) setPanelPos(next.panelPos)
      if (next.notesWidth !== undefined) setNotesWidth(next.notesWidth)
      if (next.notesHeight !== undefined) setNotesHeight(next.notesHeight)
    })
  }

  // Begin dragging the panel by tracking the starting pointer position.
  const startDragging = (event) => {
    if (event.button !== 0) return
    event.preventDefault()

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startTop: panelPosRef.current.top,
      startRight: panelPosRef.current.right,
    }

    setIsDragging(true)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }

  // Begin resizing the panel along the left edge or bottom-left corner.
  const startResizing = (mode) => (event) => {
    if (event.button !== 0) return
    event.preventDefault()

    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: widthRef.current,
      startHeight: heightRef.current,
      mode,
    }

    setIsResizing(true)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = mode === 'both' ? 'nwse-resize' : 'ew-resize'
  }

  // Reset dragging/resizing state and restore cursor styles.
  const stopInteraction = () => {
    dragRef.current = null
    resizeRef.current = null
    setIsDragging(false)
    setIsResizing(false)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }

  // Global mousemove listener for drag and resize operations.
  useEffect(() => {
    const onMouseMove = (event) => {
      if (dragRef.current) {
        const deltaX = event.clientX - dragRef.current.startX
        const deltaY = event.clientY - dragRef.current.startY
        const width = collapsedRef.current ? 96 : widthRef.current
        const height = collapsedRef.current ? 52 : heightRef.current
        const nextPos = clampPanel(dragRef.current.startTop + deltaY, dragRef.current.startRight - deltaX, width, height)
        scheduleUpdate({ panelPos: nextPos })
      }

      if (resizeRef.current) {
        const deltaX = resizeRef.current.startX - event.clientX
        const nextWidth = Math.min(BOUNDS.maxWidth, Math.max(BOUNDS.minWidth, resizeRef.current.startWidth + deltaX))
        let nextHeight = resizeRef.current.startHeight

        if (resizeRef.current.mode === 'both') {
          const deltaY = event.clientY - resizeRef.current.startY
          nextHeight = Math.min(BOUNDS.maxHeight, Math.max(BOUNDS.minHeight, resizeRef.current.startHeight + deltaY))
        }

        scheduleUpdate({ notesWidth: nextWidth, notesHeight: nextHeight })
      }
    }

    const onMouseUp = () => {
      if (dragRef.current || resizeRef.current) {
        stopInteraction()
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseleave', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseleave', onMouseUp)
    }
  }, [])

  const toggleCollapse = () => {
    setNotesCollapsed((prev) => !prev)
  }

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

      <div
        className={`notes-sidebar ${notesCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{
          width: notesCollapsed ? 96 : notesWidth,
          height: notesCollapsed ? 52 : notesHeight,
          top: `${panelPos.top}px`,
          right: `${panelPos.right}px`,
        }}
      >
        <div className="notes-header" onMouseDown={startDragging} title="Drag to move">
          <span className="notes-header-label">Notes</span>
          <button
            className="notes-toggle-btn"
            onClick={(event) => {
              event.stopPropagation()
              toggleCollapse()
            }}
            onMouseDown={(event) => event.stopPropagation()}
            title={notesCollapsed ? 'Expand notes' : 'Collapse notes'}
          >
            <i className={`ti ${notesCollapsed ? 'ti-plus' : 'ti-minus'}`} />
          </button>
        </div>

        <div className="notes-panel-content">
          <NotesPanel notes={notes} onAddNote={addNote} onDeleteNote={onDeleteNote} />
        </div>

        <div className="notes-resizer" onMouseDown={startResizing('width')} title="Drag to resize width" />
        <div className="notes-corner-resizer" onMouseDown={startResizing('both')} title="Drag corner to resize width and height" />
      </div>
    </div>
  )
}