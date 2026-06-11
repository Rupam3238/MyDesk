export function setupRoutes(app) {
  import sessionsRouter from './sessions.js'
  import notesRouter from './notes.js'
  import habitsRouter from './habits.js'

  app.use('/api/sessions', sessionsRouter)
  app.use('/api/notes', notesRouter)
  app.use('/api/habits', habitsRouter)
}
