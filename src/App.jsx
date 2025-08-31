import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TripPlanner from './pages/TripPlanner'
import Itinerary from './pages/Itinerary'
import SavedTrips from './pages/SavedTrips'
import Trips from './pages/Trips'
import About from './pages/About'
import Features from './pages/Features'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/planner" element={<TripPlanner />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/saved-trips" element={<SavedTrips />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App