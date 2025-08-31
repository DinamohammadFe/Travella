# Travella - Travel Planning Application

**Author:** Dina Mohammad

## Overview

Travella is a modern, responsive travel planning application built with React and Vite. It provides users with an intuitive interface to plan trips, view destinations on interactive maps, and manage their travel itineraries.

## Features

### 🗺️ Interactive Trip Planning
- **Destination Search**: Enter any city or location worldwide
- **Dynamic City Maps**: Automatically displays Google Maps for selected destinations
- **Date Selection**: Choose start and end dates with improved date validation
- **Trip Collaboration**: Invite friends and manage tripmates

### 🔐 User Authentication
- Clean, modern login and signup pages
- Social login options (Google, Facebook)
- Responsive modal-style forms

### 🧭 Navigation & UI
- Responsive navigation bar with authentication states
- Mobile-friendly design
- Consistent styling with Tailwind CSS

### 📱 Pages & Components
- **Home**: Landing page with hero section
- **Trip Planner**: Main planning interface with map integration
- **Itinerary**: Trip details and planning results
- **About**: Information about the application
- **Features**: Showcase of app capabilities
- **Saved Trips**: Manage previously planned trips

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Maps Integration**: Google Maps Embed API
- **Icons**: Heroicons (SVG)

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
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
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── TripPlanner.jsx     # Main planning interface
│   │   ├── Login.jsx           # User login
│   │   ├── Signup.jsx          # User registration
│   │   ├── Itinerary.jsx       # Trip details
│   │   ├── About.jsx           # About page
│   │   ├── Features.jsx        # Features showcase
│   │   └── SavedTrips.jsx      # Saved trips management
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## Key Features Implementation

### Map Integration
The application features dynamic map loading that:
- Displays when users enter a destination (3+ characters)
- Uses Google Maps embed for reliable map rendering
- Includes a close button for better UX
- Responsive design that works on all screen sizes

### Form Validation
- Date validation ensures end date cannot be before start date
- Required field validation for essential trip information
- Real-time input feedback and error handling

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Consistent spacing and typography
- Accessible color schemes and interactive elements

## Contributing

This project was created by Dina Mohammad. For contributions or suggestions, please reach out directly.

## License

This project is created for educational and portfolio purposes.

---

**Built with ❤️ by Dina Mohammad**