import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createGuestBooking } from '../../api/guestBookings'
import type { BookingGuestReq } from '../../types/booking'

export const Route = createFileRoute('/guest/book')({
  component: GuestBookPage,
})

function GuestBookPage() {
  const navigate = useNavigate()
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
    mutationFn: createGuestBooking,
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

  const handleManageBooking = () => {
    if (bookingResult) {
      navigate({
        to: '/guest/booking/$id',
        params: { id: bookingResult.id.toString() },
        search: { manage_token: bookingResult.manage_token }
      })
    }
  }

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-green-600 text-xl font-semibold mb-4">Booking Created Successfully!</div>
            <div className="space-y-3 text-sm">
              <p><strong>Booking ID:</strong> {bookingResult.id}</p>
              <div>
                <p><strong>Management Token:</strong></p>
                <p className="font-mono bg-gray-100 p-2 rounded break-all text-xs">{bookingResult.manage_token}</p>
              </div>
              <p className="text-gray-600 mt-4">
                Save this information to manage your booking later.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleManageBooking}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Manage This Booking
              </button>
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
                className="w-full text-blue-600 hover:text-blue-800 underline"
              >
                Create Another Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Luxury SUV</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rider Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rider_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="rider_name"
                    id="rider_name"
                    value={formData.rider_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rider_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="rider_phone"
                    id="rider_phone"
                    value={formData.rider_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="rider_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="rider_email"
                  id="rider_email"
                  value={formData.rider_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="pickup"
                    id="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
                    Dropoff Location *
                  </label>
                  <input
                    type="text"
                    name="dropoff"
                    id="dropoff"
                    value={formData.dropoff}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  id="scheduled_at"
                  value={formData.scheduled_at}
                  onChange={handleInputChange}
                  min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Trip Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Service Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="luggages" className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="ride_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Ride Type *
                  </label>
                  <select
                    name="ride_type"
                    id="ride_type"
                    value={formData.ride_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="per_ride">Per Ride</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Special Notes (Optional)
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Any special requirements or instructions..."
              />
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {createBookingMutation.isPending ? 'Creating Booking...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}