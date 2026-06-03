import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'mydesk.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      category TEXT NOT NULL,
      goal TEXT,
      duration INTEGER NOT NULL,
      elapsedTime INTEGER NOT NULL,
      status TEXT DEFAULT 'completed',
      notes TEXT,
      focusScore INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME,
      interruptions INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('Error creating sessions table:', err);
    else console.log('✅ Sessions table ready');
  });

  // Notes table
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      tags TEXT,
      color TEXT DEFAULT 'purple',
      sessionId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sessionId) REFERENCES sessions(id)
    )
  `, (err) => {
    if (err) console.error('Error creating notes table:', err);
    else console.log('✅ Notes table ready');
  });

  // Habits table
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      color TEXT DEFAULT 'purple',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      streakCount INTEGER DEFAULT 0,
      lastCompletedAt DATETIME
    )
  `, (err) => {
    if (err) console.error('Error creating habits table:', err);
    else console.log('✅ Habits table ready');
  });

  // Habit completions table (for weekly tracking)
  db.run(`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id TEXT PRIMARY KEY,
      habitId TEXT NOT NULL,
      completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(habitId) REFERENCES habits(id)
    )
  `, (err) => {
    if (err) console.error('Error creating habit_completions table:', err);
    else console.log('✅ Habit completions table ready');
  });
});

db.close(() => {
  console.log('\n✅ Database initialization complete!');
});