import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '../api/bookings'
import type { BookingGuestReq } from '../types/booking'

export function BookingForm() {
  const [formData, setFormData] = useState<BookingGuestReq>({
    rider_name: '',
    rider_email: '',
    rider_phone: '',
    pickup: '',
    dropoff: '',
    scheduled_at: '',
    passengers: 1,
    luggages: 0,
    ride_type: 'per_ride',
    notes: ''
  })

  const [bookingResult, setBookingResult] = useState<{ id: number; manage_token: string } | null>(null)

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      setBookingResult({ id: data.id, manage_token: data.manage_token })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format scheduled_at to ISO string
    const scheduledAt = new Date(formData.scheduled_at).toISOString()
    
    createBookingMutation.mutate({
      ...formData,
      scheduled_at: scheduledAt
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  if (bookingResult) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-green-600 text-xl font-semibold mb-4">Booking Created Successfully!</div>
          <div className="space-y-2 text-sm">
            <p><strong>Booking ID:</strong> {bookingResult.id}</p>
            <p><strong>Manage Token:</strong></p>
            <p className="font-mono bg-gray-100 p-2 rounded break-all text-xs">{bookingResult.manage_token}</p>
            <p className="text-gray-600 mt-4">
              Save this token to manage your booking later. You'll need it to view or cancel your reservation.
            </p>
          </div>
          <button
            onClick={() => {
              setBookingResult(null)
              setFormData({
                rider_name: '',
                rider_email: '',
                rider_phone: '',
                pickup: '',
                dropoff: '',
                scheduled_at: '',
                passengers: 1,
                luggages: 0,
                ride_type: 'per_ride',
                notes: ''
              })
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Create Another Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Luxury SUV</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rider Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="rider_name"
              id="rider_name"
              value={formData.rider_name}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="rider_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Full Name *
            </label>
          </div>

          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="rider_email"
              id="rider_email"
              value={formData.rider_email}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="rider_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email Address *
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full group">
          <input
            type="tel"
            name="rider_phone"
            id="rider_phone"
            value={formData.rider_phone}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="rider_phone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Phone Number *
          </label>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="pickup"
              id="pickup"
              value={formData.pickup}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="pickup"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Pickup Location *
            </label>
          </div>

          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="dropoff"
              id="dropoff"
              value={formData.dropoff}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="dropoff"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Dropoff Location *
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full group">
          <input
            type="datetime-local"
            name="scheduled_at"
            id="scheduled_at"
            value={formData.scheduled_at}
            onChange={handleInputChange}
            min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)} // 2 hours from now
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
          <label
            htmlFor="scheduled_at"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Scheduled Date & Time *
          </label>
        </div>

        {/* Trip Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
              Passengers (1-8) *
            </label>
            <input
              type="number"
              name="passengers"
              id="passengers"
              min="1"
              max="8"
              value={formData.passengers}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="luggages" className="block text-sm font-medium text-gray-700 mb-2">
              Luggage (0-10)
            </label>
            <input
              type="number"
              name="luggages"
              id="luggages"
              min="0"
              max="10"
              value={formData.luggages}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="ride_type" className="block text-sm font-medium text-gray-700 mb-2">
              Ride Type *
            </label>
            <select
              name="ride_type"
              id="ride_type"
              value={formData.ride_type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="per_ride">Per Ride</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>

        <div className="relative z-0 w-full group">
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer resize-none"
            placeholder=" "
          />
          <label
            htmlFor="notes"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Special Notes (Optional)
          </label>
        </div>

        {createBookingMutation.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              {createBookingMutation.error.message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={createBookingMutation.isPending}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBookingMutation.isPending ? 'Creating Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  )
}