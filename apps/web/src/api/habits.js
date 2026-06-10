const BASE_URL = 'http://localhost:5000/api/habits'

const headers = {
'Content-Type': 'application/json',
}

// GET all habits
export const getAllHabits = async () => {
const res = await fetch(BASE_URL)

if (!res.ok) {
throw new Error('Failed to fetch habits')
}

return res.json()
}

// GET today's habit status
export const getTodayHabitStatus = async () => {
const res = await fetch(`${BASE_URL}/today/status`)

if (!res.ok) {
throw new Error('Failed to fetch habit status')
}

return res.json()
}

// CREATE habit
export const createHabit = async (data) => {
const res = await fetch(BASE_URL, {
method: 'POST',
headers,
body: JSON.stringify(data),
})

if (!res.ok) {
throw new Error('Failed to create habit')
}

return res.json()
}

// COMPLETE habit
export const completeHabit = async (id) => {
const res = await fetch(`${BASE_URL}/${id}/complete`, {
method: 'POST',
headers,
})

if (!res.ok) {
throw new Error('Failed to complete habit')
}

return res.json()
}

// GET habit completion history
export const getHabitCompletions = async (id) => {
const res = await fetch(`${BASE_URL}/${id}/completions`)

if (!res.ok) {
throw new Error('Failed to fetch habit completions')
}

return res.json()
}

// UPDATE habit
export const updateHabit = async (id, data) => {
const res = await fetch(`${BASE_URL}/${id}`, {
method: 'PUT',
headers,
body: JSON.stringify(data),
})

if (!res.ok) {
throw new Error('Failed to update habit')
}

return res.json()
}

// DELETE habit
export const deleteHabit = async (id) => {
const res = await fetch(`${BASE_URL}/${id}`, {
method: 'DELETE',
})

if (!res.ok) {
throw new Error('Failed to delete habit')
}

return res.json()
}
