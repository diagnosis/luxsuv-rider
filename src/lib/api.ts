import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug logging for all requests
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url)
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url)
    return Promise.reject(error)
  }
)

// Simple request interceptor - no loops
apiClient.interceptors.request.use((config) => {
  // Don't add auth for manage_token requests
  if (config.params?.manage_token) {
    return config
  }
  
  // Get auth from localStorage directly to avoid store issues
  try {
    const authData = localStorage.getItem('auth-storage')
    if (authData) {
      const { state } = JSON.parse(authData)
      
      if (state.jwt) {
        config.headers.Authorization = `Bearer ${state.jwt}`
      } else if (state.guestSessionToken) {
        config.headers.Authorization = `Bearer ${state.guestSessionToken}`
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  
  return config
})

// Simple response interceptor - no loops
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401s and avoid infinite loops
    if (error.response?.status === 401) {
      // Clear auth but don't redirect automatically
      localStorage.removeItem('auth-storage')
    }
    return Promise.reject(error)
  }
)