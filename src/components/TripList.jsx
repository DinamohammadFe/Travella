import React from 'react'
import { MapPin, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TripCard from './TripCard'

const TripList = ({ 
  trips, 
  loading = false, 
  searchQuery = '', 
  statusFilter = 'all',
  onEditTrip,
  onDeleteTrip,
  onDuplicateTrip 
}) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {searchQuery || statusFilter !== 'all' ? 'No trips found' : 'No trips yet'}
        </h3>
        <p className="text-gray-600 mb-6">
          {searchQuery || statusFilter !== 'all' 
            ? 'Try adjusting your search or filter criteria'
            : 'Start planning your first adventure!'}
        </p>
        {!searchQuery && statusFilter === 'all' && (
          <button
            onClick={() => navigate('/trip-planner')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Trip
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={trip}
          onEdit={onEditTrip}
          onDelete={onDeleteTrip}
          onDuplicate={onDuplicateTrip}
        />
      ))}
    </div>
  )
}

export default TripList