import { z } from 'zod'

// Base validation schemas
export const createBookingSchema = z.object({
  rider_name: z.string().min(1, 'Name is required').max(100),
  rider_email: z.string().email('Invalid email format'),
  rider_phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format'),
  pickup: z.string().min(1, 'Pickup location is required'),
  dropoff: z.string().min(1, 'Dropoff location is required'),
  scheduled_at: z.date().refine(
    (date) => date > new Date(),
    'Scheduled time must be in the future'
  ),
  passengers: z.number().int().min(1, 'At least 1 passenger').max(8, 'Maximum 8 passengers'),
  luggages: z.number().int().min(0, 'Minimum 0 luggage').max(10, 'Maximum 10 luggage pieces'),
  ride_type: z.enum(['per_ride', 'hourly'], {
    errorMap: () => ({ message: 'Please select a ride type' })
  }),
  notes: z.string().optional(),
})

export const guestAccessSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export const verifyAccessSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
})

export const authLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const authRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type GuestAccessInput = z.infer<typeof guestAccessSchema>
export type VerifyAccessInput = z.infer<typeof verifyAccessSchema>
export type AuthLoginInput = z.infer<typeof authLoginSchema>
export type AuthRegisterInput = z.infer<typeof authRegisterSchema>