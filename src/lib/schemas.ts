import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Guest access schemas
export const guestRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const guestVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(1, 'Code is required'),
})

// Booking schemas
const baseBookingSchema = z.object({
  pickup: z.string().min(1, 'Pickup location is required'),
  dropoff: z.string().min(1, 'Dropoff location is required'),
  scheduled_at: z.string().refine(
    (val) => {
      const date = new Date(val)
      return date > new Date()
    },
    'Scheduled time must be in the future'
  ),
  notes: z.string().optional(),
  passengers: z.number().int().min(1, 'At least 1 passenger').max(8, 'Maximum 8 passengers'),
  luggages: z.number().int().min(0, 'Minimum 0 luggage').max(10, 'Maximum 10 luggage pieces'),
  ride_type: z.enum(['per_ride', 'hourly'], {
    errorMap: () => ({ message: 'Please select a ride type' })
  }),
})

export const riderBookingSchema = baseBookingSchema

export const guestBookingSchema = baseBookingSchema.extend({
  rider_name: z.string().min(1, 'Name is required'),
  rider_email: z.string().email('Invalid email address'),
  rider_phone: z.string().min(1, 'Phone number is required'),
})

export const guestBookingUpdateSchema = z.object({
  pickup: z.string().optional(),
  dropoff: z.string().optional(),
  scheduled_at: z.string().optional(),
  notes: z.string().optional(),
  passengers: z.number().int().min(1).max(8).optional(),
  luggages: z.number().int().min(0).max(10).optional(),
  ride_type: z.enum(['per_ride', 'hourly']).optional(),
})

// Type exports
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type GuestRequestData = z.infer<typeof guestRequestSchema>
export type GuestVerifyData = z.infer<typeof guestVerifySchema>
export type RiderBookingData = z.infer<typeof riderBookingSchema>
export type GuestBookingData = z.infer<typeof guestBookingSchema>
export type GuestBookingUpdateData = z.infer<typeof guestBookingUpdateSchema>