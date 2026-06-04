-- MYDESK Database Schema
-- Philosophy: Store raw data only. Derive all metrics, streaks, analytics from raw data.

-- =====================================================
-- USERS (Foundation for multi-user scaling)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SESSIONS (Work sessions with raw tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  goal TEXT,
  planned_duration INTEGER NOT NULL,  -- In seconds (e.g., 1500 for 25 min)
  actual_duration INTEGER,            -- In seconds, filled when completed
  focus_score INTEGER,                -- 0-100, optional rating by user
  interruptions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',       -- 'active', 'completed', 'abandoned'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- =====================================================
-- SESSION_EVENTS (Raw minute-by-minute tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS session_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,          -- 'focus_start', 'focus_pause', 'focus_resume', 'distraction', 'break'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

-- =====================================================
-- NOTES (Learning capture, linked to sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT DEFAULT 'purple',
  session_id TEXT,                   -- Optional: linked session
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

-- =====================================================
-- TAGS (Normalized, queryable)
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- =====================================================
-- NOTE_TAGS (Junction: notes -> tags)
-- =====================================================
CREATE TABLE IF NOT EXISTS note_tags (
  note_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY(note_id, tag_id),
  FOREIGN KEY(note_id) REFERENCES notes(id),
  FOREIGN KEY(tag_id) REFERENCES tags(id)
);

-- =====================================================
-- HABITS (Behavioral tracking, no streak storage)
-- =====================================================
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  color TEXT DEFAULT 'purple',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- =====================================================
-- HABIT_LOGS (Raw completion data - derive streaks from this)
-- =====================================================
CREATE TABLE IF NOT EXISTS habit_logs (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(habit_id) REFERENCES habits(id)
);

-- =====================================================
-- WORKSPACES (Quick Launch presets + environment config)
-- =====================================================
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT 'purple',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- =====================================================
-- WORKSPACE_ITEMS (Apps/URLs/Resources in a workspace)
-- =====================================================
CREATE TABLE IF NOT EXISTS workspace_items (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  url TEXT,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(workspace_id) REFERENCES workspaces(id)
);

-- =====================================================
-- INDEXES (Query performance)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_events_session_id ON session_events(session_id);
CREATE INDEX IF NOT EXISTS idx_session_events_created_at ON session_events(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_session_id ON notes(session_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON habit_logs(completed_at);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);