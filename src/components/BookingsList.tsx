import { format } from 'date-fns'
import type { Booking } from '../lib/api-types'

interface BookingsListProps {
  bookings: Booking[]
  onBookingClick: (booking: Booking) => void
  isLoading: boolean
}

export function BookingsList({ bookings, onBookingClick, isLoading }: BookingsListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">You haven't made any bookings yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onClick={() => onBookingClick(booking)}
        />
      ))}
    </div>
  )
}

interface BookingCardProps {
  booking: Booking
  onClick: () => void
}

function BookingCard({ booking, onClick }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'assigned':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'on_trip':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a')
    } catch {
      return dateString
    }
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking.id}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDateTime(booking.scheduled_at)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700">From</p>
          <p className="text-sm text-gray-600 truncate">{booking.pickup}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">To</p>
          <p className="text-sm text-gray-600 truncate">{booking.dropoff}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex space-x-4">
          <span>{booking.passengers} passenger{booking.passengers !== 1 ? 's' : ''}</span>
          <span>{booking.luggages} luggage</span>
          <span className="capitalize">{booking.ride_type.replace('_', ' ')}</span>
        </div>
        <span className="text-blue-600 hover:text-blue-800">
          View details →
        </span>
      </div>
    </div>
  )
}