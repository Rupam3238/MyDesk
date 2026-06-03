import express from 'express';
import { Session } from '../models/Session.js';

const router = express.Router();

// Create new session
router.post('/', async (req, res) => {
  try {
    const { topic, category, goal, duration } = req.body;

    if (!topic || !category) {
      return res.status(400).json({ error: 'Topic and category are required' });
    }

    const session = await Session.create({
      topic,
      category,
      goal,
      duration: duration || 1500, // 25 minutes default
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.getAll();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get today's sessions
router.get('/today', async (req, res) => {
  try {
    const sessions = await Session.getAllToday();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching today sessions:', error);
    res.status(500).json({ error: 'Failed to fetch today sessions' });
  }
});

// Get session stats
router.get('/stats/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const stats = await Session.getStats(period);
    res.json(stats || { totalSessions: 0, totalTime: 0, avgFocusScore: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get single session
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.getById(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, category, goal, notes, interruptions } = req.body;

    const session = await Session.update(id, {
      topic,
      category,
      goal,
      notes,
      interruptions,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Complete session (stop timer, save elapsed time and focus score)
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { elapsedTime, focusScore } = req.body;

    const session = await Session.complete(id, elapsedTime, focusScore || 0);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Session.delete(id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;