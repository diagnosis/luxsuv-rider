import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { apiClient } from '../lib/api'
import { guestBookingUpdateSchema, type GuestBookingUpdateData } from '../lib/schemas'
import { useToast } from './ui/Toast'
import type { Booking } from '../lib/api-types'

interface BookingDetailProps {
  booking: Booking
  canEdit: boolean
  canCancel: boolean
  onUpdate: () => void
  onCancel?: () => void
}

export function BookingDetail({ booking, canEdit, canCancel, onUpdate, onCancel }: BookingDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<GuestBookingUpdateData>({
    resolver: zodResolver(guestBookingUpdateSchema),
    defaultValues: {
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      scheduled_at: new Date(booking.scheduled_at).toISOString().slice(0, 16),
      notes: booking.notes || '',
      passengers: booking.passengers,
      luggages: booking.luggages,
      ride_type: booking.ride_type,
    }
  })

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
      return format(new Date(dateString), 'MMMM d, yyyy • h:mm a')
    } catch {
      return dateString
    }
  }

  const onSubmit = async (data: GuestBookingUpdateData) => {
    setIsSubmitting(true)
    try {
      // Only send fields that have changed
      const changes: Partial<GuestBookingUpdateData> = {}
      Object.keys(data).forEach((key) => {
        const field = key as keyof GuestBookingUpdateData
        const newValue = data[field]
        const originalValue = field === 'scheduled_at' 
          ? new Date(booking.scheduled_at).toISOString().slice(0, 16)
          : booking[field as keyof Booking]
        
        if (newValue !== originalValue && newValue !== undefined) {
          if (field === 'scheduled_at' && typeof newValue === 'string') {
            ;(changes as any)[field] = new Date(newValue).toISOString()
          } else {
            ;(changes as any)[field] = newValue
          }
        }
      })

      if (Object.keys(changes).length === 0) {
        setIsEditing(false)
        return
      }

      const url = booking.manage_token
        ? `/v1/bookings/guest/${booking.id}?manage_token=${booking.manage_token}`
        : `/v1/guest/bookings/${booking.id}`

      await apiClient.patch(url, changes)
      showToast('Booking updated successfully!', 'success')
      setIsEditing(false)
      onUpdate()
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 400) {
        showToast('Please check your booking details', 'error')
      } else if (status === 401) {
        showToast('Session expired. Please log in again.', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Failed to update booking. Please try again.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?') || !onCancel) {
      return
    }

    setIsSubmitting(true)
    try {
      const url = booking.manage_token
        ? `/v1/bookings/guest/${booking.id}?manage_token=${booking.manage_token}`
        : `/v1/guest/bookings/${booking.id}`

      await apiClient.delete(url)
      showToast('Booking cancelled successfully', 'success')
      onCancel()
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        showToast('Session expired. Please log in again.', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Failed to cancel booking. Please try again.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Booking #{booking.id}</h2>
          <button
            onClick={() => {
              setIsEditing(false)
              reset()
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                {...register('pickup')}
                type="text"
                id="pickup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.pickup && <p className="text-sm text-red-600 mt-1">{errors.pickup.message}</p>}
            </div>

            <div>
              <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </label>
              <input
                {...register('dropoff')}
                type="text"
                id="dropoff"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.dropoff && <p className="text-sm text-red-600 mt-1">{errors.dropoff.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date & Time
            </label>
            <input
              {...register('scheduled_at')}
              type="datetime-local"
              id="scheduled_at"
              min={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.scheduled_at && <p className="text-sm text-red-600 mt-1">{errors.scheduled_at.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                Passengers (1-8)
              </label>
              <input
                {...register('passengers', { valueAsNumber: true })}
                type="number"
                id="passengers"
                min="1"
                max="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.passengers && <p className="text-sm text-red-600 mt-1">{errors.passengers.message}</p>}
            </div>

            <div>
              <label htmlFor="luggages" className="block text-sm font-medium text-gray-700 mb-1">
                Luggage (0-10)
              </label>
              <input
                {...register('luggages', { valueAsNumber: true })}
                type="number"
                id="luggages"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.luggages && <p className="text-sm text-red-600 mt-1">{errors.luggages.message}</p>}
            </div>

            <div>
              <label htmlFor="ride_type" className="block text-sm font-medium text-gray-700 mb-1">
                Ride Type
              </label>
              <select
                {...register('ride_type')}
                id="ride_type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="per_ride">Per Ride</option>
                <option value="hourly">Hourly</option>
              </select>
              {errors.ride_type && <p className="text-sm text-red-600 mt-1">{errors.ride_type.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Special Notes
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Booking'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking #{booking.id}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        {(booking.rider_name || booking.rider_email) && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              {booking.rider_name && <p><span className="font-medium">Name:</span> {booking.rider_name}</p>}
              {booking.rider_email && <p><span className="font-medium">Email:</span> {booking.rider_email}</p>}
              {booking.rider_phone && <p><span className="font-medium">Phone:</span> {booking.rider_phone}</p>}
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Trip Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">From:</span> {booking.pickup}</p>
            <p><span className="font-medium">To:</span> {booking.dropoff}</p>
            <p><span className="font-medium">Scheduled:</span> {formatDateTime(booking.scheduled_at)}</p>
            <p><span className="font-medium">Passengers:</span> {booking.passengers}</p>
            <p><span className="font-medium">Luggage:</span> {booking.luggages}</p>
            <p><span className="font-medium">Type:</span> {booking.ride_type.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {booking.notes && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Special Notes</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{booking.notes}</p>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <div className="text-xs text-gray-500 space-y-1">
          <p>Created: {formatDateTime(booking.created_at)}</p>
          <p>Last Updated: {formatDateTime(booking.updated_at)}</p>
          {booking.driver_id && <p>Driver ID: {booking.driver_id}</p>}
        </div>
      </div>

      {(canEdit || canCancel) && booking.status !== 'completed' && booking.status !== 'canceled' && (
        <div className="flex space-x-3 mt-6">
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Booking
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 border border-red-300 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}