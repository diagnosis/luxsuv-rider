import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useToast } from '../components/ui/Toast'
import { BookingDetail } from '../components/BookingDetail'
import { RouteGuard } from '../components/RouteGuard'
import type { Booking } from '../lib/api-types'

export function GuestBookingDetailPage() {
  return (
    <RouteGuard requiresGuestAuth allowManageToken>
      <GuestBookingDetailContent />
    </RouteGuard>
  )
}

function GuestBookingDetailContent() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { guestSessionToken, clearGuestAuth } = useAuthStore()
  const { showToast } = useToast()
  
  const manageToken = searchParams.get('manage_token')
  const isUsingManageToken = !!manageToken

  const loadBooking = async () => {
    if (!id) return
    
    console.log('GuestBookingDetail: Loading booking', { id, manageToken, hasGuestToken: !!guestSessionToken })
    setIsLoading(true)
    try {
      let url = `/v1/guest/bookings/${id}`
      if (isUsingManageToken) {
        url += `?manage_token=${encodeURIComponent(manageToken!)}`
      } else {
        console.log('GuestBookingDetail: No manage token available, trying with session auth only')
      }
      
      console.log('GuestBookingDetail: Making request to:', url, 'isUsingManageToken:', isUsingManageToken)
      const response = await apiClient.get<Booking>(url)
      console.log('GuestBookingDetail: Success! Booking loaded:', response.data)
      setBooking({ ...response.data, manage_token: manageToken || undefined })
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        if (isUsingManageToken) {
          showToast('Invalid management token', 'error')
          navigate('/')
        } else {
          showToast('Session expired. Please verify your email again.', 'error')
          clearGuestAuth()
          navigate('/guest/access')
        }
      } else if (status === 404) {
        showToast('Booking not found', 'error')
        navigate(isUsingManageToken ? '/' : '/guest/bookings')
      } else {
        showToast(message || 'Failed to load booking', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBooking()
  }, [id, manageToken])

  const handleCancel = () => {
    if (isUsingManageToken) {
      navigate('/')
    } else {
      navigate('/guest/bookings')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking not found</h3>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LuxRide</h1>
              {isUsingManageToken && (
                <span className="text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded">
                  Guest Access
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                New Booking
              </button>
              
              {!isUsingManageToken && (
                <>
                  <button
                    onClick={() => navigate('/guest/bookings')}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => {
                      clearGuestAuth()
                      navigate('/')
                    }}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => {
              if (isUsingManageToken) {
                navigate('/')
              } else {
                navigate('/guest/bookings')
              }
            }}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
        </div>
        
        {isUsingManageToken && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Guest Management Access:</strong> You can view and edit this booking using your management link.{' '}
              <button
                onClick={() => navigate('/guest/access')}
                className="underline hover:text-blue-900 font-medium"
              >
                Access all your bookings
              </button>
            </p>
          </div>
        )}
        
        <BookingDetail
          booking={booking}
          canEdit={true}
          canCancel={true}
          onUpdate={loadBooking}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}