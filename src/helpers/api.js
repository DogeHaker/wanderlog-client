import axios from 'axios'

// Use environment variable (set in Vercel as VITE_API_BASE)
const backendUrl = `${process.env.VUE_APP_API_BASE}/travels/`

// Helper: attach JWT token from localStorage
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
}

// Get all travel logs (with optional query)
export const viewAllTravels = async (query = "") => {
  try {
    const res = await axios.get(`${backendUrl}?${query}`, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}

// Get a single travel log by ID
export const viewTravelById = async (id) => {
  try {
    const res = await axios.get(`${backendUrl}${id}`, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}

// Add a new travel log
export const addNewTravel = async (travel) => {
  try {
    const res = await axios.post(backendUrl, travel, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}

// Edit an existing travel log
export const editTravel = async (id, travel) => {
  try {
    const res = await axios.put(`${backendUrl}${id}`, travel, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}

// Delete a single travel log
export const deleteTravel = async (id) => {
  try {
    const res = await axios.delete(`${backendUrl}${id}`, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}

// Delete ALL travel logs (careful!)
export const deleteAllTravels = async () => {
  try {
    const res = await axios.delete(backendUrl, getHeaders())
    return res.data
  } catch (err) {
    console.error(err)
    return null
  }
}