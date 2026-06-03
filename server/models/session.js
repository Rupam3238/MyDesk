import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Session {
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO sessions (id, topic, category, goal, duration, elapsedTime, status, notes, focusScore, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.topic, data.category, data.goal || null, data.duration || 1500, 0, 'active', data.notes || null, 0, now]
    );
    
    return this.getById(id);
  }

  static async getById(id) {
    return dbGet('SELECT * FROM sessions WHERE id = ?', [id]);
  }

  static async getAll() {
    return dbAll('SELECT * FROM sessions ORDER BY createdAt DESC');
  }

  static async getAllToday() {
    const today = new Date().toISOString().split('T')[0];
    return dbAll(
      `SELECT * FROM sessions WHERE DATE(createdAt) = ? ORDER BY createdAt DESC`,
      [today]
    );
  }

  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    values.push(id);

    await dbRun(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  static async complete(id, elapsedTime, focusScore) {
    const now = new Date().toISOString();
    
    await dbRun(
      `UPDATE sessions SET status = 'completed', elapsedTime = ?, focusScore = ?, completedAt = ? WHERE id = ?`,
      [elapsedTime, focusScore, now, id]
    );

    return this.getById(id);
  }

  static async delete(id) {
    await dbRun('DELETE FROM sessions WHERE id = ?', [id]);
  }

  static async getStats(period = 'today') {
    let query = '';
    
    if (period === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = `
        SELECT 
          COUNT(*) as totalSessions,
          SUM(elapsedTime) as totalTime,
          AVG(focusScore) as avgFocusScore,
          MAX(focusScore) as bestFocusScore
        FROM sessions 
        WHERE DATE(createdAt) = ? AND status = 'completed'
      `;
      return dbGet(query, [today]);
    }
    
    if (period === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      query = `
        SELECT 
          COUNT(*) as totalSessions,
          SUM(elapsedTime) as totalTime,
          AVG(focusScore) as avgFocusScore
        FROM sessions 
        WHERE DATE(createdAt) >= ? AND status = 'completed'
      `;
      return dbGet(query, [weekAgo]);
    }
  }
}