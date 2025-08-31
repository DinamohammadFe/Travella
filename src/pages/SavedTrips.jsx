import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState([])

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]')
    setSavedTrips(trips)
  }, [])

  const deleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const updatedTrips = savedTrips.filter(trip => trip.id !== tripId)
      setSavedTrips(updatedTrips)
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips))
    }
  }

  const editTrip = (trip) => {
    // Store the trip data for editing
    localStorage.setItem('currentTrip', JSON.stringify({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      travelers: trip.travelers,
      budget: trip.budget
    }))
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {trip.destination}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Saved on {formatDate(trip.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/planner"
                    onClick={() => editTrip(trip)}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                    title="Edit trip"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                    title="Delete trip"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a1 1 0 01-1-1V7a1 1 0 011-1h3z" />
                  </svg>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getDuration(trip.startDate, trip.endDate)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1)} budget
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  to="/itinerary"
                  onClick={() => localStorage.setItem('currentTrip', JSON.stringify(trip))}
                  className="w-full btn-secondary text-center block"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SavedTrips