import { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export class APIError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public details?: string,
    message?: string
  ) {
    super(message || `API Error: ${status}`)
    this.name = 'APIError'
  }
}

export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PAST_DATETIME: 'PAST_DATETIME',
} as const

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) return false
        return failureCount < 2
      },
    },
  },
})

function getAuthToken(): string | null {
  try {
    const authData = localStorage.getItem('auth-storage')
    if (!authData) return null
    
    const { state } = JSON.parse(authData)
    return state.jwt || state.guestSessionToken || null
  } catch {
    return null
  }
}

class BookingAPI {
  private baseURL = API_BASE

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check for manage_token in URL
    const hasManageToken = endpoint.includes('manage_token')
    const token = hasManageToken ? null : getAuthToken()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      
      throw new APIError(
        response.status,
        errorData.code,
        errorData.details,
        errorData.message
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as T
  }

  // Auth endpoints
  register = (data: any) =>
    this.request('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

  login = (data: any) =>
    this.request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

  verifyEmail = (token: string) =>
    this.request(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    })

  // Guest access endpoints
  requestGuestAccess = (email: string) =>
    this.request('/v1/guest/access/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

  verifyGuestAccess = (email: string, code: string) =>
    this.request('/v1/guest/access/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })

  // Booking endpoints
  createGuestBooking = (data: any) =>
    this.request('/v1/guest/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })

  createRiderBooking = (data: any) =>
    this.request('/v1/rider/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })

  listGuestBookings = () =>
    this.request('/v1/guest/bookings')

  listRiderBookings = () =>
    this.request('/v1/rider/bookings')

  getGuestBooking = (id: string, manageToken?: string) => {
    const endpoint = manageToken 
      ? `/v1/guest/bookings/${id}?manage_token=${encodeURIComponent(manageToken)}`
      : `/v1/guest/bookings/${id}`
    return this.request(endpoint)
  }

  updateGuestBooking = (id: string, data: any, manageToken?: string) => {
    const endpoint = manageToken
      ? `/v1/guest/bookings/${id}?manage_token=${encodeURIComponent(manageToken)}`
      : `/v1/guest/bookings/${id}`
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  cancelGuestBooking = (id: string, manageToken?: string) => {
    const endpoint = manageToken
      ? `/v1/guest/bookings/${id}?manage_token=${encodeURIComponent(manageToken)}`
      : `/v1/guest/bookings/${id}`
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const api = new BookingAPI()