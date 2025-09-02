import React from 'react'
import { Star, MapPin, DollarSign, Clock, Phone, Globe, Heart, Bookmark } from 'lucide-react'

const PlaceCard = ({ place, onPlaceSelect, onSavePlace, isSaved = false }) => {
  const getPriceLevel = (level) => {
    if (!level) return null
    return '$'.repeat(level)
  }

  const getCategoryIcon = (types) => {
    if (!types || types.length === 0) return null
    
    const type = types[0].toLowerCase()
    if (type.includes('restaurant') || type.includes('food')) return '🍽️'
    if (type.includes('tourist_attraction') || type.includes('museum')) return '🏛️'
    if (type.includes('lodging') || type.includes('hotel')) return '🏨'
    if (type.includes('park') || type.includes('nature')) return '🌳'
    if (type.includes('shopping')) return '🛍️'
    if (type.includes('entertainment') || type.includes('amusement')) return '🎢'
    return '📍'
  }

  const formatCategory = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getMainCategory = (types) => {
    if (!types || types.length === 0) return 'Place'
    
    const priorityTypes = [
      'tourist_attraction',
      'restaurant', 
      'lodging',
      'museum',
      'park',
      'shopping_mall',
      'amusement_park'
    ]
    
    for (const priority of priorityTypes) {
      if (types.includes(priority)) {
        return formatCategory(priority)
      }
    }
    
    return formatCategory(types[0])
  }

  const handleCardClick = () => {
    if (onPlaceSelect) {
      onPlaceSelect(place)
    }
  }

  const handleSaveClick = (e) => {
    e.stopPropagation()
    if (onSavePlace) {
      onSavePlace(place)
    }
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {place.photos && place.photos.length > 0 ? (
          <img 
            src={place.photos[0].url} 
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-6xl opacity-50">
              {getCategoryIcon(place.types)}
            </div>
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          {isSaved ? <Heart className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
        </button>
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full">
            {getMainCategory(place.types)}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1 pr-2">
            {place.name}
          </h3>
          {place.rating && (
            <div className="flex items-center bg-green-100 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="text-sm font-semibold text-gray-800">{place.rating}</span>
            </div>
          )}
        </div>
        
        {/* Address */}
        <div className="flex items-start text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm line-clamp-2">{place.address}</span>
        </div>
        
        {/* Details Row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-4">
            {place.priceLevel && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="font-medium text-green-600">{getPriceLevel(place.priceLevel)}</span>
              </div>
            )}
            
            {place.openingHours && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span className={`font-medium ${
                  place.openingHours.isOpen ? 'text-green-600' : 'text-red-600'
                }`}>
                  {place.openingHours.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        {place.reviews && place.reviews.length > 0 && (
          <div className="mb-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recent Review</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < place.reviews[0].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {place.reviews[0].text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                - {place.reviews[0].author_name}
              </p>
            </div>
          </div>
        )}
        
        {/* Action Links */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            {place.phone && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`tel:${place.phone}`, '_self')
                }}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Call</span>
              </button>
            )}
            
            {place.website && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(place.website, '_blank', 'noopener,noreferrer')
                }}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Website</span>
              </button>
            )}
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Add to Trip
          </button>
        </div>
        
        {/* Tags */}
        {place.types && place.types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {place.types.slice(0, 3).map((type, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {formatCategory(type)}
              </span>
            ))}
            {place.types.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{place.types.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaceCard