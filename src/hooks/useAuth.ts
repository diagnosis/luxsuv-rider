import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth'
import { api } from '../lib/api'
import { toast } from 'sonner'
import type { LoginResponse, GuestAccessResponse } from '../lib/api-types'

export function useAuth() {
  const { jwt, user, guestSessionToken, guestEmail, setRiderAuth, setGuestAuth, clearRiderAuth, clearGuestAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const registerMutation = useMutation({
    mutationFn: (data: any) => api.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Check your email to verify your account.')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Registration failed'
      toast.error(message)
    },
  })

  const loginMutation = useMutation({
    mutationFn: (data: any) => api.login(data) as Promise<LoginResponse>,
    onSuccess: (data) => {
      setRiderAuth(data.access_token, data.user)
      toast.success('Welcome back!')
      router.navigate({ to: '/rider/bookings' })
    },
    onError: (error: any) => {
      const message = error.status === 401 
        ? 'Invalid email or password'
        : error.details || error.message || 'Login failed'
      toast.error(message)
    },
  })

  const requestAccessMutation = useMutation({
    mutationFn: (email: string) => api.requestGuestAccess(email),
    onSuccess: () => {
      toast.success('Access code sent to your email!')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to send access code'
      toast.error(message)
    },
  })

  const verifyAccessMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      api.verifyGuestAccess(email, code) as Promise<GuestAccessResponse>,
    onSuccess: (data, variables) => {
      setGuestAuth(data.session_token, variables.email)
      toast.success('Access granted!')
      router.navigate({ to: '/guest/bookings' })
    },
    onError: (error: any) => {
      const message = error.status === 401
        ? 'Invalid verification code'
        : error.details || error.message || 'Verification failed'
      toast.error(message)
    },
  })

  const logout = () => {
    clearRiderAuth()
    clearGuestAuth()
    queryClient.clear()
    router.navigate({ to: '/' })
  }

  return {
    // State
    user,
    jwt,
    guestEmail,
    isRiderAuthenticated: !!(jwt && user),
    isGuestAuthenticated: !!(guestSessionToken && guestEmail),
    isAuthenticated: !!(jwt && user) || !!(guestSessionToken && guestEmail),

    // Actions
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    
    requestAccess: requestAccessMutation.mutate,
    isRequestingAccess: requestAccessMutation.isPending,
    
    verifyAccess: verifyAccessMutation.mutate,
    isVerifyingAccess: verifyAccessMutation.isPending,
    
    logout,
  }
}