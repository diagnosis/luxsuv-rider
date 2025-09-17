import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import { AuthTabs } from '../components/AuthTabs'
import { BookingForm } from '../components/BookingForm'
import { GuestLayout } from '../components/layouts/AppLayout'
import type { GuestBookingResponse } from '../lib/api-types'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [activeTab, setActiveTab] = useState<'auth' | 'guest'>('auth')
  const navigate = useNavigate()
  const { createGuestBooking } = useBookings()

  const handleGuestBookingSuccess = (booking: GuestBookingResponse) => {
    navigate({
      to: '/guest/bookings/$bookingId',
      params: { bookingId: booking.id.toString() },
      search: { manage_token: booking.manage_token },
    })
  }

  return (
    <GuestLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Premium Car Service
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Professional transportation with luxury vehicles and experienced drivers
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'auth'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('auth')}
          >
            Sign In / Sign Up
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'guest'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('guest')}
          >
            Book as Guest
          </button>
        </div>

        {activeTab === 'auth' ? (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create an account or sign in
              </h3>
              <p className="text-gray-600">
                Access your booking history, manage reservations, and enjoy faster checkout
              </p>
            </div>
            <AuthTabs />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Book without an account
              </h3>
              <p className="text-gray-600">
                Quick booking with email confirmation and management link
              </p>
            </div>
            <BookingForm
              isGuest={true}
              onSuccess={(booking) => {
                handleGuestBookingSuccess(booking as GuestBookingResponse)
              }}
            />
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>After booking:</strong> You'll receive a management link to view and modify your booking.
              </p>
              <p className="text-sm text-blue-800">
                Want to see all your bookings in one place?{' '}
                <button
                  onClick={() => navigate({ to: '/guest/access' })}
                  className="underline hover:text-blue-900 font-medium transition-colors"
                >
                  Access your bookings
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </GuestLayout>
  )
}