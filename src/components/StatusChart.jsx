import React from 'react'

/**
 * A simple donut chart component for visualizing estimate statuses
 * 
 * @param {Object} props
 * @param {Object} props.data - Object with status counts: { draft: 2, sent: 3, ... }
 * @param {number} props.size - Size of the chart in pixels
 * @param {number} props.thickness - Thickness of the donut ring in pixels
 */
export default function StatusChart({ data, size = 160, thickness = 30 }) {
  // Status colors matching the EstimateCard component
  const statusColors = {
    draft: '#E5E7EB', // gray-200
    sent: '#DBEAFE', // blue-100
    viewed: '#FEF3C7', // yellow-100
    accepted: '#D1FAE5', // green-100
    rejected: '#FEE2E2', // red-100
  }
  
  // Calculate total for percentages
  const total = Object.values(data).reduce((sum, count) => sum + count, 0)
  
  // If no data or total is 0, show empty chart
  if (!data || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={thickness}
          />
        </svg>
        <div className="text-sm text-text-secondary mt-2">No data</div>
      </div>
    )
  }
  
  // Calculate the circumference of the circle
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  
  // Sort statuses to ensure consistent order
  const statuses = ['draft', 'sent', 'viewed', 'accepted', 'rejected']
  
  // Calculate stroke-dasharray and stroke-dashoffset for each segment
  let segments = []
  let currentOffset = 0
  
  statuses.forEach(status => {
    if (data[status] && data[status] > 0) {
      const percentage = data[status] / total
      const dashLength = circumference * percentage
      
      segments.push({
        status,
        color: statusColors[status],
        dasharray: `${dashLength} ${circumference - dashLength}`,
        dashoffset: -currentOffset,
        count: data[status],
        percentage: percentage * 100
      })
      
      currentOffset += dashLength
    }
  })
  
  // Rotate the chart so the first segment starts at the top
  const rotationOffset = 25 // Offset in percentage to start from the top
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `rotate(${-90 + rotationOffset}deg)` }}>
        {segments.map((segment, index) => (
          <circle
            key={segment.status}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={thickness}
            strokeDasharray={segment.dasharray}
            strokeDashoffset={segment.dashoffset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      
      {/* Center text showing total */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: 'rotate(0deg)' }} // Reset the rotation for the text
      >
        <div className="text-3xl font-bold text-text-primary">{total}</div>
        <div className="text-sm text-text-secondary">Total</div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.map(segment => (
          <div key={segment.status} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="capitalize">{segment.status}</span>
            <span className="ml-1 text-text-secondary">({segment.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

