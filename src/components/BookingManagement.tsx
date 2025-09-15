import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getBookingById, cancelBooking } from '../api/bookings'
import { BookingDTO } from '../types/booking'

export function BookingManagement() {
  const [bookingId, setBookingId] = useState('')
  const [manageToken, setManageToken] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)

  const bookingQuery = useQuery({
    queryKey: ['booking', bookingId, manageToken],
    queryFn: () => getBookingById(parseInt(bookingId), manageToken),
    enabled: shouldFetch && !!bookingId && !!manageToken,
    retry: false,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(parseInt(bookingId), manageToken),
    onSuccess: () => {
      bookingQuery.refetch()
    },
  })

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    if (bookingId && manageToken) {
      setShouldFetch(true)
    }
  }

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Manage Your Booking</h2>

      <form onSubmit={handleLookup} className="space-y-4 mb-8">
        <div className="relative z-0 w-full group">
          <input
            type="number"
            name="booking_id"
            id="booking_id"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="booking_id"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Booking ID
          </label>
        </div>

        <div className="relative z-0 w-full group">
          <input
            type="text"
            name="manage_token"
            id="manage_token"
            value={manageToken}
            onChange={(e) => setManageToken(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="manage_token"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Management Token
          </label>
        </div>

        <button
          type="submit"
          disabled={bookingQuery.isLoading}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
        >
          {bookingQuery.isLoading ? 'Looking up...' : 'Look Up Booking'}
        </button>
      </form>

      {bookingQuery.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <p className="text-red-600">
            {bookingQuery.error.message}
          </p>
        </div>
      )}

      {bookingQuery.data && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Booking #{bookingQuery.data.id}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bookingQuery.data.status)}`}>
              {bookingQuery.data.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Rider Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {bookingQuery.data.rider_name}</p>
                <p><span className="font-medium">Email:</span> {bookingQuery.data.rider_email}</p>
                <p><span className="font-medium">Phone:</span> {bookingQuery.data.rider_phone}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Trip Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Pickup:</span> {bookingQuery.data.pickup}</p>
                <p><span className="font-medium">Dropoff:</span> {bookingQuery.data.dropoff}</p>
                <p><span className="font-medium">Scheduled:</span> {formatDate(bookingQuery.data.scheduled_at)}</p>
                <p><span className="font-medium">Passengers:</span> {bookingQuery.data.passengers}</p>
                <p><span className="font-medium">Luggage:</span> {bookingQuery.data.luggages}</p>
                <p><span className="font-medium">Type:</span> {bookingQuery.data.ride_type.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {bookingQuery.data.notes && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{bookingQuery.data.notes}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 mb-4">
            <p>Created: {formatDate(bookingQuery.data.created_at)}</p>
            <p>Updated: {formatDate(bookingQuery.data.updated_at)}</p>
            {bookingQuery.data.driver_id && <p>Driver ID: {bookingQuery.data.driver_id}</p>}
          </div>

          {bookingQuery.data.status !== 'canceled' && bookingQuery.data.status !== 'completed' && (
            <div className="border-t pt-4">
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Canceling...' : 'Cancel Booking'}
              </button>
            </div>
          )}

          {cancelMutation.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{cancelMutation.error.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}