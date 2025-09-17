import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth'
import { apiClient } from '../lib/api'
import { useToast } from '../components/ui/Toast'
import { analytics } from '../lib/analytics'
import type { LoginResponse, GuestAccessResponse } from '../lib/api-types'

export function useAuth() {
  const { jwt, user, guestSessionToken, guestEmail, setRiderAuth, setGuestAuth, clearRiderAuth, clearGuestAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { showToast } = useToast()

  const registerMutation = useMutation({
    mutationFn: (data: any) => apiClient.register(data),
    onSuccess: () => {
      analytics.trackUserRegister()
      showToast('Registration successful! Check your email to verify your account.', 'success')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Registration failed'
      showToast(message, 'error')
    },
  })

  const loginMutation = useMutation({
    mutationFn: (data: any) => apiClient.login(data) as Promise<LoginResponse>,
    onSuccess: (data) => {
      setRiderAuth(data.access_token, data.user)
      analytics.trackUserLogin('email')
      showToast('Welcome back!', 'success')
      router.navigate({ to: '/rider/bookings' })
    },
    onError: (error: any) => {
      const message = error.status === 401 
        ? 'Invalid email or password'
        : error.details || error.message || 'Login failed'
      showToast(message, 'error')
    },
  })

  const requestAccessMutation = useMutation({
    mutationFn: (email: string) => apiClient.requestGuestAccess(email),
    onSuccess: (_, variables) => {
      analytics.trackEmailVerification(variables)
      showToast('Access code sent to your email!', 'success')
    },
    onError: (error: any) => {
      const message = error.details || error.message || 'Failed to send access code'
      showToast(message, 'error')
    },
  })

  const verifyAccessMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => 
      apiClient.verifyGuestAccess(email, code) as Promise<GuestAccessResponse>,
    onSuccess: (data, variables) => {
      setGuestAuth(data.session_token, variables.email)
      analytics.trackUserLogin('guest')
      showToast('Access granted!', 'success')
      router.navigate({ to: '/guest/bookings' })
    },
    onError: (error: any) => {
      const message = error.status === 401
        ? 'Invalid verification code'
        : error.details || error.message || 'Verification failed'
      showToast(message, 'error')
    },
  })

  const logout = () => {
    clearRiderAuth()
    clearGuestAuth()
    queryClient.clear()
    showToast('Signed out successfully', 'info')
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