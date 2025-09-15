import { BookingGuestReq, BookingGuestRes, BookingDTO, BookingStatus } from '../types/booking'

const API_BASE = 'http://localhost:8080/v1/bookings/guest'

export async function createBooking(data: BookingGuestReq): Promise<BookingGuestRes> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to create booking')
  }

  return response.json()
}

export async function getBookingById(id: number, manageToken: string): Promise<BookingDTO> {
  const url = new URL(`${API_BASE}/${id}`)
  url.searchParams.set('manage_token', manageToken)

  const response = await fetch(url.toString())

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Booking not found')
    }
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to get booking')
  }

  return response.json()
}

export async function cancelBooking(id: number, manageToken: string): Promise<void> {
  const url = new URL(`${API_BASE}/${id}`)
  url.searchParams.set('manage_token', manageToken)

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  })

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to cancel booking')
  }
}

export interface ListBookingsParams {
  limit?: number
  offset?: number
  status?: BookingStatus
}

export async function listBookings(params: ListBookingsParams = {}): Promise<BookingDTO[]> {
  const url = new URL(API_BASE)
  
  if (params.limit !== undefined) {
    url.searchParams.set('limit', params.limit.toString())
  }
  if (params.offset !== undefined) {
    url.searchParams.set('offset', params.offset.toString())
  }
  if (params.status) {
    url.searchParams.set('status', params.status)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to list bookings')
  }

  return response.json()
}