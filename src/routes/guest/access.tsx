import { createFileRoute } from '@tanstack/react-router'
import { GuestAccessForm } from '../../components/GuestAccessForm'

export const Route = createFileRoute('/guest/access')({
  component: GuestAccessPage,
})

function GuestAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">LuxRide</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuestAccessForm />
      </main>
    </div>
  )
}