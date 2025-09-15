import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listBookings } from '../api/bookings'
import { BookingStatus } from '../types/booking'

export function BookingList() {
  const [filters, setFilters] = useState({
    status: '' as BookingStatus | '',
    limit: 20,
    offset: 0,
  })

  const bookingsQuery = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => listBookings(filters.status ? { ...filters, status: filters.status } : filters),
  })

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

  const handleStatusFilter = (status: BookingStatus | '') => {
    setFilters(prev => ({ ...prev, status, offset: 0 }))
  }

  const handlePagination = (direction: 'prev' | 'next') => {
    setFilters(prev => ({
      ...prev,
      offset: direction === 'next' 
        ? prev.offset + prev.limit 
        : Math.max(0, prev.offset - prev.limit)
    }))
  }

  if (bookingsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading bookings...</div>
      </div>
    )
  }

  if (bookingsQuery.error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">
            Error loading bookings: {bookingsQuery.error.message}
          </p>
        </div>
      </div>
    )
  }

  const bookings = bookingsQuery.data || []

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value as BookingStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="on_trip">On Trip</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookings found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Booking #{booking.id}</h3>
                    <p className="text-sm text-gray-600">{booking.rider_name} • {booking.rider_phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Trip Details</p>
                    <p className="text-gray-600">From: {booking.pickup}</p>
                    <p className="text-gray-600">To: {booking.dropoff}</p>
                    <p className="text-gray-600">When: {formatDate(booking.scheduled_at)}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700">Service Info</p>
                    <p className="text-gray-600">Passengers: {booking.passengers}</p>
                    <p className="text-gray-600">Luggage: {booking.luggages}</p>
                    <p className="text-gray-600">Type: {booking.ride_type.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700">Booking Info</p>
                    <p className="text-gray-600">Created: {formatDate(booking.created_at)}</p>
                    <p className="text-gray-600">Updated: {formatDate(booking.updated_at)}</p>
                    {booking.driver_id && <p className="text-gray-600">Driver ID: {booking.driver_id}</p>}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                    <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePagination('prev')}
              disabled={filters.offset === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Showing {filters.offset + 1} - {filters.offset + bookings.length}
            </span>

            <button
              onClick={() => handlePagination('next')}
              disabled={bookings.length < filters.limit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}