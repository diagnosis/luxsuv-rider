import {createFileRoute, Link} from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Luxury SUV Transportation
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience premium transportation services with our fleet of luxury SUVs. 
            Professional drivers, comfortable rides, and exceptional service for all your travel needs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/book" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Now
            </Link>
            <button
              onClick={() => {
                const bookingId = prompt('Enter your Booking ID:')
                const manageToken = prompt('Enter your Management Token:')
                if (bookingId && manageToken) {
                  navigate({
                    to: '/guest/booking/$id',
                    params: { id: bookingId },
                    search: { manage_token: manageToken }
                  })
                }
              }}
              className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Manage Booking
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-white mb-2">Luxury Fleet</h3>
            <p className="text-gray-300">Premium SUVs with modern amenities and comfort features</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">👨‍✈️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Professional Drivers</h3>
            <p className="text-gray-300">Experienced, licensed, and courteous chauffeurs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Service</h3>
            <p className="text-gray-300">Available around the clock for all your transportation needs</p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">✈️</div>
              <div>
                <h4 className="text-lg font-semibold text-white">Airport Transfers</h4>
                <p className="text-gray-300">Reliable pickup and drop-off services to all major airports</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🏢</div>
              <div>
                <h4 className="text-lg font-semibold text-white">Corporate Travel</h4>
                <p className="text-gray-300">Professional transportation for business meetings and events</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🎉</div>
              <div>
                <h4 className="text-lg font-semibold text-white">Special Events</h4>
                <p className="text-gray-300">Elegant transportation for weddings, parties, and celebrations</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🌅</div>
              <div>
                <h4 className="text-lg font-semibold text-white">Hourly Service</h4>
                <p className="text-gray-300">Flexible hourly rentals for tours and extended trips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}
