import React, { useState } from 'react'
import { FileText, Download, Send, Eye, Clock, CheckCircle, XCircle, MoreHorizontal, ExternalLink, Copy, Printer } from 'lucide-react'

const statusIcons = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  accepted: CheckCircle,
  rejected: XCircle
}

const statusColors = {
  draft: {
    text: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200'
  },
  sent: {
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  viewed: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  accepted: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  rejected: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  }
}

const statusMessages = {
  draft: 'Ready to send',
  sent: 'Waiting for client response',
  viewed: 'Client has viewed the estimate',
  accepted: 'Client has accepted the estimate',
  rejected: 'Client has declined the estimate'
}

export default function EstimateCard({ estimate, onDownload, onSend }) {
  const [showActions, setShowActions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const StatusIcon = statusIcons[estimate.status]
  const statusColor = statusColors[estimate.status]
  
  const formattedDate = new Date(estimate.generatedOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  
  const handleSend = (e) => {
    e.stopPropagation()
    onSend(estimate)
    setShowActions(false)
  }
  
  const handleDownload = (e) => {
    e.stopPropagation()
    onDownload(estimate)
    setShowActions(false)
  }
  
  const toggleActions = (e) => {
    e.stopPropagation()
    setShowActions(!showActions)
  }
  
  const calculateLaborCost = () => {
    const hourlyRate = 65 // $65/hour labor rate
    return estimate.laborHours * hourlyRate
  }
  
  const laborCost = calculateLaborCost()
  const materialsCost = estimate.totalCost - laborCost

  return (
    <div 
      className={`card transition-all duration-200 ${isHovered ? 'shadow-md' : 'shadow-card'} border border-gray-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${statusColor.bg} rounded-lg flex items-center justify-center`}>
            <FileText className={`w-6 h-6 ${statusColor.text}`} />
          </div>
          <div>
            <h3 className="font-medium text-text-primary text-lg">
              {estimate.estimateName}
            </h3>
            <div className="flex items-center mt-1">
              <p className="text-sm text-text-secondary">
                Generated {formattedDate}
              </p>
              <span className="mx-2 text-gray-300">•</span>
              <div className="flex items-center">
                <StatusIcon className={`w-4 h-4 ${statusColor.text} mr-1`} />
                <span className={`text-xs capitalize ${statusColor.text}`}>
                  {estimate.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleActions}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="More actions"
            aria-expanded={showActions}
            aria-haspopup="true"
          >
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </button>
          
          {showActions && (
            <div 
              className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 animate-fade-in"
              onMouseLeave={() => setShowActions(false)}
            >
              <div className="py-1">
                <button
                  onClick={handleDownload}
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-3 text-text-secondary" />
                  Download PDF
                </button>
                
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4 mr-3 text-text-secondary" />
                  View Details
                </button>
                
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4 mr-3 text-text-secondary" />
                  Duplicate
                </button>
                
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-3 text-text-secondary" />
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Materials</div>
          <div className="text-lg font-semibold text-text-primary">${materialsCost.toLocaleString()}</div>
        </div>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Labor</div>
          <div className="text-lg font-semibold text-text-primary">
            ${laborCost.toLocaleString()}
            <span className="text-xs text-text-secondary ml-1">({estimate.laborHours}h)</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary mb-1">Total Estimate</div>
            <div className="text-2xl font-bold text-text-primary">
              ${estimate.totalCost.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="btn-ghost"
              aria-label="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {estimate.status === 'draft' && (
              <button
                onClick={handleSend}
                className="btn-primary px-4 py-2"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Client
              </button>
            )}
            
            {estimate.status === 'sent' && (
              <div className={`px-3 py-1 rounded-full text-xs ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                {statusMessages[estimate.status]}
              </div>
            )}
            
            {estimate.status === 'viewed' && (
              <div className={`px-3 py-1 rounded-full text-xs ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                {statusMessages[estimate.status]}
              </div>
            )}
            
            {estimate.status === 'accepted' && (
              <div className={`px-3 py-1 rounded-full text-xs ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                {statusMessages[estimate.status]}
              </div>
            )}
            
            {estimate.status === 'rejected' && (
              <div className={`px-3 py-1 rounded-full text-xs ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                {statusMessages[estimate.status]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
