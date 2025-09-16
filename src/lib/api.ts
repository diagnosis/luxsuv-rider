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
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url)
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, 'Data:', response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, 'Message:', error.response?.data)
    return Promise.reject(error)
  }
)

// Simple request interceptor - no loops
apiClient.interceptors.request.use((config) => {
  // Check if this is a manage_token request (either in params or URL)
  const hasManageTokenInUrl = config.url?.includes('manage_token') || false
  const hasManageTokenInParams = config.params?.manage_token || false
  const isManageTokenRequest = hasManageTokenInUrl || hasManageTokenInParams
  
  console.log('API: Request interceptor check:', {
    url: config.url,
    hasManageTokenInUrl,
    hasManageTokenInParams,
    isManageTokenRequest
  })
  
  // Don't add auth for manage_token requests
  if (isManageTokenRequest) {
    console.log('API: Using manage_token, skipping auth header')
    return config
  }
  
  // Get auth from localStorage directly to avoid store issues
  try {
    const authData = localStorage.getItem('auth-storage')
    console.log('API: Auth data from localStorage:', authData ? 'found' : 'not found', authData?.substring(0, 100))
    if (authData) {
      const { state } = JSON.parse(authData)
      console.log('API: Parsed auth state:', { 
        hasJwt: !!state.jwt, 
        hasGuestToken: !!state.guestSessionToken,
        jwtPreview: state.jwt?.substring(0, 20) + '...',
        guestTokenPreview: state.guestSessionToken?.substring(0, 20) + '...'
      })
      
      if (state.jwt) {
        config.headers.Authorization = `Bearer ${state.jwt}`
        console.log('API: Added rider auth header')
      } else if (state.guestSessionToken) {
        config.headers.Authorization = `Bearer ${state.guestSessionToken}`
        console.log('API: Added guest auth header')
      } else {
        console.log('API: No auth tokens found in state')
      }
    } else {
      console.log('API: No auth data in localStorage')
    }
  } catch (e) {
    console.error('API: Error reading auth from localStorage:', e)
  }
  
  console.log('API: Final request headers:', {
    Authorization: config.headers.Authorization ? 'Bearer ' + config.headers.Authorization.substring(7, 27) + '...' : 'missing',
    'Content-Type': config.headers['Content-Type']
  })
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