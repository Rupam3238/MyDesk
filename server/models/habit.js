import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Habit {
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO habits (id, name, category, color, createdAt, streakCount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.category || null, data.color || 'purple', now, 0]
    );
    
    return this.getById(id);
  }

  static async getById(id) {
    return dbGet('SELECT * FROM habits WHERE id = ?', [id]);
  }

  static async getAll() {
    return dbAll('SELECT * FROM habits ORDER BY createdAt DESC');
  }

  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    values.push(id);

    await dbRun(
      `UPDATE habits SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  static async delete(id) {
    // Delete associated completions
    await dbRun('DELETE FROM habit_completions WHERE habitId = ?', [id]);
    // Delete habit
    await dbRun('DELETE FROM habits WHERE id = ?', [id]);
  }

  // Mark habit as completed today
  static async markCompleted(habitId) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO habit_completions (id, habitId, completedAt) VALUES (?, ?, ?)`,
      [id, habitId, now]
    );

    // Update streak
    const habit = await this.getById(habitId);
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already completed today
    const todayCompletion = await dbGet(
      `SELECT * FROM habit_completions WHERE habitId = ? AND DATE(completedAt) = ?`,
      [habitId, today]
    );

    if (!todayCompletion) {
      // Increment streak
      await dbRun(
        `UPDATE habits SET streakCount = streakCount + 1, lastCompletedAt = ? WHERE id = ?`,
        [now, habitId]
      );
    }

    return this.getById(habitId);
  }

  // Get completions for this week
  static async getWeekCompletions(habitId) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return dbAll(
      `SELECT DATE(completedAt) as date FROM habit_completions 
       WHERE habitId = ? AND DATE(completedAt) >= ? 
       ORDER BY completedAt DESC`,
      [habitId, weekAgo]
    );
  }

  // Get today's habits status
  static async getTodayStatus() {
    const today = new Date().toISOString().split('T')[0];
    
    const habits = await dbAll(`
      SELECT 
        h.id,
        h.name,
        h.color,
        CASE WHEN hc.id IS NOT NULL THEN 1 ELSE 0 END as completedToday
      FROM habits h
      LEFT JOIN habit_completions hc ON h.id = hc.habitId AND DATE(hc.completedAt) = ?
      ORDER BY h.createdAt
    `, [today]);

    return habits;
  }
}