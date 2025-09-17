import * as RHF from 'react-hook-form'
import { type CreateBookingInput } from '../../lib/validations'

interface BookingFormFieldsProps {
  register: RHF.UseFormRegister<any>
  errors: RHF.FieldErrors<any>
  isGuest?: boolean
}

export function ContactFields({ register, errors, isGuest = false }: BookingFormFieldsProps) {
  if (!isGuest) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
      
      <div>
        <label htmlFor="rider_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          {...register('rider_name')}
          type="text"
          id="rider_name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
        {errors.rider_name && (
          <p className="text-sm text-red-600 mt-1">{errors.rider_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rider_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          {...register('rider_email')}
          type="email"
          id="rider_email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email address"
        />
        {errors.rider_email && (
          <p className="text-sm text-red-600 mt-1">{errors.rider_email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rider_phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          {...register('rider_phone')}
          type="tel"
          id="rider_phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your phone number"
        />
        {errors.rider_phone && (
          <p className="text-sm text-red-600 mt-1">{errors.rider_phone.message}</p>
        )}
      </div>
    </div>
  )
}

export function TripDetailsFields({ register, errors }: BookingFormFieldsProps) {
  return (
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter pickup address"
        />
        {errors.pickup && (
          <p className="text-sm text-red-600 mt-1">{errors.pickup.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
          Dropoff Location *
        </label>
        <input
          {...register('dropoff')}
          type="text"
          id="dropoff"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter destination address"
        />
        {errors.dropoff && (
          <p className="text-sm text-red-600 mt-1">{errors.dropoff.message}</p>
        )}
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
        {errors.scheduled_at && (
          <p className="text-sm text-red-600 mt-1">{errors.scheduled_at.message}</p>
        )}
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
          {errors.passengers && (
            <p className="text-sm text-red-600 mt-1">{errors.passengers.message}</p>
          )}
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
          {errors.luggages && (
            <p className="text-sm text-red-600 mt-1">{errors.luggages.message}</p>
          )}
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
          {errors.ride_type && (
            <p className="text-sm text-red-600 mt-1">{errors.ride_type.message}</p>
          )}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Any special requirements or instructions..."
        />
        {errors.notes && (
          <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
        )}
      </div>
    </div>
  )
}