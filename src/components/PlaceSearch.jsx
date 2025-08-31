import React, { useState, useEffect } from 'react'
import { Search, MapPin, Star, DollarSign, Clock, Phone, Globe } from 'lucide-react'
import placesService from '../services/placesService'
import { PLACE_TYPES } from '../config/googleMaps'

const PlaceSearch = ({ onPlaceSelect, destination = null }) => {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const placeTypeOptions = [
    { value: '', label: 'All Places' },
    { value: PLACE_TYPES.TOURIST_ATTRACTION, label: 'Attractions' },
    { value: PLACE_TYPES.RESTAURANT, label: 'Restaurants' },
    { value: PLACE_TYPES.LODGING, label: 'Hotels' },
    { value: PLACE_TYPES.MUSEUM, label: 'Museums' },
    { value: PLACE_TYPES.PARK, label: 'Parks' },
    { value: PLACE_TYPES.SHOPPING_MALL, label: 'Shopping' },
    { value: PLACE_TYPES.AMUSEMENT_PARK, label: 'Entertainment' }
  ]

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    
    try {
      let searchResults
      
      if (destination) {
        // Search near destination
        const location = await placesService.geocodeAddress(destination)
        searchResults = await placesService.searchPlaces(
          query,
          location.location,
          50000,
          selectedType || null
        )
      } else {
        // General search
        searchResults = await placesService.searchPlaces(
          query,
          null,
          50000,
          selectedType || null
        )
      }
      
      setResults(searchResults)
    } catch (err) {
      setError('Failed to search places. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getPriceLevel = (level) => {
    if (!level) return 'Price not available'
    return '$'.repeat(level) + '·'.repeat(4 - level)
  }

  const PlaceCard = ({ place }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
         onClick={() => onPlaceSelect && onPlaceSelect(place)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 flex-1 pr-2">{place.name}</h3>
        {place.rating && (
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{place.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{place.address}</span>
      </div>
      
      {place.priceLevel && (
        <div className="flex items-center text-gray-600 mb-2">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="text-sm">{getPriceLevel(place.priceLevel)}</span>
        </div>
      )}
      
      {place.phone && (
        <div className="flex items-center text-gray-600 mb-2">
          <Phone className="w-4 h-4 mr-1" />
          <span className="text-sm">{place.phone}</span>
        </div>
      )}
      
      {place.website && (
        <div className="flex items-center text-blue-600 mb-2">
          <Globe className="w-4 h-4 mr-1" />
          <a href={place.website} target="_blank" rel="noopener noreferrer" 
             className="text-sm hover:underline"
             onClick={(e) => e.stopPropagation()}>
            Visit Website
          </a>
        </div>
      )}
      
      {place.openingHours && (
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {place.openingHours.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
      )}
      
      {place.photos && place.photos.length > 0 && (
        <div className="mt-3">
          <img 
            src={place.photos[0].url} 
            alt={place.name}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="mt-2 flex flex-wrap gap-1">
        {place.types && place.types.slice(0, 3).map((type, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Places</h2>
        
        {/* Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={destination ? `Search places in ${destination}` : "Search for attractions, restaurants, hotels..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {placeTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Results */}
        {results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Found {results.length} places
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No places found. Try a different search term or location.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaceSearch