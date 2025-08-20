import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Camera, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import FormErrorMessage from '../components/FormErrorMessage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email) => {
    return email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password) => {
    return password.trim() !== ''
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched for validation
    setTouched({
      email: true,
      password: true
    })
    
    // Validate form before submission
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (!validatePassword(password)) {
      setError('Please enter your password')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Or{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent/80 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <FormErrorMessage 
            message={error} 
            dismissible={true} 
            autoHideDuration={5000}
            onDismiss={() => setError('')}
          />

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input pl-10 ${touched.email && !validateEmail(email) ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={touched.email && !validateEmail(email)}
                  aria-describedby={touched.email && !validateEmail(email) ? "email-error" : undefined}
                />
              </div>
              {touched.email && !validateEmail(email) && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`input pl-10 pr-10 ${touched.password && !validatePassword(password) ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={touched.password && !validatePassword(password)}
                  aria-describedby={touched.password && !validatePassword(password) ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {touched.password && !validatePassword(password) && (
                <p className="mt-1 text-sm text-red-600" id="password-error">
                  Please enter your password
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Demo credentials: any email/password combination
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
