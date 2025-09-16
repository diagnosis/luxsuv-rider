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
      navigate('/', { replace: true })
      return
    }

    if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
      navigate('/guest/access', { replace: true })
      return
    }
  }, [jwt, guestSessionToken, manageToken, requiresRiderAuth, requiresGuestAuth, allowManageToken, navigate])

  // Show loading while checking auth
  if (requiresRiderAuth && !jwt) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  }

  if (requiresGuestAuth && !guestSessionToken && !(allowManageToken && manageToken)) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Checking access...</p>
      </div>
    </div>
  }

  return <>{children}</>
}