import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet, dbAll } from '../db/database.js';

export class Note {
  static async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO notes (id, content, color, session_id, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.content,
        data.color || 'purple',
        data.sessionId || data.session_id || null,
        data.category || null,
        now,
        now
      ]
    );

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        await this.addTag(id, tagName);
      }
    }

    return this.getById(id);
  }

  static async getById(id) {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [id]);
    if (!note) return null;

    const tags = await dbAll(
      `SELECT t.name FROM tags t
       JOIN note_tags nt ON t.id = nt.tag_id
       WHERE nt.note_id = ?`,
      [id]
    );

    return {
      ...note,
      tags: tags.map(t => t.name)
    };
  }

  static async getAll() {
    const notes = await dbAll('SELECT * FROM notes ORDER BY created_at DESC');

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

  static async getAllToday() {
    const today = new Date().toISOString().split('T')[0];
    const notes = await dbAll(
      `SELECT * FROM notes WHERE DATE(created_at) = ? ORDER BY created_at DESC`,
      [today]
    );

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

  static async getBySession(session_id) {
    const notes = await dbAll(
      'SELECT * FROM notes WHERE session_id = ? ORDER BY created_at DESC',
      [session_id]
    );

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

  static async getByCategory(category) {
    const notes = await dbAll(
      `SELECT * FROM notes WHERE category = ? ORDER BY created_at DESC`,
      [category]
    );

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

  static async update(id, data) {
    const updates = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !['id', 'created_at', 'tags'].includes(key)) {
        // map camelCase to snake_case DB columns if necessary
        const column = key === 'sessionId' ? 'session_id' : key;
        updates.push(`${column} = ?`);
        values.push(value);
      }
    });

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      await dbRun(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    if (data.tags) {
      await dbRun('DELETE FROM note_tags WHERE note_id = ?', [id]);
      for (const tagName of data.tags) {
        await this.addTag(id, tagName);
      }
    }

    return this.getById(id);
  }

  static async addTag(note_id, tagName) {
    let tag = await dbGet('SELECT id FROM tags WHERE name = ?', [tagName]);

    if (!tag) {
      const tag_id = uuidv4();
      await dbRun('INSERT INTO tags (id, name) VALUES (?, ?)', [tag_id, tagName]);
      tag = { id: tag_id };
    }

    await dbRun('INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)', [note_id, tag.id]);
  }

  static async delete(id) {
    await dbRun('DELETE FROM note_tags WHERE note_id = ?', [id]);
    await dbRun('DELETE FROM notes WHERE id = ?', [id]);
  }

  static async getAllTags() {
    return dbAll(
      `SELECT id, name, COUNT(nt.note_id) as note_count
       FROM tags t
       LEFT JOIN note_tags nt ON t.id = nt.tag_id
       GROUP BY t.id
       ORDER BY note_count DESC`
    );
  }

  static async countToday() {
    const today = new Date().toISOString().split('T')[0];
    const result = await dbGet(`SELECT COUNT(*) as count FROM notes WHERE DATE(created_at) = ?`, [today]);
    return result.count;
  }
}