import { createFileRoute } from '@tanstack/react-router'
import { BookingForm } from "../../components/BookingForm"
import { BookingManagement } from "../../components/BookingManagement"
import { BookingList } from "../../components/BookingList"
import { useState } from 'react'

export const Route = createFileRoute('/booking/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'list'>('create')

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Create Booking
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Manage Booking
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All Bookings
            </button>
          </div>
        </div>
}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'create' && <BookingForm />}
          {activeTab === 'manage' && <BookingManagement />}
          {activeTab === 'list' && <BookingList />}
        </div>
      </div>
    </div>
  )