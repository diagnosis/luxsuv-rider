import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

interface RouteGuardProps {
  children: React.ReactNode
  requiresRiderAuth?: boolean
  requiresGuestAuth?: boolean
  allowManageToken?: boolean
}

export function RouteGuard({ 
  children, 
  requiresRiderAuth = false, 
  requiresGuestAuth = false,
  allowManageToken = false 
}: RouteGuardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { jwt, guestSessionToken } = useAuthStore()
  
  // Check for manage_token in query params
  const searchParams = new URLSearchParams(location.search)
  const manageToken = searchParams.get('manage_token')

  useEffect(() => {
    let shouldRedirect = false
    let redirectPath = '/'

    if (requiresRiderAuth && !jwt) {
      shouldRedirect = true
      redirectPath = '/login'
    }

    if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
      shouldRedirect = true
      redirectPath = '/guest/access'
    }

    if (shouldRedirect) {
      // Use timeout to prevent immediate redirect loops
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [jwt, guestSessionToken, manageToken, requiresRiderAuth, requiresGuestAuth, allowManageToken, navigate])

  // Simple access checks
  if (requiresRiderAuth && !jwt) {
    return null
  }

  if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
    return null
  }

  return <>{children}</>
}