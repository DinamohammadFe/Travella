import React, { useState, useEffect } from 'react'
import { Search, MapPin, Filter, Grid, List } from 'lucide-react'
import PlaceCard from './PlaceCard'
import { geocodeCity, fetchAttractions, getAttractionCategories, filterAttractionsByCategory } from '../services/freeMapsService'

const EnhancedPlaceSearch = ({ onPlaceSelect, destination = null }) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [savedPlaces, setSavedPlaces] = useState(new Set())
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 4,
    openNow: false,
    distance: 50000 // in meters
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = getAttractionCategories()

  const handleSearch = async (searchQuery = query, category = selectedCategory) => {
    if (!destination) {
      setError('Please provide a destination to search for places.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Geocode the destination
      const location = await geocodeCity(destination)
      if (!location) {
        setError('Could not find the specified destination.')
        return
      }
      
      // Fetch attractions for the destination
      const attractions = await fetchAttractions(location.lat, location.lon)
      
      // Filter by category if specified
      let filteredResults = attractions
      if (category && category !== 'all') {
        filteredResults = filterAttractionsByCategory(attractions, category)
      }
      
      // Apply additional filters
      if (filters.minRating > 0) {
        filteredResults = filteredResults.filter(place => 
          place.rating && place.rating >= filters.minRating
        )
      }
      
      setResults(filteredResults)
    } catch (err) {
      setError('Failed to search places. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    handleSearch(query, categoryId)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSavePlace = (place) => {
    const newSavedPlaces = new Set(savedPlaces)
    if (savedPlaces.has(place.id)) {
      newSavedPlaces.delete(place.id)
    } else {
      newSavedPlaces.add(place.id)
    }
    setSavedPlaces(newSavedPlaces)
    
    // Save to localStorage
    const saved = Array.from(newSavedPlaces)
    localStorage.setItem('savedPlaces', JSON.stringify(saved))
  }

  // Load saved places from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPlaces')
    if (saved) {
      setSavedPlaces(new Set(JSON.parse(saved)))
    }
  }, [])
  
  // Re-search when filters change (if there are existing results)
  useEffect(() => {
    if (results.length > 0 && (query || selectedCategory)) {
      handleSearch()
    }
  }, [filters])

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {destination ? `Explore ${destination}` : 'Discover Amazing Places'}
            </h2>
            <p className="text-gray-600">
              {destination 
                ? `Find the best attractions, restaurants, and experiences in ${destination}`
                : 'Search for attractions, restaurants, hotels, and more'
              }
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={destination ? `Search places in ${destination}...` : "Search for attractions, restaurants, hotels..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pick a category to filter your results</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Any</span>
                  <span>5 stars</span>
                </div>
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price Level: {filters.maxPrice === 4 ? 'Any' : '$'.repeat(filters.maxPrice + 1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$</span>
                  <span>Any</span>
                </div>
              </div>
              
              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {filters.distance / 1000}km
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="5000"
                  value={filters.distance}
                  onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1km</span>
                  <span>100km</span>
                </div>
              </div>
              
              {/* Open Now Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="openNow"
                  checked={filters.openNow}
                  onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="openNow" className="ml-2 text-sm font-medium text-gray-700">
                  Open now only
                </label>
              </div>
              
              {/* Clear Filters */}
              <div className="flex justify-end">
                <button
                  onClick={() => setFilters({ minRating: 0, maxPrice: 4, openNow: false, distance: 50000 })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>{error}</div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">Searching for amazing places...</span>
          </div>
        )}
        
        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {results.length} {results.length === 1 ? 'place' : 'places'} found
              </h3>
              <div className="text-sm text-gray-600">
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {results.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  onPlaceSelect={onPlaceSelect}
                  onSavePlace={handleSavePlace}
                  isSaved={savedPlaces.has(place.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && results.length === 0 && (query || selectedCategory) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setQuery('')
                setSelectedCategory('')
                setResults([])
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
        
        {/* Initial State */}
        {!loading && results.length === 0 && !query && !selectedCategory && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to explore?</h3>
            <p className="text-gray-600">
              Search for places or select a category to discover amazing destinations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedPlaceSearch