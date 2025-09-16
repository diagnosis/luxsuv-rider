export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  is_verified: boolean
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface GuestAccessResponse {
  session_token: string
}

export interface Booking {
  id: number
  status: string
  rider_name?: string
  rider_email?: string
  rider_phone?: string
  pickup: string
  dropoff: string
  scheduled_at: string
  notes?: string
  passengers: number
  luggages: number
  ride_type: 'per_ride' | 'hourly'
  driver_id?: number
  created_at: string
  updated_at: string
  manage_token?: string
}

export interface GuestBookingResponse {
  id: number
  manage_token: string
  status: string
  scheduled_at: string
}