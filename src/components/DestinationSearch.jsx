import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Clock, Users, Camera, Heart, Filter, SortAsc, Grid, List, Bookmark, Share2, Phone, Globe, DollarSign, Map } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getSuggestions } from '../services/nominatimService'
import { fetchCityImage, validateImageUrl } from '../services/imageService.js'
import { fetchCityAttractionImages } from '../services/wikimediaService.js'

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const DestinationSearch = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [savedPlaces, setSavedPlaces] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]) // Default to London
  const [mapZoom, setMapZoom] = useState(13)
  const [attractionImages, setAttractionImages] = useState([])
  const [showMap, setShowMap] = useState(true)
  const [itemsPerPage] = useState(9)
  const [showMapView, setShowMapView] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState(['Paris, France', 'Rome, Italy', 'Barcelona, Spain'])
  const [destinationSuggestions, setDestinationSuggestions] = useState([
    'Paris, France', 'London, England', 'Rome, Italy', 'Barcelona, Spain',
    'Amsterdam, Netherlands', 'Berlin, Germany', 'Prague, Czech Republic',
    'Vienna, Austria', 'Budapest, Hungary', 'Lisbon, Portugal',
    'Madrid, Spain', 'Florence, Italy', 'Venice, Italy', 'Athens, Greece',
    'Istanbul, Turkey', 'Dublin, Ireland', 'Edinburgh, Scotland',
    'Copenhagen, Denmark', 'Stockholm, Sweden', 'Oslo, Norway'
  ])

  // Mock data for demonstration - similar to TripAdvisor results
  // Function to get destination header image using imageService only
  const getDestinationHeaderImage = async (query) => {
    try {
      const imageResult = await fetchCityImage(query, 800, 600);
      
      // Validate the image URL
      const isValid = await validateImageUrl(imageResult.url);
      if (isValid) {
        return imageResult.url;
      }
      
      // Fallback to default travel image
      return 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg';
    } catch (error) {
      console.error('Error getting header image:', error);
      // Return a reliable fallback image
      return 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg';
    }
  }

  // Function to generate dynamic search results using imageService only
  const generateSearchResults = async (query) => {
    try {
      // Get geocoding data from Nominatim
      let center = { lat: 0, lng: 0, displayName: query };
      try {
        const geocodeResults = await getSuggestions(query, 1);
        if (geocodeResults && geocodeResults.length > 0) {
          const result = geocodeResults[0];
          center = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.displayName
          };
          // Update map state
          setMapCenter([center.lat, center.lng]);
          setMapZoom(12);
          setShowMap(true);
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
      }

      // Get attraction images from Wikimedia Commons
      let attractionImages = [];
      try {
        attractionImages = await fetchCityAttractionImages(query);
        setAttractionImages(attractionImages);
      } catch (imageError) {
        console.error('Error fetching attraction images:', imageError);
      }

      const headerImage = await getDestinationHeaderImage(query);
      
      // Generate sample attractions, hotels, and restaurants for the destination
      const attractions = await generateSampleAttractions(query, attractionImages);
      const hotels = await generateSampleHotels(query);
      const restaurants = await generateSampleRestaurants(query);

      return {
        destination: query,
        description: `Discover the beauty and culture of ${query}. A wonderful destination with rich history, amazing attractions, and unforgettable experiences.`,
        center,
        headerImage,
        categories: [
          { id: 'all', name: 'All', count: attractions.length + hotels.length + restaurants.length },
          { id: 'attractions', name: 'Things to do', count: attractions.length },
          { id: 'hotels', name: 'Places to stay', count: hotels.length },
          { id: 'restaurants', name: 'Restaurants', count: restaurants.length }
        ],
        attractions: [...attractions, ...hotels, ...restaurants]
      };
    } catch (error) {
      console.error('Error generating search results:', error);
      throw error;
    }
  }

  // Generate sample attractions for a destination
  const generateSampleAttractions = async (destination, wikimediaImages = []) => {
    const attractionTemplates = [
      { name: 'Historic Center', category: 'Historic Sites', type: 'attraction', imageQuery: 'historic architecture' },
      { name: 'Main Cathedral', category: 'Religious Sites', type: 'attraction', imageQuery: 'cathedral church' },
      { name: 'City Museum', category: 'Museums', type: 'attraction', imageQuery: 'museum building' },
      { name: 'Central Park', category: 'Parks & Gardens', type: 'attraction', imageQuery: 'city park garden' },
      { name: 'Old Town Square', category: 'Historic Sites', type: 'attraction', imageQuery: 'town square plaza' }
    ];

    const attractions = [];
    for (let i = 0; i < Math.min(5, attractionTemplates.length); i++) {
      const template = attractionTemplates[i];
      let image = 'https://via.placeholder.com/400x300?text=No+Image+Available'; // Default fallback
      
      // Use Wikimedia Commons images if available
      if (wikimediaImages && wikimediaImages.length > i) {
        image = wikimediaImages[i].url;
      } else {
        // Fallback to imageService if no Wikimedia image available
        try {
          const imageResult = await fetchCityImage(destination, 400, 300);
          image = imageResult.url;
        } catch (error) {
          console.error(`Error getting image for ${template.name}:`, error);
          // Keep the default fallback image
        }
      }
      
      attractions.push({
        id: i + 1,
        name: template.name,
        rating: (4.0 + Math.random() * 1.0).toFixed(1),
        reviews: Math.floor(Math.random() * 50000) + 1000,
        category: template.category,
        image,
        type: template.type,
        price: 'Free - €25',
        duration: '1-3 hours',
        distance: `${(Math.random() * 5).toFixed(1)} km`,
        openHours: '9:00 AM - 6:00 PM',
        description: `Popular ${template.category.toLowerCase()} in ${destination}`,
        coordinates: { lat: Math.random() * 0.1, lng: Math.random() * 0.1 }
      });
    }
    return attractions;
  }

  // Generate sample hotels for a destination
  const generateSampleHotels = async (destination) => {
    const hotelTemplates = [
      { name: 'Grand Hotel', category: 'Luxury Hotels', type: 'hotel' },
      { name: 'City Center Hotel', category: 'Business Hotels', type: 'hotel' },
      { name: 'Budget Inn', category: 'Budget Hotels', type: 'hotel' }
    ];

    const hotels = [];
    for (let i = 0; i < hotelTemplates.length; i++) {
      const template = hotelTemplates[i];
      let image = 'https://picsum.photos/400/300?random=' + (i + 6); // Default fallback
      
      try {
        // Use destination name for consistent city images
        const imageResult = await fetchCityImage(destination, 400, 300);
        image = imageResult.url;
      } catch (error) {
        console.error(`Error getting image for ${template.name}:`, error);
        // Keep the fallback image
      }
      
      hotels.push({
        id: i + 6,
        name: template.name,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        reviews: Math.floor(Math.random() * 10000) + 100,
        category: template.category,
        image,
        type: template.type,
        price: `€${Math.floor(Math.random() * 200) + 50} - €${Math.floor(Math.random() * 300) + 200}`,
        duration: 'Per night',
        distance: `${(Math.random() * 3).toFixed(1)} km`,
        openHours: '24/7',
        description: `Comfortable ${template.category.toLowerCase()} in ${destination}`,
        coordinates: { lat: Math.random() * 0.1, lng: Math.random() * 0.1 }
      });
    }
    return hotels;
  }

  // Generate sample restaurants for a destination
  const generateSampleRestaurants = async (destination) => {
    const restaurantTemplates = [
      { name: 'Local Cuisine Restaurant', category: 'Local Cuisine', type: 'restaurant' },
      { name: 'Fine Dining', category: 'Fine Dining', type: 'restaurant' },
      { name: 'Casual Bistro', category: 'Bistros', type: 'restaurant' }
    ];

    const restaurants = [];
    for (let i = 0; i < restaurantTemplates.length; i++) {
      const template = restaurantTemplates[i];
      let image = 'https://picsum.photos/400/300?random=' + (i + 9); // Default fallback
      
      try {
        // Use destination name for consistent city images
        const imageResult = await fetchCityImage(destination, 400, 300);
        image = imageResult.url;
      } catch (error) {
        console.error(`Error getting image for ${template.name}:`, error);
        // Keep the fallback image
      }
      
      restaurants.push({
        id: i + 9,
        name: template.name,
        rating: (3.8 + Math.random() * 1.2).toFixed(1),
        reviews: Math.floor(Math.random() * 5000) + 50,
        category: template.category,
        image,
        type: template.type,
        price: `€${Math.floor(Math.random() * 30) + 10} - €${Math.floor(Math.random() * 50) + 30}`,
        duration: '1-2 hours',
        distance: `${(Math.random() * 2).toFixed(1)} km`,
        openHours: '11:00 AM - 11:00 PM',
        description: `Delicious ${template.category.toLowerCase()} in ${destination}`,
        coordinates: { lat: Math.random() * 0.1, lng: Math.random() * 0.1 }
      });
    }
    return restaurants;
  }

  const mockResults = {
    destination: 'Paris, France',
    description: 'Paris has a reputation for being the ultimate romantic getaway. But what visitors really swoon over is the city itself.',
    center: { lat: 48.8566, lng: 2.3522, displayName: 'Paris, France' },
    categories: [
      { id: 'all', name: 'All', count: 24 },
      { id: 'attractions', name: 'Things to do', count: 8 },
      { id: 'hotels', name: 'Places to stay', count: 8 },
      { id: 'restaurants', name: 'Restaurants', count: 8 }
    ],
    attractions: [
      {
        id: 1,
        name: 'Eiffel Tower',
        rating: 4.6,
        reviews: 143603,
        category: 'Observation Decks & Towers',
        image: 'https://i.postimg.cc/nrFy2hBt/pexels-thorsten-technoman-109353-338515.jpg',
        type: 'attraction',
        price: 'Free - €29',
        duration: '2-3 hours',
        distance: '0.5 km',
        openHours: '9:30 AM - 11:45 PM',
        description: 'Iconic iron lattice tower and symbol of Paris',
        coordinates: { lat: 48.8584, lng: 2.2945 }
      },
      {
        id: 2,
        name: 'Louvre Museum',
        rating: 4.6,
        reviews: 104052,
        category: 'Art Museums',
        image: 'https://i.postimg.cc/W3vLDn4z/pexels-pixabay-2363.jpg',
        type: 'attraction',
        price: '€17',
        duration: '3-4 hours',
        distance: '1.2 km',
        openHours: '9:00 AM - 6:00 PM',
        description: 'World\'s largest art museum and historic monument',
        coordinates: { lat: 48.8606, lng: 2.3376 }
      },
      {
        id: 3,
        name: 'Arc de Triomphe',
        rating: 4.5,
        reviews: 46372,
        category: 'Architectural Buildings',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'attraction',
        price: '€13',
        duration: '1-2 hours',
        distance: '2.1 km',
        openHours: '10:00 AM - 10:30 PM',
        description: 'Triumphal arch honoring those who fought for France',
        coordinates: { lat: 48.8738, lng: 2.2950 }
      },
      {
        id: 4,
        name: 'Notre-Dame Cathedral',
        rating: 4.4,
        reviews: 89234,
        category: 'Religious Sites',
        image: 'https://i.postimg.cc/FRVt0LfZ/notre-dame-490222_1280.jpg',
        type: 'attraction',
        price: 'Free',
        duration: '1-2 hours',
        distance: '0.8 km',
        openHours: '8:00 AM - 6:45 PM',
        description: 'Medieval Catholic cathedral with Gothic architecture',
        coordinates: { lat: 48.8530, lng: 2.3499 }
      },
      {
        id: 5,
        name: 'Sacré-Cœur Basilica',
        rating: 4.5,
        reviews: 67891,
        category: 'Religious Sites',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'attraction',
        price: 'Free',
        duration: '1-2 hours',
        distance: '3.5 km',
        openHours: '6:00 AM - 10:30 PM',
        description: 'Roman Catholic church and minor basilica in Montmartre',
        coordinates: { lat: 48.8867, lng: 2.3431 }
      },
      {
        id: 6,
        name: 'Champs-Élysées',
        rating: 4.3,
        reviews: 45123,
        category: 'Scenic Walking Areas',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'attraction',
        price: 'Free',
        duration: '2-3 hours',
        distance: '1.8 km',
        openHours: '24 hours',
        description: 'Famous avenue lined with shops, cafés, and theaters',
        coordinates: { lat: 48.8698, lng: 2.3076 }
      },
      {
        id: 7,
        name: 'Versailles Palace',
        rating: 4.7,
        reviews: 78456,
        category: 'Castles',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'attraction',
        price: '€20',
        duration: '4-6 hours',
        distance: '20 km',
        openHours: '9:00 AM - 6:30 PM',
        description: 'Opulent royal château with magnificent gardens',
        coordinates: { lat: 48.8049, lng: 2.1204 }
      },
      {
        id: 8,
        name: 'Musée d\'Orsay',
        rating: 4.6,
        reviews: 56789,
        category: 'Art Museums',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'attraction',
        price: '€16',
        duration: '2-3 hours',
        distance: '1.0 km',
        openHours: '9:30 AM - 6:00 PM',
        description: 'Museum housing world\'s finest collection of Impressionist art',
        coordinates: { lat: 48.8600, lng: 2.3266 }
      }
    ],
    hotels: [
      {
        id: 9,
        name: 'Grand Hotel Du Palais Royal',
        rating: 5.0,
        reviews: 1839,
        price: '€411/night',
        category: 'Luxury Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Bar', 'Concierge'],
        distance: '0.3 km',
        description: 'Luxury 5-star hotel in the heart of Paris with elegant rooms',
        coordinates: { lat: 48.8656, lng: 2.3212 }
      },
      {
        id: 10,
        name: 'Hotel Esprit Saint Germain',
        rating: 4.5,
        reviews: 924,
        price: '€322/night',
        category: 'Boutique Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Room Service'],
        distance: '1.1 km',
        description: 'Charming boutique hotel with personalized service',
        coordinates: { lat: 48.8534, lng: 2.3364 }
      },
      {
        id: 11,
        name: 'Cadet Residence',
        rating: 4.5,
        reviews: 860,
        price: '€154/night',
        category: 'Apartment Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Kitchenette', 'Laundry', 'Parking'],
        distance: '2.5 km',
        description: 'Modern apartment-style accommodation with kitchen facilities',
        coordinates: { lat: 48.8756, lng: 2.3489 }
      },
      {
        id: 12,
        name: 'Hotel des Grands Boulevards',
        rating: 4.3,
        reviews: 1245,
        price: '€275/night',
        category: 'Design Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Fitness Center'],
        distance: '1.8 km',
        description: 'Contemporary design hotel with stylish interiors',
        coordinates: { lat: 48.8712, lng: 2.3423 }
      },
      {
        id: 13,
        name: 'Le Marais Boutique Hotel',
        rating: 4.4,
        reviews: 687,
        price: '€198/night',
        category: 'Boutique Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Continental Breakfast', 'Concierge'],
        distance: '0.9 km',
        description: 'Intimate hotel in the historic Marais district',
        coordinates: { lat: 48.8567, lng: 2.3612 }
      },
      {
        id: 14,
        name: 'Budget Inn Paris',
        rating: 4.0,
        reviews: 2134,
        price: '€89/night',
        category: 'Budget Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Continental Breakfast', '24h Reception'],
        distance: '3.2 km',
        description: 'Comfortable budget accommodation with essential amenities',
        coordinates: { lat: 48.8345, lng: 2.3789 }
      },
      {
        id: 15,
        name: 'Paris Luxury Suites',
        rating: 4.8,
        reviews: 456,
        price: '€520/night',
        category: 'Luxury Hotel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Butler Service', 'Valet Parking'],
        distance: '0.7 km',
        description: 'Ultra-luxury suites with panoramic city views',
        coordinates: { lat: 48.8623, lng: 2.3445 }
      },
      {
        id: 16,
        name: 'Montmartre Hostel',
        rating: 4.2,
        reviews: 3421,
        price: '€45/night',
        category: 'Hostel',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'hotel',
        amenities: ['Free WiFi', 'Shared Kitchen', 'Common Area', 'Lockers'],
        distance: '4.1 km',
        description: 'Social hostel in artistic Montmartre with great atmosphere',
        coordinates: { lat: 48.8867, lng: 2.3431 }
      }
    ],
    restaurants: [
      {
        id: 17,
        name: 'Le Jules Verne',
        rating: 4.2,
        reviews: 2847,
        price: '€€€€',
        category: 'Fine Dining',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '0.5 km',
        openHours: '12:00 PM - 1:30 PM, 7:30 PM - 9:30 PM',
        description: 'Michelin-starred restaurant in the Eiffel Tower',
        coordinates: { lat: 48.8584, lng: 2.2945 }
      },
      {
        id: 18,
        name: 'L\'Ami Jean',
        rating: 4.5,
        reviews: 1923,
        price: '€€€',
        category: 'Bistro',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '1.2 km',
        openHours: '12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM',
        description: 'Traditional French bistro with hearty dishes',
        coordinates: { lat: 48.8556, lng: 2.3019 }
      },
      {
        id: 19,
        name: 'Breizh Café',
        rating: 4.4,
        reviews: 3456,
        price: '€€',
        category: 'Crêperie',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '0.8 km',
        openHours: '11:30 AM - 11:00 PM',
        description: 'Modern crêperie with creative sweet and savory options',
        coordinates: { lat: 48.8567, lng: 2.3612 }
      },
      {
        id: 20,
        name: 'L\'As du Fallafel',
        rating: 4.3,
        reviews: 5678,
        price: '€',
        category: 'Middle Eastern',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'Middle Eastern',
        distance: '0.9 km',
        openHours: '11:00 AM - 12:00 AM',
        description: 'Famous falafel spot in the Marais district',
        coordinates: { lat: 48.8567, lng: 2.3612 }
      },
      {
        id: 21,
        name: 'Café de Flore',
        rating: 4.1,
        reviews: 4321,
        price: '€€',
        category: 'Café',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '1.5 km',
        openHours: '7:00 AM - 2:00 AM',
        description: 'Historic café frequented by famous writers and artists',
        coordinates: { lat: 48.8542, lng: 2.3320 }
      },
      {
        id: 22,
        name: 'Pink Mamma',
        rating: 4.6,
        reviews: 2134,
        price: '€€€',
        category: 'Italian',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'Italian',
        distance: '2.1 km',
        openHours: '12:00 PM - 2:00 AM',
        description: 'Trendy Italian restaurant with Instagram-worthy decor',
        coordinates: { lat: 48.8814, lng: 2.3364 }
      },
      {
        id: 23,
        name: 'Du Pain et des Idées',
        rating: 4.7,
        reviews: 1876,
        price: '€',
        category: 'Bakery',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '1.8 km',
        openHours: '6:45 AM - 8:20 PM',
        description: 'Artisanal bakery famous for its pastries and bread',
        coordinates: { lat: 48.8678, lng: 2.3612 }
      },
      {
        id: 24,
        name: 'Le Comptoir du Relais',
        rating: 4.4,
        reviews: 2987,
        price: '€€€',
        category: 'Bistro',
        image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
        type: 'restaurant',
        cuisine: 'French',
        distance: '1.3 km',
        openHours: '12:00 PM - 5:00 PM, 8:30 PM - 11:00 PM',
        description: 'Classic Parisian bistro with seasonal menu',
        coordinates: { lat: 48.8534, lng: 2.3364 }
      }
    ]
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Add to recent searches if not already present
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)])
    }
    
    setIsLoading(true)
    setCurrentPage(1) // Reset to first page on new search
    setShowSuggestions(false)
    
    try {
      const results = await generateSearchResults(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching for destination:', error)
      // Show error state or fallback results
      setSearchResults({
        destination: searchQuery,
        description: `Sorry, we couldn't find detailed information about ${searchQuery}. Please try a different search term.`,
        center: { lat: 0, lng: 0, displayName: searchQuery },
        headerImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        categories: [
          { id: 'all', name: 'All', count: 0 },
          { id: 'attractions', name: 'Things to do', count: 0 },
          { id: 'hotels', name: 'Places to stay', count: 0 },
          { id: 'restaurants', name: 'Restaurants', count: 0 }
        ],
        attractions: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = async (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(value.length > 0)
    
    // Get suggestions from Nominatim API
    if (value.length > 2) {
      try {
        const nominatimSuggestions = await getSuggestions(value, 5)
        
        const suggestions = nominatimSuggestions.map(s => s.shortName)
        setDestinationSuggestions(suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }
  }

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    // Trigger search automatically
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches(prev => [suggestion, ...prev.slice(0, 4)])
    }
    setIsLoading(true)
    setCurrentPage(1)
    
    try {
      const results = await generateSearchResults(suggestion)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching for destination:', error)
      // Show error state or fallback results
      setSearchResults({
        destination: suggestion,
        description: `Sorry, we couldn't find detailed information about ${suggestion}. Please try a different search term.`,
        center: { lat: 0, lng: 0, displayName: suggestion },
        headerImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        categories: [
          { id: 'all', name: 'All', count: 0 },
          { id: 'attractions', name: 'Things to do', count: 0 },
          { id: 'hotels', name: 'Places to stay', count: 0 },
          { id: 'restaurants', name: 'Restaurants', count: 0 }
        ],
        attractions: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredSuggestions = () => {
    if (!searchQuery) return []
    return destinationSuggestions.filter(destination =>
      destination.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, sortBy, minRating, priceRange])

  // Reset pagination when search results change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchResults])

  const toggleSavePlace = (placeId) => {
    setSavedPlaces(prev => {
      const newSaved = new Set(prev)
      if (newSaved.has(placeId)) {
        newSaved.delete(placeId)
      } else {
        newSaved.add(placeId)
      }
      return newSaved
    })
  }

  const getFilteredResults = () => {
    if (!searchResults) return []
    
    let results = []
    if (activeCategory === 'all') {
      results = [...searchResults.attractions, ...searchResults.hotels, ...searchResults.restaurants]
    } else if (activeCategory === 'attractions') {
      results = searchResults.attractions
    } else if (activeCategory === 'hotels') {
      results = searchResults.hotels
    } else if (activeCategory === 'restaurants') {
      results = searchResults.restaurants
    }

    // Apply rating filter
    results = results.filter(item => item.rating >= minRating)

    // Apply price filter for hotels
    if (activeCategory === 'hotels' || activeCategory === 'all') {
      results = results.filter(item => {
        if (item.type !== 'hotel') return true
        const price = parseInt(item.price.replace(/[€$]/g, '').split('/')[0])
        return price >= priceRange[0] && price <= priceRange[1]
      })
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price':
          if (a.type === 'hotel' && b.type === 'hotel') {
            const priceA = parseInt(a.price.replace(/[€$]/g, '').split('/')[0])
            const priceB = parseInt(b.price.replace(/[€$]/g, '').split('/')[0])
            return priceA - priceB
          }
          return 0
        case 'distance':
          const distA = parseFloat(a.distance?.replace(' km', '') || '0')
          const distB = parseFloat(b.distance?.replace(' km', '') || '0')
          return distA - distB
        case 'popularity':
        default:
          return b.reviews - a.reviews
      }
    })

    return results
  }

  const getPaginatedResults = () => {
    const filteredResults = getFilteredResults()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredResults.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredResults = getFilteredResults()
    return Math.ceil(filteredResults.length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of results
    document.querySelector('.search-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const ResultCard = ({ item }) => {
    const getTypeLabel = (type) => {
      switch (type) {
        case 'attraction': return 'Attraction'
        case 'hotel': return 'Hotel'
        case 'restaurant': return 'Restaurant'
        default: return type
      }
    }

    const getTypeColor = (type) => {
      switch (type) {
        case 'attraction': return 'bg-blue-500'
        case 'hotel': return 'bg-green-500'
        case 'restaurant': return 'bg-orange-500'
        default: return 'bg-gray-500'
      }
    }

    return (
      <div className={`bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-40 sm:h-48'}`}>
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className={`${getTypeColor(item.type)} text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium shadow-md`}>
              {getTypeLabel(item.type)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleSavePlace(item.id)
            }}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
          >
            <Heart 
              className={`w-4 h-4 ${savedPlaces.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        </div>
        <div className={`p-3 sm:p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 flex-1">{item.name}</h3>
            {item.price && (
              <span className="text-base sm:text-lg font-semibold text-green-600 ml-2">{item.price}</span>
            )}
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(item.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-2 text-xs sm:text-sm font-medium">{item.rating}</span>
            <span className="ml-1 text-xs sm:text-sm text-gray-600">({item.reviews.toLocaleString()})</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mb-2">{item.category}</p>
          {item.description && (
            <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {item.distance && (
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {item.distance}
              </div>
            )}
            {item.duration && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {item.duration}
              </div>
            )}
            {item.cuisine && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-3 h-3 mr-1">🍽️</span>
                {item.cuisine}
              </div>
            )}
          </div>

          {item.amenities && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
              {item.amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{item.amenities.length - 3} more</span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  // Share functionality
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {item.type === 'restaurant' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Phone functionality
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/city/${encodeURIComponent(searchResults.destination)}`)
              }}
              className="bg-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-teal-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View Details
            </button>
          </div>
        </div>
       </div>
     )
   }

  return (
    <div className="w-full">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto search-container">
          <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mr-3 sm:mr-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go? (e.g., Paris, Tokyo, New York)"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full text-gray-800 focus:outline-none text-base sm:text-lg lg:text-xl placeholder-gray-500 font-medium search-input focus:placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 sm:px-8 sm:py-5 lg:py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-base sm:text-lg lg:text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 min-w-[120px] sm:min-w-[140px] lg:min-w-[160px] search-button focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Searching...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
          
          {/* Autocomplete Suggestions */}
              {showSuggestions && (getFilteredSuggestions().length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto" style={{marginTop: '2px'}}>
              {/* Recent Searches */}
              {searchQuery === '' && recentSearches.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      {search}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Filtered Suggestions */}
              {getFilteredSuggestions().length > 0 && (
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h4>
                  {getFilteredSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-teal-200 rounded-full search-decorative"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 bg-teal-300 rounded-full search-decorative" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 -left-4 w-2 h-2 bg-teal-100 rounded-full search-decorative" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* City Suggestions */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            {['Paris', 'Tokyo', 'New York', 'London', 'Dubai'].map((city, index) => (
              <button
                key={city}
                onClick={() => {
                  navigate(`/city/${encodeURIComponent(city)}`);
                }}
                className="city-suggestion bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-xs font-normal"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8 mx-4 sm:mx-6 lg:mx-8 shadow-xl">
          <div className="max-w-7xl mx-auto">
            {/* Destination Header */}
            <div className="mb-6 sm:mb-8 text-center">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
                <img 
                  src={searchResults.headerImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'}
                  alt={searchResults.destination}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{searchResults.destination}</h1>
                    <div className="flex items-center justify-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-base sm:text-lg">{searchResults.center?.displayName || searchResults.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                {searchResults.description}
              </p>
            </div>

            {/* Controls Bar */}
            <div className="mb-6 sm:mb-8 px-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {searchResults.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm transform hover:scale-105 ${
                        activeCategory === category.id
                          ? 'bg-teal-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                {/* View and Sort Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      showFilters ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Price: Low to High</option>
                    <option value="distance">Nearest First</option>
                  </select>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors duration-200 ${
                        viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors duration-200 ${
                        viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowMapView(!showMapView)}
                      className={`p-2 transition-colors duration-200 ${
                        showMapView ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </select>
                    </div>

                    {/* Price Range Filter (for hotels) */}
                    {(activeCategory === 'hotels' || activeCategory === 'all') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range (per night)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Min"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Max"
                          />
                          <span className="text-sm text-gray-500">€</span>
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setMinRating(0)
                          setPriceRange([0, 500])
                          setCurrentPage(1)
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map View */}
            {showMapView && searchResults && (
              <div className="px-4 sm:px-0 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
                    <p className="text-sm text-gray-600">
                      Showing {getFilteredResults().length} results on the map
                    </p>
                  </div>
                  <div className="h-96 w-full relative">
                    {mapCenter && mapCenter.length === 2 && typeof mapCenter[0] === 'number' && typeof mapCenter[1] === 'number' ? (
                      <MapContainer 
                        center={mapCenter} 
                        zoom={mapZoom} 
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-lg"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={mapCenter}>
                          <Popup>
                            <div className="text-center">
                              <h4 className="font-semibold">{searchResults.destination}</h4>
                              <p className="text-sm text-gray-600">{getFilteredResults().length} places found</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    ) : (
                      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapPin className="w-12 h-12 mx-auto mb-2" />
                          <p>Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attraction Images from Wikimedia Commons */}
            {attractionImages && attractionImages.length > 0 && (
              <div className="px-4 sm:px-0 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Attraction Images</h3>
                    <p className="text-sm text-gray-600">
                      Popular attractions and landmarks in {searchResults.destination}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {attractionImages.slice(0, 8).map((image, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-lg">
                          <img 
                            src={image.url}
                            alt={image.title || `Attraction ${index + 1}`}
                            className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          {image.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-white text-xs font-medium truncate">{image.title}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {!showMapView && (
              <div className={`px-4 sm:px-0 search-results ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
                  : 'flex flex-col gap-4'
              }`}>
                {getPaginatedResults().length > 0 ? (
                  getPaginatedResults().map((item) => (
                    <ResultCard key={item.id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                    <button
                      onClick={() => {
                        setActiveCategory('all')
                        setMinRating(0)
                        setPriceRange([0, 500])
                        setCurrentPage(1)
                      }}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!showMapView && getFilteredResults().length > itemsPerPage && (
              <div className="flex justify-center items-center mt-8 px-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  {[...Array(getTotalPages())].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-teal-500 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
                
                <div className="ml-4 text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredResults().length)} of {getFilteredResults().length} results
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DestinationSearch