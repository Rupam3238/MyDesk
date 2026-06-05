import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Session {

  // =====================================================
  // CREATE SESSION
  // =====================================================
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO sessions (
        id,
        topic,
        category,
        goal,
        planned_duration,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.topic,
        data.category,
        data.goal || null,
        data.planned_duration,
        'active',
        now
      ]
    );

    return this.getById(id);
  }

  // =====================================================
  // GET SESSION
  // =====================================================
  static async getById(id) {
    return dbGet(
      `SELECT * FROM sessions WHERE id = ?`,
      [id]
    );
  }

  static async getAll() {
    return dbAll(
      `SELECT * FROM sessions ORDER BY created_at DESC`
    );
  }

  static async getAllToday() {
    const today = new Date().toISOString().split('T')[0];

    return dbAll(
      `SELECT * FROM sessions
       WHERE DATE(created_at) = ?
       ORDER BY created_at DESC`,
      [today]
    );
  }

  // =====================================================
  // UPDATE SESSION METADATA
  // =====================================================
  static async update(id, data) {
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && !['id', 'created_at'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return this.getById(id);

    values.push(id);

    await dbRun(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // =====================================================
  // SESSION EVENTS (RAW TRUTH LAYER)
  // =====================================================

  static async addEvent(session_id, event_type, metadata = {}) {
    const id = uuidv4();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO session_events (
        id,
        session_id,
        event_type,
        created_at
      ) VALUES (?, ?, ?, ?)`,
      [
        id,
        session_id,
        event_type,
        now
      ]
    );

    return {
      id,
      session_id,
      event_type,
      created_at: now
    };
  }

  static async getEvents(session_id) {
    return dbAll(
      `SELECT * FROM session_events
       WHERE session_id = ?
       ORDER BY created_at ASC`,
      [session_id]
    );
  }

  // =====================================================
  // CALCULATE FOCUS SCORE
  // =====================================================
  static async calculateFocusScore(id, actualDuration) {
    const session = await this.getById(id);
    if (!session) return 0;

    const plannedDuration = session.planned_duration;

    // Get pause count (interruptions)
    const events = await this.getEvents(id);
    const pauseCount = events.filter(e => e.event_type === 'pause').length;

    // Formula: (actual / planned) * 100 - (pauses * 5)
    let focusScore = (actualDuration / plannedDuration) * 100;
    focusScore = focusScore - (pauseCount * 5);

    // Cap at 100, floor at 0
    focusScore = Math.max(0, Math.min(100, Math.round(focusScore)));

    return focusScore;
  }

  // =====================================================
  // COMPLETE SESSION (DERIVED FROM RAW TIME RANGE)
  // =====================================================
  static async complete(id) {
    const now = new Date().toISOString();

    const session = await this.getById(id);
    if (!session) return null;

    const createdAt = new Date(session.created_at);
    const completedAt = new Date(now);

    const actual_duration = Math.round(
      (completedAt - createdAt) / 1000
    );

    // Calculate focus score
    const focusScore = await this.calculateFocusScore(id, actual_duration);

    console.log({
      actual_duration,
      focusScore
    });
    
    // Update sessionf
    await dbRun(
      `UPDATE sessions
       SET status = 'completed',
           actual_duration = ?,
           focus_score = ?,
           completed_at = ?
       WHERE id = ?`,
      [actual_duration, focusScore, now, id]
    );

    // Add completion event
    await this.addEvent(id, 'complete', {});

    return this.getById(id);
  }

  static async abandon(id) {
    const now = new Date().toISOString();

    const session = await this.getById(id);
    if (!session) return null;

    const createdAt = new Date(session.created_at);
    const abandonedAt = new Date(now);

    const actual_duration = Math.round(
      (abandonedAt - createdAt) / 1000
    );

    // Abandoned session has 0 focus score
    await dbRun(
      `UPDATE sessions
       SET status = 'abandoned',
           actual_duration = ?,
           focus_score = 0,
           completed_at = ?
       WHERE id = ?`,
      [actual_duration, now, id]
    );

    // Add abandon event
    await this.addEvent(id, 'abandon', {});

    return this.getById(id);
  }

  // =====================================================
  // ANALYTICS (LIGHTWEIGHT - SESSION-BASED)
  // =====================================================

  static async getStatsToday() {
    const today = new Date().toISOString().split('T')[0];

    const result = await dbGet(
      `SELECT
        COUNT(*) as total_sessions,
        SUM(actual_duration) as total_focus_time,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        AVG(CASE WHEN status = 'completed' THEN focus_score ELSE NULL END) as avg_focus_score
       FROM sessions
       WHERE DATE(created_at) = ?`,
      [today]
    );

    return {
      total_sessions: result.total_sessions || 0,
      total_focus_time: result.total_focus_time || 0,
      completed_count: result.completed_count || 0,
      avg_focus_score: result.avg_focus_score ? Math.round(result.avg_focus_score) : 0
    };
  }

  static async getStatsWeek() {
    const weekAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0];

    const result = await dbGet(
      `SELECT
        COUNT(*) as total_sessions,
        SUM(actual_duration) as total_focus_time,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        AVG(CASE WHEN status = 'completed' THEN focus_score ELSE NULL END) as avg_focus_score
       FROM sessions
       WHERE DATE(created_at) >= ?`,
      [weekAgo]
    );

    return {
      total_sessions: result.total_sessions || 0,
      total_focus_time: result.total_focus_time || 0,
      completed_count: result.completed_count || 0,
      avg_focus_score: result.avg_focus_score ? Math.round(result.avg_focus_score) : 0
    };
  }

  static async getActivityHeatmap() {
    const yearAgo = new Date(
      Date.now() - 365 * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0];

    return dbAll(
      `SELECT
        DATE(created_at) as date,
        SUM(actual_duration) as total_duration,
        COUNT(*) as session_count,
        AVG(focus_score) as avg_focus_score
       FROM sessions
       WHERE status = 'completed'
         AND DATE(created_at) >= ?
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [yearAgo]
    );
  }

  static async getByCategory(category) {
    return dbAll(
      `SELECT * FROM sessions
       WHERE category = ?
       ORDER BY created_at DESC`,
      [category]
    );
  }

  // =====================================================
  // SESSION + EVENTS VIEW
  // =====================================================

  static async getSessionWithEvents(id) {
    const session = await this.getById(id);
    if (!session) return null;

    const events = await this.getEvents(id);

    return {
      ...session,
      events
    };
  }
}