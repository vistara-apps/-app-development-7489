import React from 'react'
import { FileText, Download, Send, Eye, Clock, CheckCircle, XCircle } from 'lucide-react'

const statusIcons = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  accepted: CheckCircle,
  rejected: XCircle
}

const statusColors = {
  draft: 'text-gray-500',
  sent: 'text-blue-500',
  viewed: 'text-yellow-500',
  accepted: 'text-green-500',
  rejected: 'text-red-500'
}

export default function EstimateCard({ estimate, onDownload, onSend }) {
  const StatusIcon = statusIcons[estimate.status]

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary">
              {estimate.estimateName}
            </h3>
            <p className="text-sm text-text-secondary">
              Generated {new Date(estimate.generatedOn).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-5 h-5 ${statusColors[estimate.status]}`} />
          <span className={`text-sm capitalize ${statusColors[estimate.status]}`}>
            {estimate.status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-text-secondary">Materials:</span>
          <span className="ml-2 font-medium">${estimate.materials.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-text-secondary">Labor:</span>
          <span className="ml-2 font-medium">{estimate.laborHours}h</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-text-primary">
            Total: ${estimate.totalCost.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(estimate)}
              className="btn-ghost"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            {estimate.status === 'draft' && (
              <button
                onClick={() => onSend(estimate)}
                className="btn-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}