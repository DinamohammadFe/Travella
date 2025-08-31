// Trip management service using localStorage

class TripService {
  constructor() {
    this.storageKey = 'travella_trips'
    this.currentTripKey = 'currentTrip'
  }

  // Get all trips for the current user
  getAllTrips(userId = 'guest') {
    try {
      const trips = localStorage.getItem(`${this.storageKey}_${userId}`)
      return trips ? JSON.parse(trips) : []
    } catch (error) {
      console.error('Error getting trips:', error)
      return []
    }
  }

  // Get a specific trip by ID
  getTripById(tripId, userId = 'guest') {
    const trips = this.getAllTrips(userId)
    return trips.find(trip => trip.id === tripId) || null
  }

  // Create a new trip
  createTrip(tripData, userId = 'guest') {
    try {
      const trips = this.getAllTrips(userId)
      const newTrip = {
        id: this.generateTripId(),
        ...tripData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId,
        itinerary: tripData.itinerary || [],
        selectedPlaces: tripData.selectedPlaces || [],
        mapCenter: tripData.mapCenter || { lat: 40.7128, lng: -74.0060 }
      }
      
      trips.push(newTrip)
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(trips))
      
      return newTrip
    } catch (error) {
      console.error('Error creating trip:', error)
      throw new Error('Failed to create trip')
    }
  }

  // Update an existing trip
  updateTrip(tripId, updates, userId = 'guest') {
    try {
      const trips = this.getAllTrips(userId)
      const tripIndex = trips.findIndex(trip => trip.id === tripId)
      
      if (tripIndex === -1) {
        throw new Error('Trip not found')
      }
      
      trips[tripIndex] = {
        ...trips[tripIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(trips))
      
      return trips[tripIndex]
    } catch (error) {
      console.error('Error updating trip:', error)
      throw new Error('Failed to update trip')
    }
  }

  // Delete a trip
  deleteTrip(tripId, userId = 'guest') {
    try {
      const trips = this.getAllTrips(userId)
      const filteredTrips = trips.filter(trip => trip.id !== tripId)
      
      if (trips.length === filteredTrips.length) {
        throw new Error('Trip not found')
      }
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(filteredTrips))
      
      return true
    } catch (error) {
      console.error('Error deleting trip:', error)
      throw new Error('Failed to delete trip')
    }
  }

  // Get current trip (used for trip planning flow)
  getCurrentTrip() {
    try {
      const currentTrip = localStorage.getItem(this.currentTripKey)
      return currentTrip ? JSON.parse(currentTrip) : null
    } catch (error) {
      console.error('Error getting current trip:', error)
      return null
    }
  }

  // Set current trip (used for trip planning flow)
  setCurrentTrip(tripData) {
    try {
      localStorage.setItem(this.currentTripKey, JSON.stringify(tripData))
      return true
    } catch (error) {
      console.error('Error setting current trip:', error)
      return false
    }
  }

  // Clear current trip
  clearCurrentTrip() {
    try {
      localStorage.removeItem(this.currentTripKey)
      return true
    } catch (error) {
      console.error('Error clearing current trip:', error)
      return false
    }
  }

  // Save current trip as a permanent trip
  saveCurrentTripAsPermanent(userId = 'guest') {
    try {
      const currentTrip = this.getCurrentTrip()
      if (!currentTrip) {
        throw new Error('No current trip to save')
      }
      
      const savedTrip = this.createTrip(currentTrip, userId)
      this.clearCurrentTrip()
      
      return savedTrip
    } catch (error) {
      console.error('Error saving current trip:', error)
      throw new Error('Failed to save trip')
    }
  }

  // Generate a unique trip ID
  generateTripId() {
    return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get trips by status (upcoming, past, current)
  getTripsByStatus(status, userId = 'guest') {
    const trips = this.getAllTrips(userId)
    const now = new Date()
    
    return trips.filter(trip => {
      if (!trip.startDate) return status === 'draft'
      
      const startDate = new Date(trip.startDate)
      const endDate = trip.endDate ? new Date(trip.endDate) : startDate
      
      switch (status) {
        case 'upcoming':
          return startDate > now
        case 'current':
          return startDate <= now && endDate >= now
        case 'past':
          return endDate < now
        case 'draft':
          return !trip.startDate
        default:
          return true
      }
    })
  }

  // Search trips by destination or title
  searchTrips(query, userId = 'guest') {
    const trips = this.getAllTrips(userId)
    const searchTerm = query.toLowerCase()
    
    return trips.filter(trip => 
      (trip.destination && trip.destination.toLowerCase().includes(searchTerm)) ||
      (trip.title && trip.title.toLowerCase().includes(searchTerm))
    )
  }

  // Get trip statistics
  getTripStats(userId = 'guest') {
    const trips = this.getAllTrips(userId)
    
    return {
      total: trips.length,
      upcoming: this.getTripsByStatus('upcoming', userId).length,
      current: this.getTripsByStatus('current', userId).length,
      past: this.getTripsByStatus('past', userId).length,
      draft: this.getTripsByStatus('draft', userId).length
    }
  }

  // Duplicate a trip
  duplicateTrip(tripId, userId = 'guest') {
    try {
      const originalTrip = this.getTripById(tripId, userId)
      if (!originalTrip) {
        throw new Error('Trip not found')
      }
      
      const duplicatedTrip = {
        ...originalTrip,
        id: undefined, // Will be generated by createTrip
        title: `${originalTrip.title || originalTrip.destination} (Copy)`,
        startDate: '',
        endDate: '',
        createdAt: undefined,
        updatedAt: undefined
      }
      
      return this.createTrip(duplicatedTrip, userId)
    } catch (error) {
      console.error('Error duplicating trip:', error)
      throw new Error('Failed to duplicate trip')
    }
  }
}

// Export a singleton instance
export default new TripService()