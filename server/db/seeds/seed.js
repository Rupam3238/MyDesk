import { v4 as uuidv4 } from 'uuid';
import { dbRun } from '../database.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...\n');

    // Seed Sessions
    const sessions = [
      {
        id: uuidv4(),
        topic: 'React Hooks Deep Dive',
        category: 'Coding',
        goal: 'Understand useState and useEffect',
        duration: 1500,
        elapsedTime: 1500,
        status: 'completed',
        notes: 'Learned about hook rules and dependencies',
        focusScore: 85,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        topic: 'JavaScript Async/Await',
        category: 'Coding',
        goal: 'Master async patterns',
        duration: 1500,
        elapsedTime: 1500,
        status: 'completed',
        notes: 'Practiced error handling with try/catch',
        focusScore: 90,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        topic: 'SQLite Database Design',
        category: 'Backend',
        goal: 'Design schema for MYDESK',
        duration: 2700,
        elapsedTime: 2700,
        status: 'completed',
        notes: 'Normalized tables for sessions, notes, and habits',
        focusScore: 88,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        topic: 'Express API Routes',
        category: 'Backend',
        goal: 'Build REST endpoints',
        duration: 1500,
        elapsedTime: 1500,
        status: 'completed',
        notes: 'Created CRUD operations for sessions',
        focusScore: 82,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        topic: 'React State Management',
        category: 'Coding',
        goal: 'Integrate with backend',
        duration: 1500,
        elapsedTime: 945,
        status: 'completed',
        notes: 'Connected frontend to API endpoints',
        focusScore: 87,
        createdAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const session of sessions) {
      await dbRun(
        `INSERT INTO sessions (id, topic, category, goal, duration, elapsedTime, status, notes, focusScore, createdAt, completedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [session.id, session.topic, session.category, session.goal, session.duration, session.elapsedTime, 
         session.status, session.notes, session.focusScore, session.createdAt, session.completedAt]
      );
    }
    console.log(`✅ Seeded ${sessions.length} sessions`);

    // Seed Notes
    const notes = [
      {
        id: uuidv4(),
        content: 'useCallback memoizes a function so it doesn\'t re-create on every render — use when passing to child components.',
        tags: JSON.stringify(['React', 'hooks']),
        color: 'purple',
        sessionId: null,
      },
      {
        id: uuidv4(),
        content: 'Build ugly first. Ship it. Refactor later. Stop redesigning the folder structure.',
        tags: JSON.stringify(['mindset']),
        color: 'green',
        sessionId: null,
      },
      {
        id: uuidv4(),
        content: 'SQLite stores data in a single file on disk — perfect for local projects. No server needed.',
        tags: JSON.stringify(['backend', 'db']),
        color: 'amber',
        sessionId: null,
      },
      {
        id: uuidv4(),
        content: 'Always cleanup intervals in useEffect return function to prevent memory leaks.',
        tags: JSON.stringify(['React', 'performance']),
        color: 'blue',
        sessionId: null,
      },
    ];

    for (const note of notes) {
      await dbRun(
        `INSERT INTO notes (id, content, tags, color, sessionId) VALUES (?, ?, ?, ?, ?)`,
        [note.id, note.content, note.tags, note.color, note.sessionId]
      );
    }
    console.log(`✅ Seeded ${notes.length} notes`);

    // Seed Habits
    const habits = [
      {
        id: uuidv4(),
        name: 'Study Session',
        category: 'Learning',
        color: 'purple',
        streakCount: 11,
      },
      {
        id: uuidv4(),
        name: 'Exercise',
        category: 'Health',
        color: 'green',
        streakCount: 5,
      },
      {
        id: uuidv4(),
        name: 'Journal',
        category: 'Reflection',
        color: 'amber',
        streakCount: 3,
      },
      {
        id: uuidv4(),
        name: 'Drink Water',
        category: 'Health',
        color: 'blue',
        streakCount: 7,
      },
      {
        id: uuidv4(),
        name: 'Sleep by 11pm',
        category: 'Health',
        color: 'purple',
        streakCount: 2,
      },
    ];

    for (const habit of habits) {
      await dbRun(
        `INSERT INTO habits (id, name, category, color, streakCount) VALUES (?, ?, ?, ?, ?)`,
        [habit.id, habit.name, habit.category, habit.color, habit.streakCount]
      );
    }
    console.log(`✅ Seeded ${habits.length} habits`);

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();