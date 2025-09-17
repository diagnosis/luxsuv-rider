import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBookings } from '../hooks/useBookings'
import { createBookingSchema, type CreateBookingInput } from '../lib/validations'
import { useAuthStore } from '../store/auth'
import { Button } from './ui/Button'
import { ContactFields, TripDetailsFields } from './forms/BookingFormFields'
import type { Booking, GuestBookingResponse } from '../lib/api-types'

interface BookingFormProps {
  isGuest: boolean
  onSuccess: (booking: Booking | GuestBookingResponse) => void
}

export function BookingForm({ isGuest, onSuccess }: BookingFormProps) {
  const { user } = useAuthStore()
  const { createGuestBooking, isCreatingGuestBooking, createRiderBooking, isCreatingRiderBooking } = useBookings()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: isGuest ? {} : {
      passengers: 1,
      luggages: 0,
      ride_type: 'per_ride'
    }
  })

  const onSubmit = async (data: CreateBookingInput) => {
    // Format datetime for API
    const scheduledAt = new Date(data.scheduled_at).toISOString()
    const payload = { ...data, scheduled_at: scheduledAt }

    if (isGuest) {
      createGuestBooking(payload, {
        onSuccess: (data) => onSuccess(data)
      })
    } else {
      createRiderBooking(payload, {
        onSuccess: (data) => onSuccess(data)
      })
    }
  }

  const isSubmitting = isCreatingGuestBooking || isCreatingRiderBooking

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ContactFields register={register} errors={errors} isGuest={isGuest} />

        {/* Pre-filled contact info for riders */}
        {!isGuest && user && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={user.phone}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        <TripDetailsFields register={register} errors={errors} />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          Book Now
        </Button>
      </form>
    </div>
  )
}