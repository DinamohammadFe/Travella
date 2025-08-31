import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, DEFAULT_MAP_OPTIONS } from '../config/googleMaps'

const GoogleMap = ({ 
  center = DEFAULT_MAP_OPTIONS.center,
  zoom = DEFAULT_MAP_OPTIONS.zoom,
  markers = [],
  onMapClick = null,
  onMarkerClick = null,
  className = "w-full h-96"
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [google, setGoogle] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: GOOGLE_MAPS_LIBRARIES
        })

        const googleMaps = await loader.load()
        setGoogle(googleMaps)

        const mapInstance = new googleMaps.maps.Map(mapRef.current, {
          ...DEFAULT_MAP_OPTIONS,
          center,
          zoom
        })

        setMap(mapInstance)

        // Add click listener if provided
        if (onMapClick) {
          mapInstance.addListener('click', (event) => {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            onMapClick({ lat, lng })
          })
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to initialize Google Maps:', err)
        setError('Failed to load Google Maps. Please check your API key.')
        setLoading(false)
      }
    }

    initializeMap()
  }, [])

  // Update map center and zoom when props change
  useEffect(() => {
    if (map && center) {
      map.setCenter(center)
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map || !google) return

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null))

    // Create new markers
    const newMarkers = markers.map((markerData, index) => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title || `Marker ${index + 1}`,
        icon: markerData.icon || null
      })

      // Add click listener if provided
      if (onMarkerClick) {
        marker.addListener('click', () => {
          onMarkerClick(markerData, index)
        })
      }

      // Add info window if content is provided
      if (markerData.infoWindow) {
        const infoWindow = new google.maps.InfoWindow({
          content: markerData.infoWindow
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      }

      return marker
    })

    setMapMarkers(newMarkers)

    // Fit bounds to show all markers if there are multiple
    if (newMarkers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition())
      })
      map.fitBounds(bounds)
    }
  }, [map, google, markers, onMarkerClick])

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      mapMarkers.forEach(marker => marker.setMap(null))
    }
  }, [])

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-red-600">
          <p className="font-medium">Map Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

// Helper function to create marker data
export const createMarker = ({
  position,
  title = '',
  infoWindow = null,
  icon = null,
  data = null
}) => ({
  position,
  title,
  infoWindow,
  icon,
  data
})

// Helper function to create info window content
export const createInfoWindow = (place) => {
  return `
    <div class="p-2 max-w-xs">
      <h3 class="font-semibold text-lg mb-1">${place.name}</h3>
      ${place.address ? `<p class="text-sm text-gray-600 mb-1">${place.address}</p>` : ''}
      ${place.rating ? `<p class="text-sm">⭐ ${place.rating}</p>` : ''}
      ${place.website ? `<a href="${place.website}" target="_blank" class="text-blue-600 text-sm hover:underline">Visit Website</a>` : ''}
    </div>
  `
}

export default GoogleMap