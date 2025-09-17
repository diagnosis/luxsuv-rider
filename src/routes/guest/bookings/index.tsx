import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../hooks/useAuth'
import { useBookings } from '../../../hooks/useBookings'
import { BookingsList } from '../../../components/BookingsList'
import { Button } from '../../../components/ui/Button'

export const Route = createFileRoute('/guest/bookings/')({
  component: GuestBookingsPage,
  beforeLoad: ({ context }) => {
    // Will implement auth context later
  },
})

function GuestBookingsPage() {
  const navigate = useNavigate()
  const { logout, guestEmail } = useAuth()
  const { bookings, isLoading } = useBookings()

  const handleBookingClick = (booking: any) => {
    navigate({
      to: '/guest/bookings/$bookingId',
      params: { bookingId: booking.id.toString() },
    })
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
              <Button
                onClick={() => navigate({ to: '/' })}
              >
                New Booking
              </Button>
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