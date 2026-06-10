import express from 'express';
import { Note } from '../models/Note.js';

const router = express.Router();

// Create new note
router.post('/', async (req, res) => {
  try {
    const { content, tags, color, sessionId, category } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const note = await Note.create({
      content,
      tags: tags || [],
      color: color || 'purple',
      sessionId,
      category,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.getAll();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get today's notes
router.get('/today', async (req, res) => {
  try {
    const notes = await Note.getAllToday();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching today notes:', error);
    res.status(500).json({ error: 'Failed to fetch today notes' });
  }
});

// Get notes by session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const notes = await Note.getBySession(sessionId);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching session notes:', error);
    res.status(500).json({ error: 'Failed to fetch session notes' });
  }
});

// Get notes by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const notes = await Note.getByCategory(category);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching category notes:', error);
    res.status(500).json({ error: 'Failed to fetch category notes' });
  }
});

// Count today's notes
router.get('/count/today', async (req, res) => {
  try {
    const count = await Note.countToday();
    res.json({ count });
  } catch (error) {
    console.error('Error counting notes:', error);
    res.status(500).json({ error: 'Failed to count notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.getById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, tags, color } = req.body;

    const note = await Note.update(id, {
      content,
      tags,
      color,
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Note.delete(id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;