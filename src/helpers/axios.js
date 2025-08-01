import axios from 'axios'

// Use Vite environment variable
const baseURL = process.env.VUE_APP_API_BASE || 'http://localhost:3000'

const api = axios.create({ baseURL })

// Automatically attach token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default api