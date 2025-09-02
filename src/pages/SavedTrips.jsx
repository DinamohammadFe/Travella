import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TripList from '../components/TripList'

const SavedTrips = () => {
  const navigate = useNavigate()
  const [savedTrips, setSavedTrips] = useState([])

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]')
    setSavedTrips(trips)
  }, [])

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const updatedTrips = savedTrips.filter(trip => trip.id !== tripId)
      setSavedTrips(updatedTrips)
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips))
    }
  }

  const handleEditTrip = (trip) => {
    // Store the trip data for editing
    localStorage.setItem('currentTrip', JSON.stringify({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      travelers: trip.travelers,
      budget: trip.budget
    }))
    navigate('/trip-planner')
  }

  const handleDuplicateTrip = (tripId) => {
    const tripToDuplicate = savedTrips.find(trip => trip.id === tripId)
    if (tripToDuplicate) {
      const duplicatedTrip = {
        ...tripToDuplicate,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        title: `${tripToDuplicate.title || tripToDuplicate.destination} (Copy)`
      }
      const updatedTrips = [...savedTrips, duplicatedTrip]
      setSavedTrips(updatedTrips)
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }

  if (savedTrips.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Saved Trips</h1>
            <p className="text-lg text-gray-600 mb-8">
              You haven't saved any trips yet. Start planning your first adventure!
            </p>
            <Link to="/planner" className="btn-primary">
              Plan Your First Trip
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Saved Trips</h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your travel plans and revisit your favorite destinations.
          </p>
          <Link to="/planner" className="btn-primary">
            Plan New Trip
          </Link>
        </div>

        <TripList 
          trips={savedTrips}
          loading={false}
          searchQuery=""
          statusFilter="all"
          onEditTrip={handleEditTrip}
          onDeleteTrip={handleDeleteTrip}
          onDuplicateTrip={handleDuplicateTrip}
        />
      </div>
    </div>
  )
}

export default SavedTrips