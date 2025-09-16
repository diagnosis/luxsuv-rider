import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiClient } from '../lib/api'
import { riderBookingSchema, guestBookingSchema, type RiderBookingData, type GuestBookingData } from '../lib/schemas'
import { useAuthStore } from '../store/auth'
import { useToast } from './ui/Toast'
import type { Booking, GuestBookingResponse } from '../lib/api-types'

interface BookingFormProps {
  isGuest: boolean
  onSuccess: (booking: Booking | GuestBookingResponse) => void
}

export function BookingForm({ isGuest, onSuccess }: BookingFormProps) {
  const { user } = useAuthStore()
  const { showToast } = useToast()

  const schema = isGuest ? guestBookingSchema : riderBookingSchema
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GuestBookingData | RiderBookingData>({
    resolver: zodResolver(schema),
    defaultValues: isGuest ? {} : {
      passengers: 1,
      luggages: 0,
      ride_type: 'per_ride'
    }
  })

  const onSubmit = async (data: GuestBookingData | RiderBookingData) => {
    try {
      // Format datetime for API
      const scheduledAt = new Date(data.scheduled_at).toISOString()
      const payload = { ...data, scheduled_at: scheduledAt }

      const endpoint = isGuest ? '/v1/guest/bookings' : '/v1/rider/bookings'
      console.log('BookingForm: Making request to:', endpoint, 'with payload:', payload)
      const response = await apiClient.post(endpoint, payload)
      
      showToast('Booking created successfully!', 'success')
      onSuccess(response.data)
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 400) {
        showToast('Please check your booking details', 'error')
      } else if (status === 401) {
        showToast('Session expired. Please log in again.', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Failed to create booking. Please try again.', 'error')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact fields for guests */}
      {isGuest && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div>
            <label htmlFor="rider_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              {...register('rider_name' as keyof GuestBookingData)}
              type="text"
              id="rider_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.rider_name && <p className="text-sm text-red-600 mt-1">{errors.rider_name.message}</p>}
          </div>

          <div>
            <label htmlFor="rider_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              {...register('rider_email' as keyof GuestBookingData)}
              type="email"
              id="rider_email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.rider_email && <p className="text-sm text-red-600 mt-1">{errors.rider_email.message}</p>}
          </div>

          <div>
            <label htmlFor="rider_phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              {...register('rider_phone' as keyof GuestBookingData)}
              type="tel"
              id="rider_phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.rider_phone && <p className="text-sm text-red-600 mt-1">{errors.rider_phone.message}</p>}
          </div>
        </div>
      )}

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

      {/* Trip details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Trip Details</h3>
        
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location *
          </label>
          <input
            {...register('pickup')}
            type="text"
            id="pickup"
            placeholder="Enter pickup address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.pickup && <p className="text-sm text-red-600 mt-1">{errors.pickup.message}</p>}
        </div>

        <div>
          <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
            Dropoff Location *
          </label>
          <input
            {...register('dropoff')}
            type="text"
            id="dropoff"
            placeholder="Enter destination address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.dropoff && <p className="text-sm text-red-600 mt-1">{errors.dropoff.message}</p>}
        </div>

        <div>
          <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date & Time *
          </label>
          <input
            {...register('scheduled_at')}
            type="datetime-local"
            id="scheduled_at"
            min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.scheduled_at && <p className="text-sm text-red-600 mt-1">{errors.scheduled_at.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              Passengers (1-8) *
            </label>
            <input
              {...register('passengers', { valueAsNumber: true })}
              type="number"
              id="passengers"
              min="1"
              max="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.passengers && <p className="text-sm text-red-600 mt-1">{errors.passengers.message}</p>}
          </div>

          <div>
            <label htmlFor="luggages" className="block text-sm font-medium text-gray-700 mb-1">
              Luggage (0-10)
            </label>
            <input
              {...register('luggages', { valueAsNumber: true })}
              type="number"
              id="luggages"
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.luggages && <p className="text-sm text-red-600 mt-1">{errors.luggages.message}</p>}
          </div>

          <div>
            <label htmlFor="ride_type" className="block text-sm font-medium text-gray-700 mb-1">
              Ride Type *
            </label>
            <select
              {...register('ride_type')}
              id="ride_type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="per_ride">Per Ride</option>
              <option value="hourly">Hourly</option>
            </select>
            {errors.ride_type && <p className="text-sm text-red-600 mt-1">{errors.ride_type.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Special Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            placeholder="Any special requirements or instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? 'Creating booking...' : 'Book Now'}
      </button>
    </form>
  )
}