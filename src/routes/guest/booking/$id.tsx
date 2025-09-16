import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getGuestBookingById, cancelGuestBooking } from '../../../api/guestBookings'

export const Route = createFileRoute('/guest/booking/$id')({
  component: GuestBookingManagePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      manage_token: search.manage_token as string,
    }
  },
})

function GuestBookingManagePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const { manage_token } = Route.useSearch()

  const bookingQuery = useQuery({
    queryKey: ['guest-booking', id, manage_token],
    queryFn: () => getGuestBookingById(parseInt(id), manage_token),
    enabled: !!id && !!manage_token,
    retry: false,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelGuestBooking(parseInt(id), manage_token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-booking', id, manage_token] })
    },
  })

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

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

  if (!manage_token || !id) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-gray-600 mb-6">Missing booking ID or management token.</p>
          <button
            onClick={() => navigate({ to: '/guest/book' })}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Book a New Ride
          </button>
        </div>
      </div>
    )
  }

  if (bookingQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading booking details...</div>
      </div>
    )
  }

  if (bookingQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-red-600 mb-6">{bookingQuery.error.message}</p>
            <button
              onClick={() => navigate({ to: '/guest/book' })}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Book a New Ride
            </button>
          </div>
        </div>
      </div>
    )
  }

  const booking = bookingQuery.data

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {booking.rider_name}</p>
                <p><span className="font-medium">Email:</span> {booking.rider_email}</p>
                <p><span className="font-medium">Phone:</span> {booking.rider_phone}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Trip Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Pickup:</span> {booking.pickup}</p>
                <p><span className="font-medium">Dropoff:</span> {booking.dropoff}</p>
                <p><span className="font-medium">Scheduled:</span> {formatDate(booking.scheduled_at)}</p>
                <p><span className="font-medium">Passengers:</span> {booking.passengers}</p>
                <p><span className="font-medium">Luggage:</span> {booking.luggages}</p>
                <p><span className="font-medium">Type:</span> {booking.ride_type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Special Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{booking.notes}</p>
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Created: {formatDate(booking.created_at)}</p>
              <p>Last Updated: {formatDate(booking.updated_at)}</p>
              {booking.driver_id && <p>Driver ID: {booking.driver_id}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate({ to: '/guest/book' })}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center"
            >
              Book Another Ride
            </button>
            
            {booking.status !== 'canceled' && booking.status !== 'completed' && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="flex-1 border border-red-300 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelMutation.isPending ? 'Canceling...' : 'Cancel Booking'}
              </button>
            )}
          </div>

          {cancelMutation.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{cancelMutation.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}