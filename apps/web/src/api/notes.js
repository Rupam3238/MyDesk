const BASE_URL = 'http://localhost:5000/api/notes';

const headers = {
  'Content-Type': 'application/json',
};

// GET all notes
export const getAllNotes = async () => {
  const res = await fetch(BASE_URL);

  if (!res.ok) throw new Error('Failed to fetch notes');

  return res.json();
};

// GET today's notes
export const getTodayNotes = async () => {
  const res = await fetch(`${BASE_URL}/today`);

  if (!res.ok) throw new Error('Failed to fetch today notes');

  return res.json();
};

// CREATE note
export const createNote = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create note');

  return res.json();
};

// GET notes by category
export const getNotesByCategory = async (category) => {
  const res = await fetch(
    `${BASE_URL}/category/${encodeURIComponent(category)}`
  );

  if (!res.ok) throw new Error('Failed to fetch notes by category');

  return res.json();
};

// UPDATE note
export const updateNote = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update note');

  return res.json();
};

// DELETE note
export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete note');

  return res.json();
};