# MyDesk

MyDesk is a personal productivity operating system designed to help users spend less time managing productivity tools and more time doing focused work.

Instead of separating timers, notes, habit trackers, and analytics into different applications, MyDesk combines them into a single workspace centered around one core concept:

**Focused work sessions.**

---

## Vision

Most productivity tools solve only one part of the problem:

* Pomodoro apps track time
* Notes apps capture information
* Habit trackers build consistency
* Analytics tools measure performance

MyDesk combines all four into a unified workflow where users can:

1. Start a focused work session
2. Take notes while working
3. Track daily habits
4. Review productivity analytics

The long-term goal is to become a lightweight personal productivity dashboard rather than just another timer app.

---

## Core Features

### Focus Sessions

Focus sessions are the primary entity in the system.

Users can:

* Create work sessions
* Set a topic or goal
* Track duration
* Measure focus score
* Record interruptions
* Mark sessions as completed
* Review historical sessions

Example:

Topic: Learn React Hooks

Goal: Understand useState

Duration: 25 minutes

After completion the session becomes part of the user's productivity history and analytics.

---

### Notes

Users can capture notes at any time.

Notes support:

* Rich text content
* Tags
* Color categorization
* Optional connection to a focus session

Examples:

* Study notes
* Session reflections
* Ideas
* Quick reminders

---

### Habit Tracking

Habit tracking is designed around consistency rather than complexity.

Users can:

* Create habits
* Mark daily completions
* Track streaks
* Review progress over time

Examples:

* Reading
* Coding
* Exercise
* Meditation

---

### Productivity Analytics

Analytics are generated from stored session and habit data.

Current and planned metrics include:

* Total focus time
* Session counts
* Focus score averages
* Daily productivity
* Weekly productivity
* Habit streaks
* Trend analysis
* Activity heatmaps

---

## Architecture

The application follows a straightforward full-stack architecture.

```text
React Frontend
       │
       ▼
REST API
       │
       ▼
Express Backend
       │
       ▼
SQLite Database
```

The design intentionally avoids unnecessary complexity.

No microservices.

No event systems.

No distributed infrastructure.

Just a clean React → Express → SQLite stack.

---

## Technology Stack

### Frontend

* React
* JavaScript
* Vite

### Backend

* Node.js
* Express.js

### Database

* SQLite

### API Style

* REST

---

## Project Structure

```text
MyDesk/
│
├── client/                 # React frontend
│
├── server/                 # Express backend
│   │
│   ├── db/
│   │   ├── database setup
│   │   ├── migrations
│   │   └── seed data
│   │
│   ├── models/
│   │   ├── Session
│   │   ├── Note
│   │   └── Habit
│   │
│   ├── routes/
│   │   ├── sessions
│   │   ├── notes
│   │   └── habits
│   │
│   └── server.js
│
└── README.md
```

---

## Data Model

### Session

Represents a focused work session.

Typical fields:

```text
id
topic
goal
duration
elapsedTime
focusScore
interruptions
status
createdAt
completedAt
```

### Note

Represents user-created notes.

```text
id
content
tags
color
sessionId
createdAt
updatedAt
```

### Habit

Represents a recurring activity.

```text
id
name
category
streakCount
lastCompletedAt
createdAt
```

### Habit Completion

Tracks individual habit completions.

```text
id
habitId
completedAt
```

---

## Current Development Status

### Backend

Status: Stable

Implemented:

* Database models
* REST API
* CRUD operations
* SQLite integration

### Frontend

Status: Active Development

Implemented:

* Dashboard UI
* Session workflow
* Notes interface
* Habit tracking interface

Currently being improved:

* UI consistency
* Frontend/backend integration
* Dashboard redesign

### Analytics

Status: Partial

Basic metrics exist.

Advanced visualizations and trend analysis are planned.

---

## Running the Project

### Backend

```bash
cd server
npm install
npm run db:init
npm run db:seed
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Roadmap

### Short Term

* Complete frontend ↔ backend integration
* Remove remaining mock data
* Improve dashboard UI
* Improve session workflow

### Medium Term

* Advanced analytics
* Historical productivity insights
* Session filtering and search
* Better reporting

### Long Term

* Productivity heatmaps
* Goal tracking
* Deep work enhancements
* Mobile-friendly experience

---

## AI Contributor Notes

If you are modifying this codebase:

### Important Concepts

* Sessions are the central entity.
* Notes may optionally belong to sessions.
* Habits are independent from sessions.
* Analytics are derived from stored data.
* SQLite is the source of truth.
* Backend architecture is considered stable.
* Current development focus is frontend polish and integration.

### Guidelines

1. Avoid introducing duplicate state.
2. Prefer extending existing models over creating new ones.
3. Keep the architecture simple.
4. Maintain consistent API response formats.
5. Derive analytics from stored records instead of caching computed values unless necessary.

---

## Project Goal

Build a personal productivity operating system that makes focused work easier by combining:

* Sessions
* Notes
* Habits
* Analytics

into a single workspace with minimal friction.
