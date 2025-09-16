import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/rider')({
  component: RiderDashboard,
})

function RiderDashboard() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-gray-600 mt-2">Your LUXSUV rider dashboard</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Sign out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={user.is_verified ? 'text-green-600' : 'text-yellow-600'}>
                    {user.is_verified ? 'Verified' : 'Pending verification'}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Rider features coming soon! You'll be able to:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• View your ride history</li>
                  <li>• Manage your bookings</li>
                  <li>• Update your profile</li>
                  <li>• Track current rides</li>
                </ul>
              </div>
            </div>
          </div>

          {!user.is_verified && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Account Verification Required:</strong> Please check your email and verify your account to access all features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}