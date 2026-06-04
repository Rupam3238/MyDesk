import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Note {
  // Create new note
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await dbRun(
      `INSERT INTO notes (id, user_id, content, color, session_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.user_id, data.content, data.color || 'purple', data.session_id || null, now, now]
    );

    // Add tags if provided
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        await this.addTag(id, data.user_id, tagName);
      }
    }
    
    return this.getById(id);
  }

  // Get note by ID with tags
  static async getById(id) {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [id]);
    if (!note) return null;

    // Get associated tags
    const tags = await dbAll(
      `SELECT t.name FROM tags t
       JOIN note_tags nt ON t.id = nt.tag_id
       WHERE nt.note_id = ?`,
      [id]
    );

    return {
      ...note,
      tags: tags.map(t => t.name),
    };
  }

  // Get all notes for a user
  static async getAllByUser(user_id) {
    const notes = await dbAll(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    // Attach tags to each note
    for (let note of notes) {
      const tags = await dbAll(
        `SELECT t.name FROM tags t
         JOIN note_tags nt ON t.id = nt.tag_id
         WHERE nt.note_id = ?`,
        [note.id]
      );
      note.tags = tags.map(t => t.name);
    }

    return notes;
  }

  // Get today's notes for a user
  static async getTodayByUser(user_id) {
    const today = new Date().toISOString().split('T')[0];
    const notes = await dbAll(
      `SELECT * FROM notes WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC`,
      [user_id, today]
    );

    // Attach tags
    for (let note of notes) {
      const tags = await dbAll(
        `SELECT t.name FROM tags t
         JOIN note_tags nt ON t.id = nt.tag_id
         WHERE nt.note_id = ?`,
        [note.id]
      );
      note.tags = tags.map(t => t.name);
    }

    return notes;
  }

  // Get notes by session
  static async getBySession(session_id) {
    const notes = await dbAll(
      'SELECT * FROM notes WHERE session_id = ? ORDER BY created_at DESC',
      [session_id]
    );

    // Attach tags
    for (let note of notes) {
      const tags = await dbAll(
        `SELECT t.name FROM tags t
         JOIN note_tags nt ON t.id = nt.tag_id
         WHERE nt.note_id = ?`,
        [note.id]
      );
      note.tags = tags.map(t => t.name);
    }

    return notes;
  }

  // Get notes by tag
  static async getByTag(user_id, tagName) {
    const tag = await dbGet(
      'SELECT id FROM tags WHERE user_id = ? AND name = ?',
      [user_id, tagName]
    );

    if (!tag) return [];

    const notes = await dbAll(
      `SELECT n.* FROM notes n
       JOIN note_tags nt ON n.id = nt.note_id
       WHERE nt.tag_id = ? AND n.user_id = ?
       ORDER BY n.created_at DESC`,
      [tag.id, user_id]
    );

    // Attach tags
    for (let note of notes) {
      const tags = await dbAll(
        `SELECT t.name FROM tags t
         JOIN note_tags nt ON t.id = nt.tag_id
         WHERE nt.note_id = ?`,
        [note.id]
      );
      note.tags = tags.map(t => t.name);
    }

    return notes;
  }

  // Update note
  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'user_id', 'created_at', 'tags'].includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      await dbRun(
        `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update tags if provided
    if (data.tags) {
      // Remove old tags
      await dbRun('DELETE FROM note_tags WHERE note_id = ?', [id]);
      // Add new tags
      const note = await this.getById(id);
      for (const tagName of data.tags) {
        await this.addTag(id, note.user_id, tagName);
      }
    }

    return this.getById(id);
  }

  // Add tag to note (helper)
  static async addTag(note_id, user_id, tagName) {
    // Get or create tag
    let tag = await dbGet(
      'SELECT id FROM tags WHERE user_id = ? AND name = ?',
      [user_id, tagName]
    );

    if (!tag) {
      const tag_id = uuidv4();
      await dbRun(
        'INSERT INTO tags (id, user_id, name) VALUES (?, ?, ?)',
        [tag_id, user_id, tagName]
      );
      tag = { id: tag_id };
    }

    // Link tag to note (ignore if already exists)
    await dbRun(
      'INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)',
      [note_id, tag.id]
    );
  }

  // Delete note
  static async delete(id) {
    // Delete tags
    await dbRun('DELETE FROM note_tags WHERE note_id = ?', [id]);
    // Delete note
    await dbRun('DELETE FROM notes WHERE id = ?', [id]);
  }

  // Get all tags for a user
  static async getAllTags(user_id) {
    return dbAll(
      `SELECT id, name, COUNT(nt.note_id) as note_count
       FROM tags t
       LEFT JOIN note_tags nt ON t.id = nt.tag_id
       WHERE t.user_id = ?
       GROUP BY t.id
       ORDER BY note_count DESC`,
      [user_id]
    );
  }

  // Count notes created today
  static async countToday(user_id) {
    const today = new Date().toISOString().split('T')[0];
    const result = await dbGet(
      `SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND DATE(created_at) = ?`,
      [user_id, today]
    );
    return result.count;
  }
}