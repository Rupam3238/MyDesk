-- MYDESK Database Schema
-- Single-user version
-- Philosophy: Store raw data only. Derive analytics, streaks and metrics from raw data.

-- =====================================================
-- SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
id TEXT PRIMARY KEY,
topic TEXT NOT NULL,
category TEXT NOT NULL,
goal TEXT,
planned_duration INTEGER NOT NULL,
actual_duration INTEGER,
focus_score INTEGER DEFAULT NUll,
interruptions INTEGER DEFAULT 0,
status TEXT DEFAULT 'active',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
completed_at DATETIME
);

-- =====================================================
-- SESSION_EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS session_events (
id TEXT PRIMARY KEY,
session_id TEXT NOT NULL,
event_type TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(session_id) REFERENCES sessions(id)
);

-- =====================================================
-- NOTES
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
id TEXT PRIMARY KEY,
content TEXT NOT NULL,
color TEXT DEFAULT 'purple',
session_id TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(session_id) REFERENCES sessions(id)
);

-- =====================================================
-- TAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
id TEXT PRIMARY KEY,
name TEXT NOT NULL UNIQUE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTE_TAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS note_tags (
note_id TEXT NOT NULL,
tag_id TEXT NOT NULL,
PRIMARY KEY(note_id, tag_id),
FOREIGN KEY(note_id) REFERENCES notes(id),
FOREIGN KEY(tag_id) REFERENCES tags(id)
);

-- =====================================================
-- HABITS
-- =====================================================
CREATE TABLE IF NOT EXISTS habits (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
category TEXT,
color TEXT DEFAULT 'purple',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- HABIT_LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS habit_logs (
id TEXT PRIMARY KEY,
habit_id TEXT NOT NULL,
completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(habit_id) REFERENCES habits(id)
);

-- =====================================================
-- WORKSPACES
-- =====================================================
CREATE TABLE IF NOT EXISTS workspaces (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
icon TEXT,
color TEXT DEFAULT 'purple',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- WORKSPACE_ITEMS
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
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sessions_created_at
ON sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_sessions_status
ON sessions(status);

CREATE INDEX IF NOT EXISTS idx_session_events_session_id
ON session_events(session_id);

CREATE INDEX IF NOT EXISTS idx_session_events_created_at
ON session_events(created_at);

CREATE INDEX IF NOT EXISTS idx_notes_session_id
ON notes(session_id);

CREATE INDEX IF NOT EXISTS idx_notes_created_at
ON notes(created_at);

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id
ON habit_logs(habit_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at
ON habit_logs(completed_at);
