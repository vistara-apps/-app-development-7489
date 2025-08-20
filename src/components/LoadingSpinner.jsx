import React from 'react'
import { Loader } from 'lucide-react'

/**
 * A reusable loading spinner component
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Color of the spinner: 'primary', 'accent', 'white'
 * @param {string} props.text - Optional text to display next to the spinner
 * @param {boolean} props.fullPage - Whether to display the spinner centered on the full page
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text = '',
  fullPage = false
}) {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  // Color classes
  const colorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    white: 'text-white'
  }
  
  // Container classes for full page display
  const containerClasses = fullPage 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50' 
    : 'flex items-center justify-center'
  
  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex items-center space-x-3">
        <Loader 
          className={`${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} animate-spin`} 
        />
        {text && (
          <span className={`${color === 'white' ? 'text-white' : 'text-text-primary'} font-medium`}>
            {text}
          </span>
        )}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

