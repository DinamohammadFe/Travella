import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError('')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError('')
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      setError('')
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setError('')
      await signOut(auth)
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
      
      // Update localStorage for compatibility with existing code
      if (user) {
        const userData = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          loginTime: new Date().toISOString()
        }
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    error,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}