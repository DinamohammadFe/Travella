// Free Maps Service using OpenStreetMap, Nominatim, and Overpass APIs
// No API keys required - completely free!

/**
 * Geocode a city name to coordinates using Nominatim API
 * @param {string} cityName - Name of the city to geocode
 * @returns {Promise<{lat: number, lng: number, displayName: string}>}
 */
export const geocodeCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('City not found');
    }
    
    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode city: ${error.message}`);
  }
};

/**
 * Fetch tourism attractions near a location using Overpass API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array>} Array of attractions
 */
export const fetchAttractions = async (lat, lng, radius = 5000) => {
  try {
    // Overpass query to find tourism attractions
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"^(attraction|museum|monument|castle|viewpoint|zoo|aquarium|theme_park|gallery)$"](around:${radius},${lat},${lng});
        way["tourism"~"^(attraction|museum|monument|castle|viewpoint|zoo|aquarium|theme_park|gallery)$"](around:${radius},${lat},${lng});
        relation["tourism"~"^(attraction|museum|monument|castle|viewpoint|zoo|aquarium|theme_park|gallery)$"](around:${radius},${lat},${lng});
      );
      out center meta;
    `;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Overpass API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if data has the expected structure
    if (!data || !data.elements || !Array.isArray(data.elements)) {
      console.warn('Unexpected API response structure:', data);
      return [];
    }
    
    // Process and format the results
    const attractions = data.elements.map(element => {
      const lat = element.lat || (element.center && element.center.lat);
      const lon = element.lon || (element.center && element.center.lon);
      
      if (!lat || !lon) return null;
      
      return {
        id: element.id,
        name: element.tags?.name || 'Unnamed Attraction',
        type: element.tags?.tourism || 'attraction',
        lat: lat,
        lng: lon,
        description: element.tags?.description || '',
        website: element.tags?.website || '',
        phone: element.tags?.phone || '',
        openingHours: element.tags?.opening_hours || '',
        address: formatAddress(element.tags)
      };
    }).filter(Boolean); // Remove null entries
    
    return attractions;
  } catch (error) {
    console.error('Attractions fetch error:', error);
    
    // Handle different types of errors
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('status:')) {
      throw new Error('Overpass API is temporarily unavailable. Please try again later.');
    }
    
    throw new Error(`Failed to fetch attractions: ${error.message}`);
  }
};

/**
 * Format address from OSM tags
 * @param {Object} tags - OSM tags object
 * @returns {string} Formatted address
 */
const formatAddress = (tags) => {
  if (!tags) return '';
  
  const parts = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  
  return parts.join(', ');
};

/**
 * Get attraction categories for filtering
 * @returns {Array} Array of category objects
 */
export const getAttractionCategories = () => {
  return [
    { id: 'all', name: 'All Attractions', icon: '🏛️' },
    { id: 'museum', name: 'Museums', icon: '🏛️' },
    { id: 'monument', name: 'Monuments', icon: '🗿' },
    { id: 'castle', name: 'Castles', icon: '🏰' },
    { id: 'viewpoint', name: 'Viewpoints', icon: '🌄' },
    { id: 'zoo', name: 'Zoos', icon: '🦁' },
    { id: 'aquarium', name: 'Aquariums', icon: '🐠' },
    { id: 'theme_park', name: 'Theme Parks', icon: '🎢' },
    { id: 'gallery', name: 'Galleries', icon: '🎨' },
    { id: 'attraction', name: 'Other Attractions', icon: '📍' }
  ];
};

/**
 * Filter attractions by category
 * @param {Array} attractions - Array of attractions
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered attractions
 */
export const filterAttractionsByCategory = (attractions, category) => {
  if (category === 'all') return attractions;
  return attractions.filter(attraction => attraction.type === category);
};