import React from 'react'
import { Calendar, MapPin, Edit, Trash2, Copy } from 'lucide-react'

const TripCard = ({ trip, onEdit, onDelete, onDuplicate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTripStatus = (trip) => {
    if (!trip.startDate) return 'draft'
    
    const now = new Date()
    const startDate = new Date(trip.startDate)
    const endDate = trip.endDate ? new Date(trip.endDate) : startDate
    
    if (startDate > now) return 'upcoming'
    if (startDate <= now && endDate >= now) return 'current'
    return 'past'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'past': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const status = getTripStatus(trip)
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {trip.title || trip.destination || 'Untitled Trip'}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{trip.destination || 'No destination set'}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(trip.startDate)}
              {trip.endDate && trip.endDate !== trip.startDate && (
                <span> - {formatDate(trip.endDate)}</span>
              )}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      {trip.selectedPlaces && trip.selectedPlaces.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {trip.selectedPlaces.length} place{trip.selectedPlaces.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-2">
            {trip.selectedPlaces.slice(0, 3).map((place, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {place.name}
              </span>
            ))}
            {trip.selectedPlaces.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{trip.selectedPlaces.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Created {new Date(trip.createdAt).toLocaleDateString()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit && onEdit(trip)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            title="Edit trip"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate && onDuplicate(trip.id)}
            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
            title="Duplicate trip"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(trip.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
            title="Delete trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripCard