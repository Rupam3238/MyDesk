import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Note {
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO notes (id, content, tags, color, sessionId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.content, JSON.stringify(data.tags || []), data.color || 'purple', data.sessionId || null, now, now]
    );
    
    return this.getById(id);
  }

  static async getById(id) {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [id]);
    if (note) {
      note.tags = JSON.parse(note.tags || '[]');
    }
    return note;
  }

  static async getAll() {
    const notes = await dbAll('SELECT * FROM notes ORDER BY createdAt DESC');
    return notes.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]')
    }));
  }

  static async getAllToday() {
    const today = new Date().toISOString().split('T')[0];
    const notes = await dbAll(
      `SELECT * FROM notes WHERE DATE(createdAt) = ? ORDER BY createdAt DESC`,
      [today]
    );
    return notes.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]')
    }));
  }

  static async getBySession(sessionId) {
    const notes = await dbAll('SELECT * FROM notes WHERE sessionId = ? ORDER BY createdAt DESC', [sessionId]);
    return notes.map(note => ({
      ...note,
      tags: JSON.parse(note.tags || '[]')
    }));
  }

  static async update(id, data) {
    const now = new Date().toISOString();
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        if (key === 'tags') {
          updates.push('tags = ?');
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    await dbRun(
      `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  static async delete(id) {
    await dbRun('DELETE FROM notes WHERE id = ?', [id]);
  }

  static async countToday() {
    const today = new Date().toISOString().split('T')[0];
    const result = await dbGet(
      `SELECT COUNT(*) as count FROM notes WHERE DATE(createdAt) = ?`,
      [today]
    );
    return result.count;
  }
}