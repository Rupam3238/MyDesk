import express from 'express';
import cors from 'cors';
import sessionsRouter from './routes/sessions.js';
import notesRouter from './routes/notes.js';
import habitsRouter from './routes/habits.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/habits', habitsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
