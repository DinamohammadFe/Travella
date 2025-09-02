import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Clock, Phone, Globe, ArrowLeft, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCityImage } from '../services/cityImages.js';

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CityDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attractions');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock city data - in a real app, this would come from an API
  const cityData = {
    paris: {
      name: 'Paris',
      country: 'France',
      description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
      image: 'https://i.postimg.cc/Gthmqhhn/pexels-pierre-blache-651604-3105066.jpg',
      coordinates: [48.8566, 2.3522],
      attractions: [
        {
          id: 1,
          name: 'Eiffel Tower',
          rating: 4.6,
          reviews: 143603,
          category: 'Landmark',
          image: getCityImage('Eiffel Tower', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Iconic iron lattice tower and symbol of Paris',
          address: 'Champ de Mars, 5 Avenue Anatole France',
          hours: '9:30 AM - 11:45 PM',
          coordinates: [48.8584, 2.2945]
        },
        {
          id: 2,
          name: 'Louvre Museum',
          rating: 4.7,
          reviews: 104052,
          category: 'Museum',
          image: getCityImage('Louvre Museum', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'World\'s largest art museum and historic monument',
          address: 'Rue de Rivoli, 75001 Paris',
          hours: '9:00 AM - 6:00 PM',
          coordinates: [48.8606, 2.3376]
        },
        {
          id: 3,
          name: 'Notre-Dame Cathedral',
          rating: 4.5,
          reviews: 89234,
          category: 'Religious Site',
          image: getCityImage('Notre Dame Cathedral', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Medieval Catholic cathedral with Gothic architecture',
          address: '6 Parvis Notre-Dame, 75004 Paris',
          hours: '8:00 AM - 6:45 PM',
          coordinates: [48.8530, 2.3499]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'Hotel Plaza Athénée',
          rating: 4.8,
          reviews: 2341,
          category: 'Luxury Hotel',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$850/night',
          description: 'Luxury palace hotel with Eiffel Tower views',
          address: '25 Avenue Montaigne, 75008 Paris',
          amenities: ['Spa', 'Restaurant', 'Bar', 'Fitness Center'],
          coordinates: [48.8656, 2.3048]
        },
        {
          id: 2,
          name: 'Hotel des Grands Boulevards',
          rating: 4.4,
          reviews: 1876,
          category: 'Boutique Hotel',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$320/night',
          description: 'Stylish boutique hotel in historic building',
          address: '17 Boulevard Poissonnière, 75002 Paris',
          amenities: ['Restaurant', 'Bar', 'Concierge'],
          coordinates: [48.8708, 2.3428]
        },
        {
          id: 3,
          name: 'Hotel Malte Opera',
          rating: 4.2,
          reviews: 3421,
          category: 'Mid-Range Hotel',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$180/night',
          description: 'Comfortable hotel near Opera district',
          address: '63 Rue de Richelieu, 75002 Paris',
          amenities: ['WiFi', 'Breakfast', 'Concierge'],
          coordinates: [48.8675, 2.3389]
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Le Jules Verne',
          rating: 4.3,
          reviews: 5432,
          category: 'Fine Dining',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'French',
          priceRange: '$$$',
          description: 'Michelin-starred restaurant in the Eiffel Tower',
          address: 'Eiffel Tower, 2nd Floor, 75007 Paris',
          hours: '12:00 PM - 1:30 PM, 7:00 PM - 9:30 PM',
          coordinates: [48.8584, 2.2945]
        },
        {
          id: 2,
          name: 'L\'As du Fallafel',
          rating: 4.5,
          reviews: 8765,
          category: 'Street Food',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'Middle Eastern',
          priceRange: '$',
          description: 'Famous falafel spot in the Marais district',
          address: '34 Rue des Rosiers, 75004 Paris',
          hours: '11:00 AM - 12:00 AM',
          coordinates: [48.8571, 2.3594]
        },
        {
          id: 3,
          name: 'Breizh Café',
          rating: 4.4,
          reviews: 3210,
          category: 'Casual Dining',
          image: getCityImage('Paris', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'French (Crêpes)',
          priceRange: '$$',
          description: 'Modern crêperie with creative combinations',
          address: '109 Rue Vieille du Temple, 75003 Paris',
          hours: '11:30 AM - 11:00 PM',
          coordinates: [48.8606, 2.3622]
        }
      ]
    },
    'new york': {
      name: 'New York',
      country: 'United States',
      description: 'The city that never sleeps, known for its iconic skyline, Broadway shows, and diverse culture.',
      image: getCityImage('New York', 'https://via.placeholder.com/800x400/6b7280/ffffff?text=City+Header'),
      coordinates: [40.7128, -74.0060],
      attractions: [
        {
          id: 1,
          name: 'Statue of Liberty',
          rating: 4.5,
          reviews: 67890,
          category: 'Landmark',
          image: getCityImage('Statue of Liberty', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Iconic symbol of freedom and democracy',
          address: 'Liberty Island, New York, NY',
          hours: '9:00 AM - 5:00 PM',
          coordinates: [40.6892, -74.0445]
        },
        {
          id: 2,
          name: 'Central Park',
          rating: 4.6,
          reviews: 89234,
          category: 'Park',
          image: getCityImage('Central Park', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Massive urban park in the heart of Manhattan',
          address: 'New York, NY 10024',
          hours: '6:00 AM - 1:00 AM',
          coordinates: [40.7829, -73.9654]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'The Plaza Hotel',
          rating: 4.4,
          reviews: 5432,
          category: 'Luxury Hotel',
          image: getCityImage('New York', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$750/night',
          description: 'Iconic luxury hotel overlooking Central Park',
          address: '768 5th Ave, New York, NY 10019',
          amenities: ['Spa', 'Restaurant', 'Bar', 'Concierge'],
          coordinates: [40.7648, -73.9754]
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Katz\'s Delicatessen',
          rating: 4.3,
          reviews: 12345,
          category: 'Casual Dining',
          image: getCityImage('New York', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'American (Deli)',
          priceRange: '$$',
          description: 'Famous for pastrami sandwiches since 1888',
          address: '205 E Houston St, New York, NY 10002',
          hours: '8:00 AM - 10:45 PM',
          coordinates: [40.7223, -73.9873]
        }
      ]
    },
    london: {
      name: 'London',
      country: 'United Kingdom',
      description: 'Historic capital city blending royal heritage with modern innovation.',
      image: getCityImage('London', 'https://via.placeholder.com/800x400/6b7280/ffffff?text=City+Header'),
      coordinates: [51.5074, -0.1278],
      attractions: [
        {
          id: 1,
          name: 'Big Ben',
          rating: 4.5,
          reviews: 78901,
          category: 'Landmark',
          image: getCityImage('Big Ben', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Iconic clock tower and symbol of London',
          address: 'Westminster, London SW1A 0AA',
          hours: 'External viewing only',
          coordinates: [51.4994, -0.1245]
        },
        {
          id: 2,
          name: 'British Museum',
          rating: 4.7,
          reviews: 65432,
          category: 'Museum',
          image: getCityImage('British Museum', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'World-famous museum with ancient artifacts',
          address: 'Great Russell St, Bloomsbury, London WC1B 3DG',
          hours: '10:00 AM - 5:00 PM',
          coordinates: [51.5194, -0.1270]
        },
        {
          id: 3,
          name: 'Buckingham Palace',
          rating: 4.4,
          reviews: 89123,
          category: 'Landmark',
          image: getCityImage('Buckingham Palace', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Official residence of the British monarch',
          address: 'Westminster, London SW1A 1AA',
          hours: '9:30 AM - 7:30 PM (Summer)',
          coordinates: [51.5014, -0.1419]
        },
        {
          id: 4,
          name: 'Tower Bridge',
          rating: 4.6,
          reviews: 72456,
          category: 'Landmark',
          image: getCityImage('Tower Bridge', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Iconic Victorian bridge with glass walkways',
          address: 'Tower Bridge Rd, London SE1 2UP',
          hours: '9:30 AM - 6:00 PM',
          coordinates: [51.5055, -0.0754]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'The Ritz London',
          rating: 4.6,
          reviews: 4321,
          category: 'Luxury Hotel',
          image: getCityImage('London', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$650/night',
          description: 'Legendary luxury hotel in Piccadilly',
          address: '150 Piccadilly, St. James\'s, London W1J 9BR',
          amenities: ['Spa', 'Restaurant', 'Bar', 'Afternoon Tea'],
          coordinates: [51.5074, -0.1419]
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Dishoom',
          rating: 4.5,
          reviews: 8765,
          category: 'Casual Dining',
          image: getCityImage('London', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'Indian',
          priceRange: '$$',
          description: 'Bombay-style café with authentic Indian cuisine',
          address: '12 Upper St Martin\'s Ln, London WC2H 9FB',
          hours: '8:00 AM - 11:00 PM',
          coordinates: [51.5103, -0.1281]
        }
      ]
    },
    dubai: {
      name: 'Dubai',
      country: 'United Arab Emirates',
      description: 'Futuristic city known for luxury shopping, ultramodern architecture, and vibrant nightlife.',
      image: getCityImage('Dubai', 'https://via.placeholder.com/800x400/6b7280/ffffff?text=City+Header'),
      coordinates: [25.2048, 55.2708],
      attractions: [
        {
          id: 1,
          name: 'Burj Khalifa',
          rating: 4.6,
          reviews: 98765,
          category: 'Landmark',
          image: getCityImage('Burj Khalifa', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'World\'s tallest building with stunning views',
          address: '1 Sheikh Mohammed bin Rashid Blvd, Dubai',
          hours: '8:30 AM - 11:00 PM',
          coordinates: [25.1972, 55.2744]
        },
        {
          id: 2,
          name: 'Dubai Mall',
          rating: 4.4,
          reviews: 76543,
          category: 'Shopping',
          image: getCityImage('Dubai Mall', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'One of the world\'s largest shopping malls',
          address: 'Financial Centre Rd, Dubai',
          hours: '10:00 AM - 12:00 AM',
          coordinates: [25.1975, 55.2796]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'Burj Al Arab',
          rating: 4.8,
          reviews: 6789,
          category: 'Luxury Hotel',
          image: getCityImage('Dubai', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$1200/night',
          description: 'Iconic sail-shaped luxury hotel',
          address: 'Jumeirah St, Dubai',
          amenities: ['Spa', 'Private Beach', 'Helicopter Pad', 'Butler Service'],
          coordinates: [25.1413, 55.1853]
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Pierchic',
          rating: 4.7,
          reviews: 3456,
          category: 'Fine Dining',
          image: getCityImage('Dubai', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'Seafood',
          priceRange: '$$$',
          description: 'Overwater restaurant with stunning views',
          address: 'Al Sufouh Rd, Dubai',
          hours: '12:30 PM - 3:00 PM, 7:00 PM - 11:30 PM',
          coordinates: [25.1413, 55.1853]
        }
      ]
    },
    tokyo: {
      name: 'Tokyo',
      country: 'Japan',
      description: 'A bustling metropolis blending traditional culture with cutting-edge technology.',
      image: getCityImage('Tokyo', 'https://via.placeholder.com/800x400/6b7280/ffffff?text=City+Header'),
      coordinates: [35.6762, 139.6503],
      attractions: [
        {
          id: 1,
          name: 'Tokyo Skytree',
          rating: 4.5,
          reviews: 89234,
          category: 'Landmark',
          image: getCityImage('Tokyo Skytree', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Tallest structure in Japan with panoramic city views',
          address: '1 Chome-1-2 Oshiage, Sumida City',
          hours: '8:00 AM - 10:00 PM',
          coordinates: [35.7101, 139.8107]
        },
        {
          id: 2,
          name: 'Senso-ji Temple',
          rating: 4.4,
          reviews: 67890,
          category: 'Religious Site',
          image: getCityImage('Senso-ji Temple', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Attraction'),
          description: 'Tokyo\'s oldest temple, founded in 628 AD with traditional architecture',
          address: '2-3-1 Asakusa, Taito City',
          hours: '6:00 AM - 5:00 PM',
          coordinates: [35.7148, 139.7967]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'Park Hyatt Tokyo',
          rating: 4.7,
          reviews: 3456,
          category: 'Luxury Hotel',
          image: getCityImage('Tokyo', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Hotel'),
          price: '$650/night',
          description: 'Luxury hotel with stunning city views',
          address: '3-7-1-2 Nishi Shinjuku, Shinjuku City',
          amenities: ['Spa', 'Pool', 'Restaurant', 'Bar'],
          coordinates: [35.6870, 139.6953]
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Sukiyabashi Jiro',
          rating: 4.8,
          reviews: 2345,
          category: 'Fine Dining',
          image: getCityImage('Tokyo', 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Restaurant'),
          cuisine: 'Japanese (Sushi)',
          priceRange: '$$$',
          description: 'World-renowned sushi restaurant',
          address: 'Tsukamoto Sogyo Building, Ginza',
          hours: '11:30 AM - 2:00 PM, 5:00 PM - 8:30 PM',
          coordinates: [35.6719, 139.7648]
        }
      ]
    }
  };

  const currentCity = cityData[cityName?.toLowerCase()] || cityData.paris;

  // Add error handling and debugging
  useEffect(() => {
    console.log('CityDetails mounted with cityName:', cityName);
    console.log('Current city data:', currentCity);
    if (!currentCity) {
      console.error('No city data found for:', cityName);
    }
  }, [cityName, currentCity]);

  const categories = {
    attractions: ['all', 'Landmark', 'Museum', 'Religious Site', 'Park'],
    hotels: ['all', 'Luxury Hotel', 'Boutique Hotel', 'Mid-Range Hotel'],
    restaurants: ['all', 'Fine Dining', 'Casual Dining', 'Street Food']
  };

  const getCurrentData = () => {
    let data = currentCity[activeTab] || [];
    if (selectedCategory !== 'all') {
      data = data.filter(item => item.category === selectedCategory);
    }
    return data;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderCard = (item) => {
    const isAttraction = activeTab === 'attractions';
    const isHotel = activeTab === 'hotels';
    const isRestaurant = activeTab === 'restaurants';

    return (
      <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
            {item.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(item.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.rating}</span>
            <span className="text-sm text-gray-500">({item.reviews.toLocaleString()} reviews)</span>
          </div>

          {isHotel && (
            <div className="text-lg font-bold text-primary-600 mb-2">{item.price}</div>
          )}

          {isRestaurant && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">{item.cuisine}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{item.priceRange}</span>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{item.address}</span>
          </div>

          {(isAttraction || isRestaurant) && item.hours && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              <span>{item.hours}</span>
            </div>
          )}

          {isHotel && item.amenities && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {amenity}
                </span>
              ))}
              {item.amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{item.amenities.length - 3} more</span>
              )}
            </div>
          )}

          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={currentCity.image}
          alt={currentCity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{currentCity.name}</h1>
            <p className="text-lg md:text-xl opacity-90">{currentCity.country}</p>
            <p className="text-sm md:text-base mt-2 max-w-2xl mx-auto px-4">{currentCity.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">City Map</h2>
          <div className="h-64 md:h-96 rounded-lg overflow-hidden">
            {currentCity && currentCity.coordinates && currentCity.coordinates.length >= 2 ? (
              <MapContainer 
                center={[currentCity.coordinates[0], currentCity.coordinates[1]]} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[currentCity.coordinates[0], currentCity.coordinates[1]]}>
                  <Popup>
                    <div className="text-center">
                      <h4 className="font-semibold">{currentCity.name}</h4>
                      <p className="text-sm text-gray-600">{currentCity.country}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <p className="text-gray-500">Map data not available for this city</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['attractions', 'hotels', 'restaurants'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedCategory('all');
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex flex-wrap gap-2">
            {categories[activeTab]?.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentData().map(renderCard)}
        </div>

        {getCurrentData().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {activeTab} found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetails;