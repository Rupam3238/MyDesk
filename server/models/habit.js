import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Habit {
  // Create new habit
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO habits (id, user_id, name, category, color, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.user_id, data.name, data.category || null, data.color || 'purple', now]
    );
    
    return this.getById(id);
  }

  // Get habit by ID
  static async getById(id) {
    const habit = await dbGet('SELECT * FROM habits WHERE id = ?', [id]);
    if (!habit) return null;

    // Derive streak from logs
    habit.current_streak = await this.calculateStreak(id);
    return habit;
  }

  // Get all habits for a user
  static async getAllByUser(user_id) {
    const habits = await dbAll(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    // Derive streaks for each
    for (let habit of habits) {
      habit.current_streak = await this.calculateStreak(habit.id);
    }

    return habits;
  }

  // Update habit
  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'user_id', 'created_at', 'current_streak'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return this.getById(id);

    values.push(id);

    await dbRun(
      `UPDATE habits SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  // Delete habit
  static async delete(id) {
    // Delete logs
    await dbRun('DELETE FROM habit_logs WHERE habit_id = ?', [id]);
    // Delete habit
    await dbRun('DELETE FROM habits WHERE id = ?', [id]);
  }

  // =====================================================
  // RAW TRACKING (Store raw completion data)
  // =====================================================

  // Mark habit as completed today
  static async markCompleted(habit_id) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    // Insert completion log
    await dbRun(
      `INSERT INTO habit_logs (id, habit_id, completed_at) VALUES (?, ?, ?)`,
      [id, habit_id, now]
    );

    return this.getById(habit_id);
  }

  // Get today's status for all habits (for a user)
  static async getTodayStatus(user_id) {
    const today = new Date().toISOString().split('T')[0];
    
    return dbAll(
      `SELECT 
        h.id,
        h.name,
        h.color,
        CASE WHEN hl.id IS NOT NULL THEN 1 ELSE 0 END as completed_today
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND DATE(hl.completed_at) = ?
      WHERE h.user_id = ?
      ORDER BY h.created_at`,
      [today, user_id]
    );
  }

  // =====================================================
  // DERIVED ANALYTICS (Calculate from raw data)
  // =====================================================

  // Calculate current streak for a habit
  static async calculateStreak(habit_id) {
    const logs = await dbAll(
      `SELECT DATE(completed_at) as date FROM habit_logs 
       WHERE habit_id = ? 
       ORDER BY completed_at DESC`,
      [habit_id]
    );

    if (logs.length === 0) return 0;

    // Build streak by checking consecutive days
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      // Check if this date is consecutive
      if (logDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Get completions for this week (raw data)
  static async getWeekCompletions(habit_id) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return dbAll(
      `SELECT DATE(completed_at) as date FROM habit_logs 
       WHERE habit_id = ? AND DATE(completed_at) >= ? 
       ORDER BY completed_at DESC`,
      [habit_id, weekAgo]
    );
  }

  // Get all completions for a habit (raw history)
  static async getAllCompletions(habit_id) {
    return dbAll(
      `SELECT completed_at FROM habit_logs 
       WHERE habit_id = ? 
       ORDER BY completed_at DESC`,
      [habit_id]
    );
  }

  // Get habit consistency for a period (raw calculation)
  static async getConsistency(habit_id, days = 7) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const result = await dbGet(
      `SELECT 
        COUNT(DISTINCT DATE(completed_at)) as completion_count
      FROM habit_logs 
      WHERE habit_id = ? AND DATE(completed_at) >= ?`,
      [habit_id, startDate]
    );

    const completionCount = result.completion_count || 0;
    const consistency = Math.round((completionCount / days) * 100);

    return {
      days,
      completion_count: completionCount,
      consistency_percentage: consistency,
    };
  }

  // Get all habits stats for a user (week view)
  static async getWeekStatsForUser(user_id) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return dbAll(
      `SELECT 
        h.id,
        h.name,
        COUNT(DISTINCT DATE(hl.completed_at)) as completions_this_week
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND DATE(hl.completed_at) >= ?
      WHERE h.user_id = ?
      GROUP BY h.id
      ORDER BY h.created_at DESC`,
      [weekAgo, user_id]
    );
  }
}