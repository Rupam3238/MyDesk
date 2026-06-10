const BASE_URL = 'http://localhost:5000/api/sessions';

const headers = {
  'Content-Type': 'application/json',
};

//
// =====================================================
// SESSIONS
// =====================================================
//

// GET today's sessions
export const getTodaySessions = async () => {
  const res = await fetch(`${BASE_URL}/today`);

  if (!res.ok) {
    throw new Error('Failed to fetch today sessions');
  }

  return res.json();
};

// GET all sessions
export const getAllSessions = async () => {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return res.json();
};

// GET single session WITH EVENTS
export const getSessionById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch session');
  }

  return res.json();
};

// CREATE session
export const createSession = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create session');
  }

  return res.json();
};

// UPDATE session (metadata only)
export const updateSession = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update session');
  }

  return res.json();
};

//
// =====================================================
// SESSION LIFECYCLE
// =====================================================
//

// COMPLETE session (no extra payload needed)
export const completeSession = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/complete`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to complete session');
  }

  return res.json();
};

// ABANDON session
export const abandonSession = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/abandon`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to abandon session');
  }

  return res.json();
};

//
// =====================================================
// EVENTS (CORE OF NEW SYSTEM)
// =====================================================
//

// ADD EVENT (pause, resume, note, etc.)
export const addSessionEvent = async (sessionId, event_type, metadata = {}) => {
  const res = await fetch(`${BASE_URL}/${sessionId}/events`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      event_type,
      metadata,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to add session event');
  }

  return res.json();
};

// GET EVENTS FOR SESSION
export const getSessionEvents = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/${sessionId}/events`);

  if (!res.ok) {
    throw new Error('Failed to fetch session events');
  }

  return res.json();
};

//
// =====================================================
// ANALYTICS
// =====================================================
//

// TODAY STATS
export const getTodayStats = async () => {
  const res = await fetch(`${BASE_URL}/stats/today`);

  if (!res.ok) {
    throw new Error('Failed to fetch today stats');
  }

  return res.json();
};

// WEEK STATS
export const getWeekStats = async () => {
  const res = await fetch(`${BASE_URL}/stats/week`);

  if (!res.ok) {
    throw new Error('Failed to fetch week stats');
  }

  return res.json();
};

// HEATMAP
export const getHeatmap = async () => {
  const res = await fetch(`${BASE_URL}/analytics/heatmap`);

  if (!res.ok) {
    throw new Error('Failed to fetch heatmap');
  }

  return res.json();
};

// CATEGORY FILTER
export const getSessionsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/category/${category}`);

  if (!res.ok) {
    throw new Error('Failed to fetch category sessions');
  }

  return res.json();
};