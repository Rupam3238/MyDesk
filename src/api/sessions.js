const BASE_URL = 'http://localhost:5000/api/sessions'

const headers = {
'Content-Type': 'application/json',
}

// GET today's sessions
export const getTodaySessions = async () => {
const res = await fetch(`${BASE_URL}/today`)

if (!res.ok) {
throw new Error('Failed to fetch today sessions')
}

return res.json()
}

// GET all sessions
export const getAllSessions = async () => {
const res = await fetch(BASE_URL)

if (!res.ok) {
throw new Error('Failed to fetch sessions')
}

return res.json()
}

// GET single session
export const getSessionById = async (id) => {
const res = await fetch(`${BASE_URL}/${id}`)

if (!res.ok) {
throw new Error('Failed to fetch session')
}

return res.json()
}

// CREATE session
export const createSession = async (data) => {
const res = await fetch(BASE_URL, {
method: 'POST',
headers,
body: JSON.stringify(data),
})

if (!res.ok) {
throw new Error('Failed to create session')
}

return res.json()
}

// COMPLETE session
export const completeSession = async (id, data) => {
const res = await fetch(`${BASE_URL}/${id}/complete`, {
method: 'POST',
headers,
body: JSON.stringify(data),
})

if (!res.ok) {
throw new Error('Failed to complete session')
}

return res.json()
}

// UPDATE session
export const updateSession = async (id, data) => {
const res = await fetch(`${BASE_URL}/${id}`, {
method: 'PUT',
headers,
body: JSON.stringify(data),
})

if (!res.ok) {
throw new Error('Failed to update session')
}

return res.json()
}

// DELETE session
export const deleteSession = async (id) => {
const res = await fetch(`${BASE_URL}/${id}`, {
method: 'DELETE',
})

if (!res.ok) {
throw new Error('Failed to delete session')
}

return res.json()
}
