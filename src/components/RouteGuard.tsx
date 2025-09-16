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
  const hasManageToken = allowManageToken && !!manageToken

  useEffect(() => {
    // Only check auth on mount and when auth state changes
    const checkAuth = () => {
      if (requiresRiderAuth && !jwt) {
        console.log('Rider auth required, redirecting to login')
        navigate('/login', { replace: true })
        return
      }

      if (requiresGuestAuth && !guestSessionToken && !hasManageToken) {
        console.log('Guest auth required, redirecting to guest access')
        navigate('/guest/access', { replace: true })
        return
      }
    }

    // Small delay to prevent immediate redirect loops
    const timer = setTimeout(checkAuth, 50)
    return () => clearTimeout(timer)
  }, [jwt, guestSessionToken, hasManageToken, requiresRiderAuth, requiresGuestAuth, navigate])

  // Show loading only briefly
  if (requiresRiderAuth && !jwt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requiresGuestAuth && !guestSessionToken && !hasManageToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}