import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useBookings } from '../../../hooks/useBookings'
import { BookingsList } from '../../../components/BookingsList'
import { BookingDetail } from '../../../components/BookingDetail'
import { BookingForm } from '../../../components/BookingForm'
import { Button } from '../../../components/ui/Button'
import type { Booking } from '../../../lib/api-types'

export const Route = createFileRoute('/rider/bookings/')({
  component: RiderBookingsPage,
})

function RiderBookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list')
  
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { bookings, isLoading, createRiderBooking, refetch } = useBookings()

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setView('detail')
  }

  const handleBookingSuccess = () => {
    setView('list')
    refetch()
  }

  const handleUpdate = () => {
    refetch()
  }

  const handleCancel = () => {
    setView('list')
    refetch()
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
                <Button
                  onClick={() => setView('create')}
                >
                  New Booking
                </Button>
              )}
              <button
                onClick={logout}
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
              <Button
                variant="ghost"
                onClick={() => setView('list')}
                className="mr-4"
              >
                ← Back to bookings
              </Button>
              <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
            </div>
            <BookingDetail
              booking={selectedBooking}
              canEdit={false}
              canCancel={true}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          </div>
        )}

        {view === 'create' && (
          <div>
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setView('list')}
                className="mr-4"
              >
                ← Back to bookings
              </Button>
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