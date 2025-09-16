import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Simple flag to prevent interceptor loops
let isRefreshing = false

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Don't add auth header if using manage_token in query params
    if (config.params?.manage_token) {
      return config
    }
    
    // Get auth state directly from localStorage to avoid store dependencies
    const authData = localStorage.getItem('auth-storage')
    if (authData) {
      try {
        const { state } = JSON.parse(authData)
        if (state.jwt) {
          config.headers.Authorization = `Bearer ${state.jwt}`
        } else if (state.guestSessionToken) {
          config.headers.Authorization = `Bearer ${state.guestSessionToken}`
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors and avoid loops
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true
      
      // Clear auth state
      localStorage.removeItem('auth-storage')
      
      // Only redirect if not already on auth/landing pages
      const currentPath = window.location.pathname
      const authPages = ['/login', '/verify-email', '/guest/access', '/']
      
      if (!authPages.includes(currentPath) && !currentPath.includes('manage_token')) {
        setTimeout(() => {
          window.location.href = '/'
          isRefreshing = false
        }, 100)
      } else {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)