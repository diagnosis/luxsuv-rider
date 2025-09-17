import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useBooking } from '../../../hooks/useBookings'
import { useAuth } from '../../../hooks/useAuth'
import { BookingDetail } from '../../../components/BookingDetail'
import { Button } from '../../../components/ui/Button'

type BookingDetailSearch = {
  manage_token?: string
}

export const Route = createFileRoute('/guest/bookings/$bookingId')({
  component: GuestBookingDetailPage,
  validateSearch: (search: Record<string, unknown>): BookingDetailSearch => {
    return {
      manage_token: search.manage_token as string,
    }
  },
})

function GuestBookingDetailPage() {
  const { bookingId } = Route.useParams()
  const { manage_token } = useSearch({ from: '/guest/bookings/$bookingId' })
  const navigate = useNavigate()
  
  const { booking, isLoading, updateBooking, cancelBooking } = useBooking(bookingId, manage_token)
  const { logout, guestEmail } = useAuth()
  
  const isUsingManageToken = !!manage_token

  const handleUpdate = () => {
    // Booking will be automatically updated via React Query
  }

  const handleCancel = () => {
    if (manage_token) {
      navigate({ to: '/' })
    } else {
      navigate({ to: '/guest/bookings' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="secondary"
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LuxRide</h1>
              {isUsingManageToken && (
                <span className="text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded">
                  Guest Access
                </span>
              )}
              {guestEmail && !isUsingManageToken && (
                <span className="text-gray-600">Guest: {guestEmail}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate({ to: '/' })}
              >
                New Booking
              </Button>
              
              {!isUsingManageToken && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate({ to: '/guest/bookings' })}
                  >
                    All Bookings
                  </Button>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (manage_token) {
                navigate({ to: '/' })
              } else {
                navigate({ to: '/guest/bookings' })
              }
            }}
            className="mr-4"
          >
            ← Back
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
        </div>
        
        {isUsingManageToken && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Guest Management Access:</strong> You can view and edit this booking using your management link.{' '}
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/guest/access' })}
                className="underline hover:text-blue-900 font-medium p-0 h-auto"
              >
                Access all your bookings
              </Button>
            </p>
          </div>
        )}
        
        <BookingDetail
          booking={booking}
          canEdit={true}
          canCancel={true}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}