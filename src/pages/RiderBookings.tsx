import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useToast } from '../components/ui/Toast'
import { BookingsList } from '../components/BookingsList'
import { BookingDetail } from '../components/BookingDetail'
import { BookingForm } from '../components/BookingForm'
import { RouteGuard } from '../components/RouteGuard'
import type { Booking } from '../lib/api-types'

export function RiderBookings() {
  return (
    <RouteGuard requiresRiderAuth>
      <RiderBookingsContent />
    </RouteGuard>
  )
}

function RiderBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const { user, clearRiderAuth } = useAuthStore()
  const { showToast } = useToast()

  const loadBookings = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<Booking[]>('/v1/rider/bookings')
      setBookings(response.data)
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        showToast('Session expired. Please log in again.', 'error')
        clearRiderAuth()
        navigate('/')
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
    setSelectedBooking(booking)
    setView('detail')
  }

  const handleBookingSuccess = () => {
    setView('list')
    loadBookings()
  }

  const handleSignOut = () => {
    clearRiderAuth()
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
              {user && (
                <span className="text-gray-600">Welcome, {user.name}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {view === 'list' && (
                <button
                  onClick={() => setView('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  New Booking
                </button>
              )}
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
        {view === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Your Bookings</h2>
            </div>
            <BookingsList
              bookings={bookings}
              onBookingClick={handleBookingClick}
              isLoading={isLoading}
            />
          </div>
        )}

        {view === 'detail' && selectedBooking && (
          <div>
            <div className="flex items-center mb-8">
              <button
                onClick={() => setView('list')}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to bookings
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
            </div>
            <BookingDetail
              booking={selectedBooking}
              canEdit={false}
              canCancel={true}
              onUpdate={loadBookings}
              onCancel={() => {
                setView('list')
                loadBookings()
              }}
            />
          </div>
        )}

        {view === 'create' && (
          <div>
            <div className="flex items-center mb-8">
              <button
                onClick={() => setView('list')}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to bookings
              </button>
              <h2 className="text-3xl font-bold text-gray-900">New Booking</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <BookingForm
                isGuest={false}
                onSuccess={handleBookingSuccess}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}