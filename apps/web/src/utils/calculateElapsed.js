export function calculateElapsed(session, now = Date.now()) {
  const start = new Date(session.created_at).getTime()
  const events = session.events || []

  let totalActive = 0
  let lastStart = start

  for (const event of events) {
    const t = new Date(event.created_at).getTime()

    if (event.event_type === 'pause') {
      totalActive += t - lastStart
      lastStart = null
    }

    if (event.event_type === 'resume') {
      lastStart = t
    }
  }

  // if still running, close last segment
  if (lastStart !== null) {
    totalActive += now - lastStart
  }

  return Math.floor(totalActive / 1000)
}