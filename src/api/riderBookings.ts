import { apiRequest } from './client'
import type { BookingRiderReq, BookingRiderRes } from '../types/booking'

export async function createRiderBooking(data: BookingRiderReq): Promise<BookingRiderRes> {
  return apiRequest<BookingRiderRes>('/v1/rider/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}