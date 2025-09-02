import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import tripService from '../services/tripService'

const Itinerary = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [draggedItem, setDraggedItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapMarkers, setMapMarkers] = useState([])

  useEffect(() => {
    loadCurrentTrip()
  }, [])

  useEffect(() => {
    if (trip && itinerary.length > 0) {
      updateMapForDay(selectedDay)
    }
  }, [selectedDay, itinerary, trip])

  const loadCurrentTrip = () => {
    try {
      const currentTrip = tripService.getCurrentTrip()
      if (!currentTrip) {
        navigate('/trip-planner')
        return
      }

      setTrip(currentTrip)
      if (currentTrip.mapCenter) {
        setMapCenter(currentTrip.mapCenter)
      }

      // Initialize itinerary based on trip duration
      const startDate = new Date(currentTrip.startDate)
      const endDate = new Date(currentTrip.endDate)
      const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

      const initialItinerary = []
      for (let i = 0; i < dayCount; i++) {
        const dayDate = new Date(startDate)
        dayDate.setDate(startDate.getDate() + i)
        initialItinerary.push({
          day: i + 1,
          date: dayDate.toDateString(),
          activities: []
        })
      }

      // Load existing itinerary if available
      const savedItinerary = currentTrip.itinerary || initialItinerary
      setItinerary(savedItinerary)
    } catch (error) {
      console.error('Error loading trip:', error)
      navigate('/trip-planner')
    } finally {
      setIsLoading(false)
    }
  }

  const updateMapForDay = (dayIndex) => {
    if (!itinerary[dayIndex] || !itinerary[dayIndex].activities.length) {
      setMapMarkers([])
      return
    }

    const dayActivities = itinerary[dayIndex].activities
    const markers = dayActivities.map((activity, index) => ({
      id: `day-${dayIndex}-activity-${index}`,
      name: activity.place.name,
      lat: activity.place.geometry?.location?.lat || activity.place.lat,
      lng: activity.place.geometry?.location?.lng || activity.place.lng,
      type: 'itinerary',
      description: `${activity.time || 'No time set'} - ${activity.place.address || ''}`
    }))

    setMapMarkers(markers)

    // Center map on first activity of the day
    if (dayActivities.length > 0) {
      const firstActivity = dayActivities[0]
      setMapCenter({
        lat: firstActivity.place.geometry?.location?.lat || firstActivity.place.lat,
        lng: firstActivity.place.geometry?.location?.lng || firstActivity.place.lng
      })
    }
  }

  const addPlaceToDay = (place, dayIndex) => {
    const newItinerary = [...itinerary]
    const newActivity = {
      id: `activity-${Date.now()}`,
      place: place,
      time: '',
      notes: ''
    }
    newItinerary[dayIndex].activities.push(newActivity)
    setItinerary(newItinerary)
    saveItinerary(newItinerary)
  }

  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...itinerary]
    newItinerary[dayIndex].activities.splice(activityIndex, 1)
    setItinerary(newItinerary)
    saveItinerary(newItinerary)
  }

  const updateActivityTime = (dayIndex, activityIndex, time) => {
    const newItinerary = [...itinerary]
    newItinerary[dayIndex].activities[activityIndex].time = time
    setItinerary(newItinerary)
    saveItinerary(newItinerary)
  }

  const updateActivityNotes = (dayIndex, activityIndex, notes) => {
    const newItinerary = [...itinerary]
    newItinerary[dayIndex].activities[activityIndex].notes = notes
    setItinerary(newItinerary)
    saveItinerary(newItinerary)
  }

  const saveItinerary = (newItinerary) => {
    if (trip) {
      const updatedTrip = { ...trip, itinerary: newItinerary }
      tripService.updateTrip(trip.id, updatedTrip)
      tripService.setCurrentTrip(updatedTrip)
    }
  }

  const handleDragStart = (e, dayIndex, activityIndex) => {
    setDraggedItem({ dayIndex, activityIndex })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetDayIndex) => {
    e.preventDefault()
    if (!draggedItem) return

    const { dayIndex: sourceDayIndex, activityIndex } = draggedItem
    if (sourceDayIndex === targetDayIndex) return

    const newItinerary = [...itinerary]
    const activity = newItinerary[sourceDayIndex].activities.splice(activityIndex, 1)[0]
    newItinerary[targetDayIndex].activities.push(activity)
    
    setItinerary(newItinerary)
    saveItinerary(newItinerary)
    setDraggedItem(null)
  }

  const finishPlanning = () => {
    if (trip) {
      const updatedTrip = { ...trip, status: 'planned', itinerary }
      tripService.updateTrip(trip.id, updatedTrip)
      navigate('/trips')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trip...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Trip Found</h2>
          <p className="text-gray-600 mb-6">Please start by creating a new trip.</p>
          <button
            onClick={() => navigate('/trip-planner')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Plan New Trip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {trip.title || trip.destination} Itinerary
              </h1>
              <p className="text-gray-600">
                {trip.startDate} - {trip.endDate} • {itinerary.length} days
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/trip-planner')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Trip
              </button>
              <button
                onClick={finishPlanning}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Finish Planning
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Itinerary Planning */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap gap-2">
                {itinerary.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDay === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Day Activities */}
            {itinerary[selectedDay] && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Day {itinerary[selectedDay].day}
                    </h2>
                    <p className="text-gray-600">{itinerary[selectedDay].date}</p>
                  </div>
                </div>

                {/* Activities List */}
                <div
                  className="space-y-4 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, selectedDay)}
                >
                  {itinerary[selectedDay].activities.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No activities planned for this day</p>
                      <p className="text-sm text-gray-400">
                        Drag places from your selected places or add them from the map
                      </p>
                    </div>
                  ) : (
                    itinerary[selectedDay].activities.map((activity, activityIndex) => (
                      <div
                        key={activity.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, selectedDay, activityIndex)}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{activity.place.name}</h3>
                            <p className="text-sm text-gray-600">{activity.place.address}</p>
                            {activity.place.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm text-gray-600 ml-1">{activity.place.rating}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeActivity(selectedDay, activityIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivityTime(selectedDay, activityIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <input
                              type="text"
                              value={activity.notes}
                              onChange={(e) => updateActivityNotes(selectedDay, activityIndex, e.target.value)}
                              placeholder="Add notes..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Available Places */}
            {trip.selectedPlaces && trip.selectedPlaces.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Places</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.selectedPlaces.map((place) => (
                    <div key={place.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{place.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{place.address}</p>
                          {place.rating && (
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">{place.rating}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => addPlaceToDay(place, selectedDay)}
                          className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          Add to Day {selectedDay + 1}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Day {selectedDay + 1} Map
              </h3>
              <div className="w-full rounded-lg h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-medium">{trip?.destination || 'Destination'}</p>
                  <p className="text-sm">Day {selectedDay + 1} Map will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Itinerary