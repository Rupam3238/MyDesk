import { useState, useEffect } from 'react'
import SessionModal from './SessionModal'
import './SessionTimer.css'
import { calculateElapsed } from '../utils/calculateElapsed'

export default function SessionTimer() {
  const [sessionData, setSessionData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [elapsedSecs, setElapsedSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [focusScore, setFocusScore] = useState(null)
  const [earlierSessions, setEarlierSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize: Check for active session or show modal
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Step 1: Fetch today's sessions to find active one
        const todayResponse = await fetch('http://localhost:5000/api/sessions/today')
        if (!todayResponse.ok) throw new Error('Failed to fetch sessions')

        const sessions = await todayResponse.json()
        const activeSession = sessions.find(s => s.status === 'active')

        if (activeSession) {
          // Step 2: Fetch the full session WITH EVENTS using the session ID
          const detailResponse = await fetch(`http://localhost:5000/api/sessions/${activeSession.id}`)
          if (!detailResponse.ok) throw new Error('Failed to fetch session details')

          const sessionWithEvents = await detailResponse.json()
          setSessionData(sessionWithEvents)

          // Step 3: Calculate elapsed time using events
          const elapsed = calculateElapsed(sessionWithEvents)
          setElapsedSecs(elapsed)

          // Step 4: Restore pause state from events
          const events = sessionWithEvents.events || []
          const lastEvent = events.at(-1)

          const wasPaused = lastEvent?.event_type === 'pause'
          const shouldBeRunning = lastEvent?.event_type === 'resume' || (!lastEvent)

          setIsPaused(wasPaused)
          setRunning(shouldBeRunning && !wasPaused)
        }
      } catch (err) {
        console.error('Error initializing session:', err)
        setShowModal(true)
      }
    }

    initializeSession()
    fetchEarlierSessions()
  }, [])

  // Fetch earlier today's sessions
  const fetchEarlierSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions/today')
      if (!response.ok) throw new Error('Failed to fetch sessions')

      const sessions = await response.json()
      // Filter to only completed sessions, exclude current active one
      const earlier = sessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))

      setEarlierSessions(earlier)
    } catch (err) {
      console.error('Error fetching earlier sessions:', err)
    }
  }

  // Handle new session creation from modal
  const handleSessionCreate = (newSession) => {
    setSessionData(newSession)
    setElapsedSecs(0)
    setShowModal(false)
    setRunning(true)
    setCompleted(false)
    setFocusScore(null)
    setError('')
  }

  // Timer interval
  useEffect(() => {
    if (!running || !sessionData || completed) return

    const interval = setInterval(() => {
      setElapsedSecs(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [running, sessionData, completed])

  // Handle pause/resume events
  const handlePauseResume = async () => {
    if (!sessionData) return

    setLoading(true)
    try {
      const eventType = running ? 'pause' : 'resume'

      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionData.id}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: eventType }),
        }
      )

      if (!response.ok) throw new Error(`Failed to ${eventType} session`)

      if (eventType === 'pause') {
        setRunning(false)
        setIsPaused(true)
      } else {
        setRunning(true)
        setIsPaused(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to update session')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle complete session
  const handleComplete = async () => {
    if (!sessionData) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionData.id}/complete`,
        { method: 'POST' }
      )

      if (!response.ok) throw new Error('Failed to complete session')

      const completedSession = await response.json()
      setSessionData(completedSession)
      setCompleted(true)
      setRunning(false)
      setFocusScore(completedSession.focus_score)
      fetchEarlierSessions()
    } catch (err) {
      setError(err.message || 'Failed to complete session')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle abandon session
  const handleAbandon = async () => {
    if (!sessionData) return

    const confirmed = window.confirm(
      'Are you sure? This session will be marked as abandoned with 0 focus score.'
    )

    if (!confirmed) return

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionData.id}/abandon`,
        { method: 'POST' }
      )

      if (!response.ok) throw new Error('Failed to abandon session')

      const abandonedSession = await response.json()
      setSessionData(abandonedSession)
      setCompleted(true)
      setRunning(false)
      setFocusScore(0)
      fetchEarlierSessions()
    } catch (err) {
      setError(err.message || 'Failed to abandon session')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle new session (reset to show modal)
  const handleNewSession = () => {
    setSessionData(null)
    setShowModal(true)
    setCompleted(false)
    setFocusScore(null)
    setElapsedSecs(0)
    setRunning(false)
    setIsPaused(false)
    setError('')
  }

  // Format time display
  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    const sec = secs % 60

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }

    return `${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  // Format duration for display
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Calculate progress
  const progress = sessionData
    ? Math.min(
        (elapsedSecs / sessionData.planned_duration) * 100,
        100
      )
    : 0

if (!sessionData) {
  return (
    <>
      <SessionModal
        isOpen={showModal}
        onSessionCreate={handleSessionCreate}
        onClose={() => setShowModal(false)}
      />

      <div className="card timer-card">
        <div className="card-header">
          <div className="card-title">
            <i className="ti ti-clock"></i>
            Sessions
          </div>
        </div>

        <div className="timer-wrap">
          <div className="timer-num">
            00:00
          </div>
          

          <div className="timer-controls">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="ti ti-player-play"></i>
              <span>Start Session</span>
            </button>
          </div>

          {earlierSessions.length > 0 && (
            <div className="slog">
              <div className="slog-label">earlier today</div>

              {earlierSessions.slice(0, 3).map(session => (
                <div key={session.id} className="s-row">
                  <div className="s-dot s-dot-g"></div>
                  <span>{session.topic}</span>
                  <div className="s-time">
                    {formatDuration(session.actual_duration)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

  // Session in progress or completed
return (
  <>
    <SessionModal
      isOpen={showModal}
      onSessionCreate={handleSessionCreate}
      onClose={() => setShowModal(false)}
    />
    <div className="card timer-card">
      <div className="card-header">
        <div className="card-title">
          <i className="ti ti-clock"></i>
          {sessionData?.category || 'Session'} Session
        </div>
      </div>

      <div className="timer-wrap">
        {/* Session Info */}
        <div className="session-header-row">

          {/* LEFT: committed time (loudest) */}
          <div className="header-left">
            <span className="badge badge-commit">
              ⌛ {formatDuration(sessionData.planned_duration)}
            </span>
          </div>

          {/* CENTER: topic (quiet) */}
          <div className="header-center">
            <div className="session-topic-quiet">
              {sessionData.topic}
            </div>
          </div>

          {/* RIGHT: goal (highlighted) */}
          <div className="header-right">
            {sessionData.goal && (
              <span className="badge badge-goal-soft">
                {sessionData.goal}
              </span>
            )}
          </div>

        </div>
        

        {/* Timer Display */}
        {!completed ? (
          <>
            <div className="timer-num">
              {formatTime(elapsedSecs)}
            </div>

            <div className="timer-pb-bg">
              <div
                className="timer-pb"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Controls */}
            <div className="timer-controls">
              <button
                className="btn btn-ghost btn-icon"
                onClick={handleAbandon}
                disabled={loading}
                title="Abandon session"
              >
                <i className="ti ti-x"></i>
              </button>

              <button
                className="btn btn-primary"
                onClick={handlePauseResume}
                disabled={loading}
              >
                <i
                  className={`ti ${
                    running ? 'ti-player-pause' : 'ti-player-play'
                  }`}
                ></i>
                <span>{running ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={handleComplete}
                disabled={loading}
                style={{ flex: 1 }}
              >
                <i className="ti ti-check"></i>
                <span>Complete</span>
              </button>
            </div>

            {/* Paused indicator */}
            {isPaused && (
              <div className="paused-banner">
                <i className="ti ti-player-pause"></i>
                <span>Session paused</span>
              </div>
            )}
          </>
        ) : (
          /* Completion Screen */
          <div className="completion-screen">
            <div className="completion-icon">
              <i className="ti ti-check"></i>
            </div>
            <div className="completion-title">Session Complete!</div>

            <div className="completion-stats">
              <div className="stat">
                <div className="stat-label">Duration</div>
                <div className="stat-value">
                  {formatDuration(sessionData.actual_duration)}
                </div>
              </div>

              <div className="stat">
                <div className="stat-label">Focus Score</div>
                <div className="stat-value focus-score">
                  {focusScore}
                </div>
              </div>

              <div className="stat">
                <div className="stat-label">vs Planned</div>
                <div className="stat-value">
                  {formatDuration(sessionData.planned_duration)}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleNewSession}
              style={{ width: '100%' }}
            >
              <i className="ti ti-plus"></i>
              New Session
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Earlier Today Section */}
        {earlierSessions.length > 0 && (
          <div className="slog">
            <div className="slog-label">earlier today</div>
            {earlierSessions.slice(0, 3).map(session => (
              <div key={session.id} className="s-row">
                <div className="s-dot s-dot-g"></div>
                <span>{session.topic}</span>
                <div className="s-time">{formatDuration(session.actual_duration)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
  )
}