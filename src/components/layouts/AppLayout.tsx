import { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { useNavigate } from '@tanstack/react-router'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  showBackButton?: boolean
  backTo?: string
  actions?: ReactNode
}

export function AppLayout({ 
  children, 
  title, 
  showHeader = true,
  showBackButton = false,
  backTo = '/',
  actions
}: AppLayoutProps) {
  const { logout, user, guestEmail, isRiderAuthenticated, isGuestAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!showHeader) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: backTo })}
                  className="mr-2"
                >
                  ← Back
                </Button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {title || 'LuxRide'}
              </h1>
              {isRiderAuthenticated && user && (
                <span className="text-gray-600">Welcome, {user.name}</span>
              )}
              {isGuestAuthenticated && guestEmail && (
                <span className="text-gray-600">Guest: {guestEmail}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {actions}
              
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="secondary"
              >
                New Booking
              </Button>
              
              {(isRiderAuthenticated || isGuestAuthenticated) && (
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export function GuestLayout({ children, title }: { children: ReactNode, title?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {title || 'LuxRide'}
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}