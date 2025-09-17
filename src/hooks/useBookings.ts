import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useToast } from '../components/ui/Toast'
import { analytics } from '../lib/analytics'
import type { Booking, GuestBookingResponse } from '../lib/api-types'

export function useBookings() {
  const { isRiderAuthenticated, isGuestAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // List bookings query
  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: () => {
      if (isRiderAuthenticated) {
        return apiClient.listRiderBookings() as Promise<Booking[]>
      } else if (isGuestAuthenticated) {
        return apiClient.listGuestBookings() as Promise<Booking[]>
      }
      throw new Error('Not authenticated')
    },
    enabled: isRiderAuthenticated || isGuestAuthenticated,
  })

  // Create booking mutations
  const createGuestBookingMutation = useMutation({
    mutationFn: (data: any) => apiClient.createGuestBooking(data) as Promise<GuestBookingResponse>,
    onSuccess: (newBooking) => {
      analytics.trackBookingCreated(newBooking.id.toString())
      showToast('Booking created successfully!', 'success')
      // Invalidate bookings if user is authenticated
      if (isGuestAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
      }
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to create booking'
      showToast(message, 'error')
    },
  })

  const createRiderBookingMutation = useMutation({
    mutationFn: (data: any) => apiClient.createRiderBooking(data) as Promise<Booking>,
    onSuccess: (newBooking) => {
      queryClient.setQueryData(['bookings'], (old: Booking[] = []) => 
        [newBooking, ...old]
      )
      analytics.trackBookingCreated(newBooking.id.toString())
      showToast('Booking created successfully!', 'success')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to create booking'
      showToast(message, 'error')
    },
  })

  return {
    // Queries
    bookings: bookingsQuery.data ?? [],
    isLoading: bookingsQuery.isLoading,
    error: bookingsQuery.error,

    // Mutations
    createGuestBooking: createGuestBookingMutation.mutate,
    isCreatingGuestBooking: createGuestBookingMutation.isPending,

    createRiderBooking: createRiderBookingMutation.mutate,
    isCreatingRiderBooking: createRiderBookingMutation.isPending,

    // Utils
    refetch: bookingsQuery.refetch,
  }
}

export function useBooking(id: string, manageToken?: string) {
  const queryClient = useQueryClient()

  const bookingQuery = useQuery({
    queryKey: ['booking', id, manageToken],
    queryFn: () => apiClient.getGuestBooking(id, manageToken) as Promise<Booking>,
    enabled: !!id,
  })

  const { showToast } = useToast()

  const updateBookingMutation = useMutation({
    mutationFn: (data: any) => apiClient.updateGuestBooking(id, data, manageToken),
    onSuccess: () => {
      analytics.trackBookingUpdated(id)
      queryClient.invalidateQueries({ queryKey: ['booking', id, manageToken] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      showToast('Booking updated successfully!', 'success')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to update booking'
      showToast(message, 'error')
    },
  })

  const cancelBookingMutation = useMutation({
    mutationFn: () => apiClient.cancelGuestBooking(id, manageToken),
    onSuccess: () => {
      analytics.trackBookingCancelled(id)
      queryClient.invalidateQueries({ queryKey: ['booking', id, manageToken] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      showToast('Booking cancelled successfully', 'success')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to cancel booking'
      showToast(message, 'error')
    },
  })

  return {
    booking: bookingQuery.data,
    isLoading: bookingQuery.isLoading,
    error: bookingQuery.error,

    updateBooking: updateBookingMutation.mutate,
    isUpdating: updateBookingMutation.isPending,

    cancelBooking: cancelBookingMutation.mutate,
    isCancelling: cancelBookingMutation.isPending,
  }
}

// Re-export auth hook here for convenience
function useAuth() {
  const { jwt, user, guestSessionToken, guestEmail } = useAuthStore()
  
  return {
    isRiderAuthenticated: !!(jwt && user),
    isGuestAuthenticated: !!(guestSessionToken && guestEmail),
    isAuthenticated: !!(jwt && user) || !!(guestSessionToken && guestEmail),
  }
}