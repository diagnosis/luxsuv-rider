import axios from 'axios'
import { useAuthStore } from '../store/auth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    const { jwt, guestSessionToken } = useAuthStore.getState()
    
    // Don't add auth header if using manage_token in query params
    if (config.params?.manage_token) {
      return config
    }
    
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`
    } else if (guestSessionToken) {
      config.headers.Authorization = `Bearer ${guestSessionToken}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on 401, but avoid infinite loops
      const { jwt, guestSessionToken, clearAll } = useAuthStore.getState()
      if (jwt || guestSessionToken) {
        clearAll()
        // Only redirect if we're not already on auth pages
        const currentPath = window.location.pathname
        if (!currentPath.includes('/login') && !currentPath.includes('/verify-email') && !currentPath.includes('/guest/access')) {
          window.location.href = '/'
        }
      }
    }
    return Promise.reject(error)
  }
)