import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Camera, FileText } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-surface shadow-card border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-primary">PhotoQuote AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}