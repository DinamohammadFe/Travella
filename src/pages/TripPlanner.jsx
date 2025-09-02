import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EnhancedPlaceSearch from '../components/EnhancedPlaceSearch'
import { geocodeCity, fetchAttractions } from '../services/freeMapsService'
import tripService from '../services/tripService'

const TripPlanner = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    title: ''
  })
  const [showInviteOptions, setShowInviteOptions] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState('Friends')
  const [showMap, setShowMap] = useState(false)
  const [mapSrc, setMapSrc] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapMarkers, setMapMarkers] = useState([])
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [showPlaceSearch, setShowPlaceSearch] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Check for URL parameters from search
    const urlParams = new URLSearchParams(location.search)
    const destination = urlParams.get('destination')
    const departureDate = urlParams.get('departureDate')
    const returnDate = urlParams.get('returnDate')
    
    // Load current trip if editing
    const currentTrip = tripService.getCurrentTrip()
    if (currentTrip) {
      setFormData({
        destination: currentTrip.destination || '',
        startDate: currentTrip.startDate || '',
        endDate: currentTrip.endDate || '',
        title: currentTrip.title || ''
      })
      setSelectedPlaces(currentTrip.selectedPlaces || [])
      if (currentTrip.mapCenter) {
        setMapCenter(currentTrip.mapCenter)
      }
      if (currentTrip.destination) {
        setShowMap(true)
        updateMapForDestination(currentTrip.destination)
        setShowPlaceSearch(true)
      }
    } else if (destination) {
      // Pre-fill form with search data from Home page
      setFormData({
        destination: destination,
        startDate: departureDate || '',
        endDate: returnDate || '',
        title: `Trip to ${destination}`
      })
      setShowMap(true)
      updateMapForDestination(destination)
      setShowPlaceSearch(true)
    }
  }, [location.search])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Show map and update center when destination is entered
    if (name === 'destination' && value.trim().length > 2) {
      setShowMap(true)
      setShowPlaceSearch(true)
      // Geocode the destination to get coordinates
      updateMapForDestination(value.trim())
    } else if (name === 'destination' && value.trim().length <= 2) {
      setShowMap(false)
      setShowPlaceSearch(false)
    }
  }

  const updateMapForDestination = async (destination) => {
    try {
      const result = await geocodeCity(destination)
      if (result) {
        setMapCenter({ lat: result.lat, lng: result.lon })
        
        // Fetch attractions for the destination
        const attractions = await fetchAttractions(result.lat, result.lon)
        setMapMarkers(attractions)
      }
    } catch (error) {
      console.error('Failed to geocode destination:', error)
    }
  }

  const handlePlaceSelect = (place) => {
    // Add selected place to the list
    const newPlace = {
      id: place.id,
      name: place.name,
      address: place.address,
      location: place.location,
      rating: place.rating,
      types: place.types
    }
    
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id)
      if (exists) return prev
      return [...prev, newPlace]
    })

    // Add marker to map
    const marker = {
      id: place.id,
      name: place.name,
      lat: place.location.lat,
      lng: place.location.lng,
      type: place.types?.[0] || 'attraction'
    }
    
    setMapMarkers(prev => [...prev, marker])
  }

  const removeSelectedPlace = (placeId) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId))
    
    // Remove marker from map
    setMapMarkers(prev => prev.filter(marker => marker.id !== placeId))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const userId = currentUser?.uid || 'guest'
      const tripData = {
        ...formData,
        selectedPlaces,
        mapCenter,
        title: formData.title || formData.destination || 'Untitled Trip'
      }
      
      // Save as permanent trip
      const savedTrip = tripService.createTrip(tripData, userId)
      
      // Also set as current trip for itinerary planning
      tripService.setCurrentTrip(savedTrip)
      
      navigate('/itinerary')
    } catch (error) {
      console.error('Error saving trip:', error)
      alert('Failed to save trip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Plan Your <span className="gradient-text">Dream Trip</span> ✈️
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go and we'll help you create the perfect personalized itinerary
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className={`space-y-8 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="card p-8">
              <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-4">
                ✏️ Trip Name
              </label>
              <div className="relative mb-6">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Give your trip a memorable name (e.g., Summer Adventure in Paris)"
                  className="input-field pl-12 text-lg py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              
              <label htmlFor="destination" className="block text-lg font-semibold text-gray-800 mb-4">
                🌍 Where to?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Enter your dream destination (e.g., Paris, Tokyo, New York)"
                  className="input-field pl-12 text-lg py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              

              
              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                💡 <span>Adding dates helps us suggest seasonal activities and better pricing</span>
              </p>
            </div>
              
            {/* Interactive Map */}
            {showMap && formData.destination && (
              <div className="card p-6 fade-in mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🗺️ Explore {formData.destination}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMap(false)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-medium">{formData.destination || 'Select Destination'}</p>
                    <p className="text-sm">Map will appear here once destination is selected</p>
                  </div>
                </div>
                
                {/* Selected Places */}
                {selectedPlaces.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Places ({selectedPlaces.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedPlaces.map((place) => (
                        <div key={place.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{place.name}</h5>
                            <p className="text-sm text-gray-600 truncate">{place.address}</p>
                            {place.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm text-gray-600 ml-1">{place.rating}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeSelectedPlace(place.id)}
                            className="ml-3 p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Place Search */}
            {showPlaceSearch && formData.destination && (
              <div className="fade-in mt-4">
                <EnhancedPlaceSearch
                  destination={formData.destination}
                  onPlaceSelect={handlePlaceSelect}
                />
              </div>
            )}

            <div className="card p-8">
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                📅 When are you traveling? (optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input-field pl-12 text-lg py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300 w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{
                      colorScheme: 'light',
                      color: formData.startDate ? '#374151' : '#9CA3AF'
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-base font-medium">
                      {formData.startDate ? '' : 'Departure date'}
                    </span>
                  </div>
                </div>
                <div className="relative group">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || undefined}
                    className="input-field pl-12 text-lg py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-blue-300 w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    style={{
                      colorScheme: 'light',
                      color: formData.endDate ? '#374151' : '#9CA3AF'
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-base font-medium">
                      {formData.endDate ? '' : 'Return date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowInviteOptions(!showInviteOptions)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Invite tripmates
              </button>
              
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {selectedFriends}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`btn-primary text-xl px-16 py-5 shadow-xl relative overflow-hidden group w-full bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200 hover:shadow-xl transform hover:-translate-y-0.5 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3 justify-center">
                    <div className="loading-spinner"></div>
                    <span>Creating your adventure...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-3 justify-center">
                    🚀 <span>Start Planning My Trip</span>
                  </span>
                )}
              </button>
            </div>
          </form>
          
          <div className={`text-center mt-16 pt-8 border-t border-gray-200 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            <p className="text-gray-600 mb-6 text-lg">Looking for something different?</p>
            <button
              onClick={() => navigate('/guide')}
              className="btn-secondary px-8 py-3 text-lg text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              📝 Write a Travel Guide Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner