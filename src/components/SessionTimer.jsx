import { useState, useEffect } from 'react'
import {
  createSession,
  completeSession,
} from '../api/sessions'

export default function SessionTimer() {
  const [totalSecs] = useState(25 * 60)
  const [remainSecs, setRemainSecs] = useState(25 * 60)
  const [running, setRunning] = useState(true)

  const [sessionId, setSessionId] = useState(null)
  const [completed, setCompleted] = useState(false)

  // Create session when component loads
  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await createSession({
          topic: 'React Hooks',
          category: 'Coding',
          goal: 'Study React Hooks',
          duration: totalSecs,
        })

        setSessionId(session.id)

        console.log('Session created:', session.id)
      } catch (err) {
        console.error('Failed to create session:', err)
      }
    }

    startSession()
  }, [totalSecs])

  // Timer logic
  useEffect(() => {
    if (!running) return
    if (remainSecs <= 0) return

    const interval = setInterval(() => {
      setRemainSecs(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, remainSecs])

  // Complete session when timer reaches 0
  useEffect(() => {
    if (remainSecs !== 0) return
    if (!sessionId) return
    if (completed) return

    const finishSession = async () => {
      try {
        await completeSession(sessionId, {
          elapsedTime: totalSecs,
          focusScore: 100,
        })

        setCompleted(true)
        setRunning(false)

        console.log('Session completed')
      } catch (err) {
        console.error('Failed to complete session:', err)
      }
    }

    finishSession()
  }, [remainSecs, sessionId, completed, totalSecs])

  const mins = Math.floor(remainSecs / 60)
  const secs = remainSecs % 60

  const displayTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const progress = Math.round(
    ((totalSecs - remainSecs) / totalSecs) * 100
  )

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <i className="ti ti-clock"></i>
          Study Session
        </div>

        <div className="btn-row">
          <span className="tag tag-p">
            Pomodoro · 25m
          </span>
        </div>
      </div>

      <div className="timer-wrap">
        <div className="timer-tags">
          <span className="tag tag-p">
            React Hooks
          </span>

          <span className="tag tag-gray">
            Session 3 of 4
          </span>
        </div>

        <div className="timer-num">
          {displayTime}
        </div>

        <div className="timer-pb-bg">
          <div
            className="timer-pb"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="timer-controls">
          <button className="btn btn-ghost btn-icon">
            <i className="ti ti-player-skip-back"></i>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setRunning(!running)}
            disabled={completed}
          >
            <i
              className={`ti ${
                running
                  ? 'ti-player-pause'
                  : 'ti-player-play'
              }`}
            ></i>

            <span>
              {running ? 'Pause' : 'Resume'}
            </span>
          </button>

          <button className="btn btn-ghost btn-icon">
            <i className="ti ti-player-skip-forward"></i>
          </button>

          <button className="btn btn-ghost btn-icon">
            <i className="ti ti-refresh"></i>
          </button>
        </div>
      </div>

      <div className="slog">
        <div className="slog-label">
          earlier today
        </div>

        <div className="s-row">
          <div className="s-dot"></div>
          JS Promises &amp; async/await
          <div className="s-time">25m</div>
        </div>

        <div className="s-row">
          <div className="s-dot"></div>
          useEffect deep dive
          <div className="s-time">25m</div>
        </div>

        <div className="s-row">
          <div className="s-dot s-dot-g"></div>
          Break
          <div className="s-time">5m</div>
        </div>
      </div>
    </div>
  )
}