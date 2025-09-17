import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { toast } from 'sonner'
import type { Booking, GuestBookingResponse } from '../lib/api-types'

export function useBookings() {
  const { isRiderAuthenticated, isGuestAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // List bookings query
  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: () => {
      if (isRiderAuthenticated) {
        return api.listRiderBookings() as Promise<Booking[]>
      } else if (isGuestAuthenticated) {
        return api.listGuestBookings() as Promise<Booking[]>
      }
      throw new Error('Not authenticated')
    },
    enabled: isRiderAuthenticated || isGuestAuthenticated,
  })

  // Create booking mutations
  const createGuestBookingMutation = useMutation({
    mutationFn: (data: any) => api.createGuestBooking(data) as Promise<GuestBookingResponse>,
    onSuccess: (newBooking) => {
      toast.success('Booking created successfully!')
      // Invalidate bookings if user is authenticated
      if (isGuestAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
      }
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to create booking'
      toast.error(message)
    },
  })

  const createRiderBookingMutation = useMutation({
    mutationFn: (data: any) => api.createRiderBooking(data) as Promise<Booking>,
    onSuccess: (newBooking) => {
      queryClient.setQueryData(['bookings'], (old: Booking[] = []) => 
        [newBooking, ...old]
      )
      toast.success('Booking created successfully!')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to create booking'
      toast.error(message)
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
    queryFn: () => api.getGuestBooking(id, manageToken) as Promise<Booking>,
    enabled: !!id,
  })

  const updateBookingMutation = useMutation({
    mutationFn: (data: any) => api.updateGuestBooking(id, data, manageToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id, manageToken] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking updated successfully!')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to update booking'
      toast.error(message)
    },
  })

  const cancelBookingMutation = useMutation({
    mutationFn: () => api.cancelGuestBooking(id, manageToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id, manageToken] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking cancelled successfully')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to cancel booking'
      toast.error(message)
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