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
    if (requiresRiderAuth && !jwt) {
      navigate('/login', { replace: true })
      return
    }

    if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
      navigate('/guest/access', { replace: true })
      return
    }
  }, [jwt, guestSessionToken, manageToken, requiresRiderAuth, requiresGuestAuth, allowManageToken, navigate])

  // Don't show loading screen, just let the useEffect handle redirects

  // Quick auth checks without loading screens
  if (requiresRiderAuth && !jwt) {
    return null // Let useEffect redirect
  }

  if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
    return null // Let useEffect redirect
  }

  return <>{children}</>
}