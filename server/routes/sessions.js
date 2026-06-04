import express from 'express';
import { Session } from '../models/Session.js';

const router = express.Router();


// =====================================================
// CREATE SESSION
// =====================================================
router.post('/', async (req, res) => {
  try {
    const { topic, category, goal, planned_duration } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        error: 'Topic and category are required'
      });
    }

    const session = await Session.create({
      topic,
      category,
      goal,
      planned_duration: planned_duration || 1500
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});


// =====================================================
// GET ALL SESSIONS
// =====================================================
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.getAll();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});


// =====================================================
// GET TODAY SESSIONS
// =====================================================
router.get('/today', async (req, res) => {
  try {
    const sessions = await Session.getAllToday();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching today sessions:', error);
    res.status(500).json({ error: 'Failed to fetch today sessions' });
  }
});


// =====================================================
// GET SINGLE SESSION
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.getSessionWithEvents(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});


// =====================================================
// UPDATE SESSION (metadata only)
// =====================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { topic, category, goal } = req.body;

    const session = await Session.update(id, {
      topic,
      category,
      goal
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


// =====================================================
// COMPLETE SESSION
// =====================================================
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.complete(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});


// =====================================================
// ABANDON SESSION
// =====================================================
router.post('/:id/abandon', async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.abandon(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error abandoning session:', error);
    res.status(500).json({ error: 'Failed to abandon session' });
  }
});


// =====================================================
// SESSION EVENTS (NEW CORE LAYER)
// =====================================================

// Add event (pause, resume, note, etc.)
router.post('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { event_type, metadata } = req.body;

    if (!event_type) {
      return res.status(400).json({
        error: 'event_type is required'
      });
    }

    const event = await Session.addEvent(
      id,
      event_type,
      metadata || {}
    );

    res.status(201).json(event);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
});


// Get all events for session
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Session.getEvents(id);

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


// =====================================================
// ANALYTICS (NO USER LAYER)
// =====================================================

// Today stats
router.get('/stats/today', async (req, res) => {
  try {
    const stats = await Session.getStatsToday();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


// Week stats
router.get('/stats/week', async (req, res) => {
  try {
    const stats = await Session.getStatsWeek();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});


// Heatmap
router.get('/analytics/heatmap', async (req, res) => {
  try {
    const data = await Session.getActivityHeatmap();
    res.json(data);
  } catch (error) {
    console.error('Error fetching heatmap:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap' });
  }
});


// By category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const sessions = await Session.getByCategory(category);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching category sessions:', error);
    res.status(500).json({ error: 'Failed to fetch category sessions' });
  }
});

export default router;