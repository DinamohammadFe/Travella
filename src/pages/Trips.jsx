import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import tripService from '../services/tripService'
import TripList from '../components/TripList'

const Trips = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadTrips()
  }, [currentUser])

  useEffect(() => {
    filterTrips()
  }, [trips, searchQuery, statusFilter])

  const loadTrips = () => {
    try {
      const userId = currentUser?.uid || 'guest'
      const userTrips = tripService.getAllTrips(userId)
      const tripStats = tripService.getTripStats(userId)
      
      setTrips(userTrips)
      setStats(tripStats)
      setLoading(false)
    } catch (error) {
      console.error('Error loading trips:', error)
      setLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    // Apply search filter
    if (searchQuery) {
      const userId = currentUser?.uid || 'guest'
      filtered = tripService.searchTrips(searchQuery, userId)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const userId = currentUser?.uid || 'guest'
      filtered = tripService.getTripsByStatus(statusFilter, userId)
      
      // If we also have a search query, intersect the results
      if (searchQuery) {
        const searchResults = tripService.searchTrips(searchQuery, userId)
        filtered = filtered.filter(trip => 
          searchResults.some(searchTrip => searchTrip.id === trip.id)
        )
      }
    }

    setFilteredTrips(filtered)
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const userId = currentUser?.uid || 'guest'
        await tripService.deleteTrip(tripId, userId)
        loadTrips()
      } catch (error) {
        console.error('Error deleting trip:', error)
        alert('Failed to delete trip. Please try again.')
      }
    }
  }

  const handleDuplicateTrip = async (tripId) => {
    try {
      const userId = currentUser?.uid || 'guest'
      await tripService.duplicateTrip(tripId, userId)
      loadTrips()
    } catch (error) {
      console.error('Error duplicating trip:', error)
      alert('Failed to duplicate trip. Please try again.')
    }
  }

  const handleEditTrip = (trip) => {
    // Set the trip as current trip and navigate to planner
    tripService.setCurrentTrip(trip)
    navigate('/trip-planner')
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
              <p className="text-gray-600 mt-2">Manage and organize your travel adventures</p>
            </div>
            <button
              onClick={() => navigate('/trip-planner')}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Trip
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming || 0}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.current || 0}</div>
              <div className="text-sm text-gray-600">Current</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{stats.past || 0}</div>
              <div className="text-sm text-gray-600">Past</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.draft || 0}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search trips by destination or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Trips List */}
        <TripList 
          trips={filteredTrips}
          loading={false}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
          onDuplicateTrip={handleDuplicateTrip}
        />
      </div>
    </div>
  )
}

export default Trips