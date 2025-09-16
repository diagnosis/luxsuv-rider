import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createGuestBooking } from '../api/guestBookings'
import { createRiderBooking } from '../api/riderBookings'
import { useAuth } from '../contexts/AuthContext'
import type { BookingGuestReq, BookingRiderReq } from '../types/booking'

export const Route = createFileRoute('/book')({
  component: BookPage,
})

interface FormData {
  rider_name: string
  rider_email: string
  rider_phone: string
  pickup: string
  dropoff: string
  scheduled_at: string
  passengers: number
  luggages: number
  ride_type: 'per_ride' | 'hourly'
  notes: string
}

function BookPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState<FormData>({
    rider_name: user?.name || '',
    rider_email: user?.email || '',
    rider_phone: user?.phone || '',
    pickup: '',
    dropoff: '',
    scheduled_at: '',
    passengers: 1,
    luggages: 0,
    ride_type: 'per_ride',
    notes: ''
  })

  const guestBookingMutation = useMutation({
    mutationFn: createGuestBooking,
    onSuccess: (data) => {
      navigate({
        to: '/guest/booking/$id',
        params: { id: data.id.toString() },
        search: { manage_token: data.manage_token }
      })
    },
  })

  const riderBookingMutation = useMutation({
    mutationFn: createRiderBooking,
    onSuccess: () => {
      navigate({ to: '/rider' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format scheduled_at to ISO string
    const scheduledAt = new Date(formData.scheduled_at).toISOString()
    
    if (isAuthenticated) {
      // Rider booking - exclude personal info
      const riderBookingData: BookingRiderReq = {
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        scheduled_at: scheduledAt,
        passengers: formData.passengers,
        luggages: formData.luggages,
        ride_type: formData.ride_type,
        notes: formData.notes || undefined
      }
      riderBookingMutation.mutate(riderBookingData)
    } else {
      // Guest booking - include all fields
      const guestBookingData: BookingGuestReq = {
        rider_name: formData.rider_name,
        rider_email: formData.rider_email,
        rider_phone: formData.rider_phone,
        pickup: formData.pickup,
        dropoff: formData.dropoff,
        scheduled_at: scheduledAt,
        passengers: formData.passengers,
        luggages: formData.luggages,
        ride_type: formData.ride_type,
        notes: formData.notes || undefined
      }
      guestBookingMutation.mutate(guestBookingData)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const isLoading = guestBookingMutation.isPending || riderBookingMutation.isPending
  const error = guestBookingMutation.error || riderBookingMutation.error

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Book Your Luxury SUV</h1>
            {isAuthenticated ? (
              <p className="text-sm text-green-600 mt-2">
                Booking as registered user: {user?.name}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Guest booking - no account required
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information - Only show for guests */}
            {!isAuthenticated && (
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
            )}

            {/* Pre-filled info for authenticated users */}
            {isAuthenticated && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={user?.phone || ''}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

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
                    placeholder="Enter pickup address"
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
                    placeholder="Enter destination address"
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

            {/* Service Options */}
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

            {/* Special Notes */}
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
                placeholder="Any special requirements, flight details, or instructions..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm font-medium">
                  {error.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isAuthenticated ? 'Creating Booking...' : 'Creating Booking...'}
                </span>
              ) : (
                `Book Now ${isAuthenticated ? '(Registered User)' : '(Guest)'}`
              )}
            </button>

            {/* Additional Info */}
            {!isAuthenticated && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Want to manage your bookings easily?
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: '/register' })}
                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                >
                  Create an account
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}