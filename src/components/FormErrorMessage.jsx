import React, { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

/**
 * A reusable component for displaying form error messages
 * 
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {boolean} props.dismissible - Whether the error can be dismissed by the user
 * @param {number} props.autoHideDuration - Duration in ms after which the error will automatically hide (0 to disable)
 * @param {function} props.onDismiss - Callback function when error is dismissed
 */
export default function FormErrorMessage({ 
  message, 
  dismissible = false, 
  autoHideDuration = 0,
  onDismiss = () => {}
}) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    // Reset visibility when message changes
    setVisible(true)
    
    // Set up auto-hide timer if duration is provided
    if (autoHideDuration > 0 && message) {
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss()
      }, autoHideDuration)
      
      return () => clearTimeout(timer)
    }
  }, [message, autoHideDuration, onDismiss])
  
  if (!message || !visible) return null
  
  const handleDismiss = () => {
    setVisible(false)
    onDismiss()
  }
  
  return (
    <div 
      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center justify-between animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
      
      {dismissible && (
        <button 
          onClick={handleDismiss}
          className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1"
          aria-label="Dismiss error message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

