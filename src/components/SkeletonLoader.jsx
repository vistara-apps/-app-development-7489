import React from 'react'

/**
 * A reusable skeleton loader component for content placeholders
 * 
 * @param {Object} props
 * @param {string} props.variant - Type of skeleton: 'text', 'circle', 'rectangle', 'card'
 * @param {string} props.width - Width of the skeleton (CSS value)
 * @param {string} props.height - Height of the skeleton (CSS value)
 * @param {number} props.count - Number of skeleton items to display
 * @param {string} props.className - Additional CSS classes
 */
export default function SkeletonLoader({ 
  variant = 'text',
  width = '100%',
  height = 'auto',
  count = 1,
  className = ''
}) {
  // Base skeleton classes
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  // Variant-specific classes
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-md',
    card: 'rounded-lg'
  }
  
  // Default heights for variants if not specified
  const defaultHeights = {
    text: '1rem',
    circle: '3rem',
    rectangle: '6rem',
    card: '12rem'
  }
  
  // Use default height if not specified
  const elementHeight = height === 'auto' ? defaultHeights[variant] || '1rem' : height
  
  // Generate skeleton items
  const skeletons = Array.from({ length: count }).map((_, index) => {
    let style = { width, height: elementHeight }
    
    // Special case for text variant with multiple lines
    if (variant === 'text' && count > 1) {
      // Make some lines shorter for a more natural look
      if (index === count - 1) {
        style.width = '80%'
      } else if (index % 3 === 0) {
        style.width = '90%'
      }
    }
    
    return (
      <div
        key={index}
        className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
        style={style}
        aria-hidden="true"
      />
    )
  })
  
  // For text variant with multiple lines, add spacing between lines
  if (variant === 'text' && count > 1) {
    return (
      <div className="space-y-2">
        {skeletons}
      </div>
    )
  }
  
  // For other variants or single line text, return the items
  return <>{skeletons}</>
}

