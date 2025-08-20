import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('photoquote_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication - replace with real auth service
    const mockUser = {
      userId: 'user_123',
      email,
      companyName: 'Demo Construction Co.',
      logoUrl: null
    }
    setUser(mockUser)
    localStorage.setItem('photoquote_user', JSON.stringify(mockUser))
    return mockUser
  }

  const register = async (email, password, companyName) => {
    // Mock registration - replace with real auth service
    const mockUser = {
      userId: `user_${Date.now()}`,
      email,
      companyName,
      logoUrl: null
    }
    setUser(mockUser)
    localStorage.setItem('photoquote_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('photoquote_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('photoquote_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}