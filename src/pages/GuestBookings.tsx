import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useToast } from '../components/ui/Toast'
import { BookingsList } from '../components/BookingsList'
import { RouteGuard } from '../components/RouteGuard'
import type { Booking } from '../lib/api-types'

export function GuestBookings() {
  return (
    <RouteGuard requiresGuestAuth>
      <GuestBookingsContent />
    </RouteGuard>
  )
}

function GuestBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const { guestEmail, clearGuestAuth } = useAuthStore()
  const { showToast } = useToast()

  const loadBookings = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<Booking[]>('/v1/guest/bookings')
      setBookings(response.data)
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        showToast('Session expired. Please verify your email again.', 'error')
        clearGuestAuth()
        navigate('/guest/access')
      } else {
        showToast(message || 'Failed to load bookings', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleBookingClick = (booking: Booking) => {
    navigate(`/guest/bookings/${booking.id}`)
  }

  const handleSignOut = () => {
    clearGuestAuth()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LuxRide</h1>
              {guestEmail && (
                <span className="text-gray-600">Guest: {guestEmail}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                New Booking
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Bookings</h2>
        </div>
        
        <BookingsList
          bookings={bookings}
          onBookingClick={handleBookingClick}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}