// Google Maps configuration
// Replace with your actual Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'your-google-maps-api-key-here'

// Google Maps libraries to load
export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry']

// Default map options
export const DEFAULT_MAP_OPTIONS = {
  zoom: 13,
  center: { lat: 40.7128, lng: -74.0060 }, // New York City default
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

// Place types for search
export const PLACE_TYPES = {
  TOURIST_ATTRACTION: 'tourist_attraction',
  RESTAURANT: 'restaurant',
  LODGING: 'lodging',
  MUSEUM: 'museum',
  PARK: 'park',
  SHOPPING_MALL: 'shopping_mall',
  AMUSEMENT_PARK: 'amusement_park'
}