export interface BookingGuestReq {
  rider_name: string
  rider_email: string
  rider_phone: string
  pickup: string
  dropoff: string
  scheduled_at: string // ISO string
  passengers: number
  luggages: number
  ride_type: 'per_ride' | 'hourly'
  notes?: string
}

export interface BookingGuestRes {
  id: number
  manage_token: string
  status: string
  scheduled_at: string
}

export interface BookingDTO {
  id: number
  status: string
  rider_name: string
  rider_email: string
  rider_phone: string
  pickup: string
  dropoff: string
  scheduled_at: string
  notes?: string
  passengers: number
  luggages: number
  ride_type: string
  driver_id?: number
  created_at: string
  updated_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'on_trip' | 'completed' | 'canceled'