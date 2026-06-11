import { useState, useEffect } from 'react'
import './App.css'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import ModeBar from './components/ModeBar'
import Dashboard from './components/Dashboard'
import TimerPage from './pages/TimerPage'

import { getAllNotes, createNote, deleteNote } from './api/notes'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [theme, setTheme] = useState('dark')
  const [mode, setMode] = useState('overview')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

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

  return (
    <BrowserRouter>
      <div className="app-container">
        <TopBar theme={theme} onToggleTheme={toggleTheme} />

        <div className="layout">
          <Sidebar />

          <main className="main">
            <Routes>

              {/* DASHBOARD */}
              <Route
                path="/"
                element={
                  <>
                    <ModeBar currentMode={mode} onModeChange={setMode} />
                    <Dashboard
                      mode={mode}
                      notes={notes}
                      onAddNote={addNote}
                      onDeleteNote={onDeleteNote}
                    />
                  </>
                }
              />

              {/* SESSION TIMER PAGE */}
              <Route
                path="/timer"
                element={<TimerPage />}
              />

            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App