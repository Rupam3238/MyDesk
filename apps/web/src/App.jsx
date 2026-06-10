import { useState, useEffect } from 'react'
import './App.css'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import ModeBar from './components/ModeBar'
import Dashboard from './components/Dashboard'

function App() {
  const [theme, setTheme] = useState('dark')
  const [mode, setMode] = useState('overview')
  const [notes, setNotes] = useState([
    { id: 1, text: 'useCallback memoizes a function so it doesn\'t re-create on every render — use when passing to child components.', tags: ['React', 'hooks'], color: 'purple' },
    { id: 2, text: 'Build ugly first. Ship it. Refactor later. Stop redesigning the folder structure.', tags: ['mindset'], color: 'green' },
    { id: 3, text: 'SQLite stores data in a single file on disk — perfect for local projects. No server needed.', tags: ['backend', 'db'], color: 'amber' },
  ])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const addNote = (text) => {
    if (!text.trim()) return
    setNotes([...notes, {
      id: Date.now(),
      text: text.trim(),
      tags: [],
      color: 'purple'
    }])
  }

  return (
    <div className="app-container">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <ModeBar currentMode={mode} onModeChange={setMode} />
          <Dashboard mode={mode} notes={notes} onAddNote={addNote} />
        </main>
      </div>
    </div>
  )
}

export default App