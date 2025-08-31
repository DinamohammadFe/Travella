import { Loader } from '@googlemaps/js-api-loader'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '../config/googleMaps'

class PlacesService {
  constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: GOOGLE_MAPS_LIBRARIES
    })
    this.google = null
    this.service = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    
    try {
      this.google = await this.loader.load()
      // Create a dummy map element for the PlacesService
      const mapDiv = document.createElement('div')
      const map = new this.google.maps.Map(mapDiv)
      this.service = new this.google.maps.places.PlacesService(map)
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize Google Places API:', error)
      throw error
    }
  }

  async searchPlaces(query, location = null, radius = 50000, type = null) {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      const request = {
        query: query,
        fields: ['place_id', 'name', 'formatted_address', 'rating', 'photos', 'price_level', 'types', 'geometry']
      }

      if (location) {
        request.location = new this.google.maps.LatLng(location.lat, location.lng)
        request.radius = radius
      }

      if (type) {
        request.type = type
      }

      this.service.textSearch(request, (results, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          const formattedResults = results.map(place => this.formatPlace(place))
          resolve(formattedResults)
        } else {
          reject(new Error(`Places search failed: ${status}`))
        }
      })
    })
  }

  async searchNearbyPlaces(location, radius = 5000, type = 'tourist_attraction') {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      const request = {
        location: new this.google.maps.LatLng(location.lat, location.lng),
        radius: radius,
        type: type,
        fields: ['place_id', 'name', 'formatted_address', 'rating', 'photos', 'price_level', 'types', 'geometry']
      }

      this.service.nearbySearch(request, (results, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          const formattedResults = results.map(place => this.formatPlace(place))
          resolve(formattedResults)
        } else {
          reject(new Error(`Nearby search failed: ${status}`))
        }
      })
    })
  }

  async getPlaceDetails(placeId) {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      const request = {
        placeId: placeId,
        fields: [
          'place_id', 'name', 'formatted_address', 'formatted_phone_number',
          'website', 'rating', 'reviews', 'photos', 'price_level', 'types',
          'geometry', 'opening_hours', 'url'
        ]
      }

      this.service.getDetails(request, (place, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          resolve(this.formatPlace(place))
        } else {
          reject(new Error(`Place details failed: ${status}`))
        }
      })
    })
  }

  formatPlace(place) {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types,
      location: place.geometry ? {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      } : null,
      photos: place.photos ? place.photos.map(photo => ({
        url: photo.getUrl({ maxWidth: 400, maxHeight: 300 }),
        attribution: photo.html_attributions
      })) : [],
      reviews: place.reviews || [],
      openingHours: place.opening_hours ? {
        isOpen: place.opening_hours.isOpen(),
        periods: place.opening_hours.periods,
        weekdayText: place.opening_hours.weekday_text
      } : null,
      googleUrl: place.url
    }
  }

  async geocodeAddress(address) {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      const geocoder = new this.google.maps.Geocoder()
      
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const result = results[0]
          resolve({
            address: result.formatted_address,
            location: {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng()
            },
            placeId: result.place_id
          })
        } else {
          reject(new Error(`Geocoding failed: ${status}`))
        }
      })
    })
  }
}

// Export a singleton instance
export default new PlacesService()