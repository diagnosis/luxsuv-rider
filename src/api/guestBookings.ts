import { apiRequest } from './client'
import type { BookingGuestReq, BookingGuestRes, BookingDTO, BookingStatus } from '../types/booking'

export async function createGuestBooking(data: BookingGuestReq): Promise<BookingGuestRes> {
  return apiRequest<BookingGuestRes>('/v1/bookings/guest', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getGuestBookingById(id: number, manageToken: string): Promise<BookingDTO> {
  return apiRequest<BookingDTO>(`/v1/bookings/guest/${id}?manage_token=${encodeURIComponent(manageToken)}`)
}

export async function cancelGuestBooking(id: number, manageToken: string): Promise<void> {
  return apiRequest<void>(`/v1/bookings/guest/${id}?manage_token=${encodeURIComponent(manageToken)}`, {
    method: 'DELETE',
  })
}

export interface ListGuestBookingsParams {
  limit?: number
  offset?: number
  status?: BookingStatus
}

export async function listGuestBookings(params: ListGuestBookingsParams = {}): Promise<BookingDTO[]> {
  const searchParams = new URLSearchParams()
  
  if (params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString())
  }
  if (params.offset !== undefined) {
    searchParams.set('offset', params.offset.toString())
  }
  if (params.status) {
    searchParams.set('status', params.status)
  }

  const query = searchParams.toString()
  return apiRequest<BookingDTO[]>(`/v1/bookings/guest${query ? `?${query}` : ''}`)
}