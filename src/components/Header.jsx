import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Camera, FileText, Menu, X, Home, User, LayoutDashboard, PlusCircle } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    setMobileMenuOpen(false)
    logout()
    navigate('/')
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-surface shadow-card border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-primary">PhotoQuote AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-${isActive('/dashboard') ? 'primary font-medium' : 'text-secondary'} hover:text-primary transition-colors`}
                >
                  Dashboard
                </Link>
                <Link to="/new-project" className="btn-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  New Project
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-text-secondary">
                    {user.companyName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost"
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden bg-surface border-b border-gray-200 shadow-card overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container py-4 flex flex-col space-y-4">
          {user ? (
            <>
              <div className="px-4 py-2 bg-gray-50 rounded-md">
                <p className="text-sm text-text-secondary">Signed in as</p>
                <p className="font-medium text-text-primary">{user.companyName}</p>
              </div>
              <Link 
                to="/" 
                className={`flex items-center space-x-3 px-4 py-2 rounded-md ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-3 px-4 py-2 rounded-md ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/new-project" 
                className={`flex items-center space-x-3 px-4 py-2 rounded-md ${isActive('/new-project') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <PlusCircle className="w-5 h-5" />
                <span>New Project</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2 rounded-md text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className={`flex items-center space-x-3 px-4 py-2 rounded-md ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/login" 
                className={`flex items-center space-x-3 px-4 py-2 rounded-md ${isActive('/login') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}`}
                onClick={closeMobileMenu}
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
              <Link 
                to="/register" 
                className="flex items-center space-x-3 px-4 py-2 bg-primary text-white rounded-md"
                onClick={closeMobileMenu}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
