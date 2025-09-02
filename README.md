# Travella - Travel Planning Application

**Author:** Dina Mohammad

## Overview

Travella is a modern, responsive travel planning application built with React and Vite. It provides users with an intuitive interface to discover destinations, plan trips, and manage their travel experiences with beautiful city information including photos, maps, and detailed insights.

## Features

### 🌍 City Discovery & Search
- **City Search**: Explore destinations with interactive search functionality
- **City Information Cards**: Rich destination cards with photos, ratings, and highlights
- **Interactive Maps**: Embedded maps for each city showing key locations
- **Weather Information**: Current weather conditions for destinations
- **Quick Search**: Popular destination shortcuts (Paris, Tokyo, London, New York, Rome)

### 🗺️ Trip Planning
- **Itinerary Management**: Create and organize day-by-day trip plans
- **Activity Planning**: Add attractions, restaurants, and activities to your itinerary
- **Trip Storage**: Save and manage multiple trips with localStorage
- **Enhanced Place Search**: Discover places with detailed information and categories

### 🔐 User Authentication
- **Firebase Authentication**: Secure user registration and login
- **Google Sign-in**: Quick authentication with Google accounts
- **Email/Password**: Traditional authentication method
- **User Profile Management**: Personalized user experience

### 🧭 Navigation & UI
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Dynamic Navigation**: Context-aware navigation based on authentication state
- **Consistent Theming**: Teal color scheme throughout the application

### 📱 Pages & Components
- **Home**: City search and discovery landing page
- **City Search Results**: Detailed city information with photos and maps
- **Trip Planner**: Comprehensive trip planning interface
- **Itinerary**: Detailed trip management and day-by-day planning
- **Saved Trips**: Manage and view all saved trips
- **About**: Information about the application
- **Features**: Showcase of app capabilities
- **Authentication Pages**: Modern login and signup interfaces

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Firebase Authentication
- **Data Storage**: localStorage (for MVP)
- **Maps Integration**: Embedded iframe maps
- **Icons**: Heroicons (SVG)
- **State Management**: React Context API

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travella
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase Authentication**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication and configure sign-in methods:
     - Email/Password
     - Google Sign-in
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Create a `.env` file in the root directory and add your Firebase configuration:
   ```bash
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   
   # Google Maps API Key (required for map features)
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
   ```
   
   - **Google Maps Setup:**
     - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
     - Create a new project or select an existing one
     - Enable the following APIs:
       - **Maps JavaScript API** (for interactive maps)
       - **Places API** (for place search and details)
       - **Geocoding API** (for address to coordinates conversion)
       - **Places API (New)** (enhanced place data)
     - Create credentials (API Key)
     - Configure API key restrictions (optional but recommended):
       - Application restrictions: HTTP referrers
       - API restrictions: Select the APIs listed above
     - Add your API key to the `.env` file
     
   **Note:** The geocoding functionality requires a valid Google Maps API key. Without it, destination mapping and place coordinate resolution will not work.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Travella/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation component
│   │   ├── CitySearchResults.jsx   # City search results display
│   │   ├── EnhancedPlaceSearch.jsx # Enhanced place search functionality
│   │   ├── PlaceCard.jsx           # Place information cards
│   │   ├── PlaceSearch.jsx         # Basic place search
│   │   ├── TripCard.jsx            # Trip display cards
│   │   ├── TripList.jsx            # Trip listing component
│   │   ├── CreateTripForm.jsx      # Trip creation form
│   │   └── GoogleMap.jsx           # Map component (disabled)
│   ├── pages/
│   │   ├── Home.jsx                # City search landing page
│   │   ├── CitySearch.jsx          # City search results page
│   │   ├── TripPlanner.jsx         # Trip planning interface
│   │   ├── Itinerary.jsx           # Trip itinerary management
│   │   ├── SavedTrips.jsx          # Saved trips management
│   │   ├── Login.jsx               # User authentication
│   │   ├── Signup.jsx              # User registration
│   │   ├── About.jsx               # About page
│   │   ├── Features.jsx            # Features showcase
│   │   └── Trips.jsx               # Trip management
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── config/
│   │   ├── firebase.js             # Firebase configuration
│   │   └── googleMaps.js           # Maps configuration (disabled)
│   ├── services/
│   │   ├── tripService.js          # Trip management services
│   │   └── placesService.js        # Places search services
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styles
├── public/
│   └── beach-hero.jpg              # Hero image asset
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## Key Features Implementation

### City Search & Discovery
The application features comprehensive city search functionality:
- Interactive search with real-time filtering
- Rich city information cards with photos, ratings, and highlights
- Embedded maps showing city locations and key attractions
- Weather information and travel insights
- Quick access buttons for popular destinations

### Authentication System
Firebase-powered authentication provides:
- Secure user registration and login
- Google OAuth integration for quick sign-in
- Persistent user sessions with context management
- Protected routes and personalized experiences

### Trip Management
- Create, edit, and delete trips with localStorage persistence
- Day-by-day itinerary planning with activity management
- Enhanced place search with detailed information
- Trip sharing and collaboration features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Consistent teal color scheme throughout the application
- Accessible design with proper contrast and interactive elements
- Smooth transitions and modern UI components

## Contributing

This project was created by Dina Mohammad. For contributions or suggestions, please reach out directly.

## License

This project is created for educational and portfolio purposes.

---

**Built with ❤️ by Dina Mohammad**