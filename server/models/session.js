import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Session {
  // Create new session
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO sessions (id, user_id, topic, category, goal, planned_duration, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.user_id, data.topic, data.category, data.goal || null, data.planned_duration || 1500, 'active', now]
    );
    
    return this.getById(id);
  }

  // Get session by ID (without calculated fields yet)
  static async getById(id) {
    return dbGet('SELECT * FROM sessions WHERE id = ?', [id]);
  }

  // Get all sessions for a user
  static async getAllByUser(user_id) {
    return dbAll('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
  }

  // Get today's sessions for a user
  static async getTodayByUser(user_id) {
    const today = new Date().toISOString().split('T')[0];
    return dbAll(
      `SELECT * FROM sessions WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC`,
      [user_id, today]
    );
  }

  // Complete a session (calculate actual_duration and optionally set focus_score)
  static async complete(id, focusScore = null) {
    const now = new Date().toISOString();
    
    // Get session creation time
    const session = await this.getById(id);
    
    // Calculate actual duration from creation to now (in seconds)
    const createdAt = new Date(session.created_at);
    const completedAt = new Date(now);
    const actual_duration = Math.round((completedAt - createdAt) / 1000);
    
    await dbRun(
      `UPDATE sessions SET status = 'completed', actual_duration = ?, focus_score = ?, completed_at = ? WHERE id = ?`,
      [actual_duration, focusScore, now, id]
    );

    return this.getById(id);
  }

  // Abandon a session (without completing)
  static async abandon(id) {
    const now = new Date().toISOString();
    
    const session = await this.getById(id);
    const createdAt = new Date(session.created_at);
    const abandonedAt = new Date(now);
    const actual_duration = Math.round((abandonedAt - createdAt) / 1000);
    
    await dbRun(
      `UPDATE sessions SET status = 'abandoned', actual_duration = ?, completed_at = ? WHERE id = ?`,
      [actual_duration, now, id]
    );

    return this.getById(id);
  }

  // Update session metadata (topic, goal, etc)
  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'user_id', 'created_at'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return this.getById(id);

    values.push(id);

    await dbRun(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Delete session
  static async delete(id) {
    // Delete associated events
    await dbRun('DELETE FROM session_events WHERE session_id = ?', [id]);
    // Delete session
    await dbRun('DELETE FROM sessions WHERE id = ?', [id]);
  }

  // =====================================================
  // RAW ANALYTICS (Derived from raw data)
  // =====================================================

  // Get session stats for a user (today)
  static async getStatsToday(user_id) {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await dbGet(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(actual_duration) as total_focus_time,
        AVG(focus_score) as avg_focus_score,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM sessions 
      WHERE user_id = ? AND DATE(created_at) = ?`,
      [user_id, today]
    );

    return {
      total_sessions: result.total_sessions || 0,
      total_focus_time: result.total_focus_time || 0,
      avg_focus_score: result.avg_focus_score ? Math.round(result.avg_focus_score) : 0,
      completed_count: result.completed_count || 0,
    };
  }

  // Get session stats for a user (week)
  static async getStatsWeek(user_id) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const result = await dbGet(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(actual_duration) as total_focus_time,
        AVG(focus_score) as avg_focus_score,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM sessions 
      WHERE user_id = ? AND DATE(created_at) >= ?`,
      [user_id, weekAgo]
    );

    return {
      total_sessions: result.total_sessions || 0,
      total_focus_time: result.total_focus_time || 0,
      avg_focus_score: result.avg_focus_score ? Math.round(result.avg_focus_score) : 0,
      completed_count: result.completed_count || 0,
    };
  }

  // Get activity heatmap data (raw - app derives visualization)
  static async getActivityHeatmap(user_id) {
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return dbAll(
      `SELECT 
        DATE(created_at) as date,
        SUM(actual_duration) as total_duration,
        COUNT(*) as session_count
      FROM sessions 
      WHERE user_id = ? AND status = 'completed' AND DATE(created_at) >= ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC`,
      [user_id, yearAgo]
    );
  }

  // Get sessions by category (for analytics)
  static async getByCategory(user_id, category) {
    return dbAll(
      `SELECT * FROM sessions WHERE user_id = ? AND category = ? ORDER BY created_at DESC`,
      [user_id, category]
    );
  }
}