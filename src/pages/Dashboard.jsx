import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { Plus, FileText, Camera, TrendingUp, Users } from 'lucide-react'
import EstimateCard from '../components/EstimateCard'
import { pdfService } from '../services/pdfService'

export default function Dashboard() {
  const { user } = useAuth()
  const { projects, estimates, updateEstimateStatus } = useProjects()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const recentEstimates = estimates.slice(-5).reverse()
  const totalProjects = projects.length
  const totalEstimates = estimates.length
  const pendingEstimates = estimates.filter(e => e.status === 'sent').length

  const handleDownloadPDF = (estimate) => {
    const project = projects.find(p => p.projectId === estimate.projectId)
    if (project) {
      const pdf = pdfService.generateEstimatePDF(estimate, project, user)
      pdfService.downloadPDF(pdf, `${estimate.estimateName.replace(/\s+/g, '_')}.pdf`)
    }
  }

  const handleSendEstimate = (estimate) => {
    // Mock sending - in production this would integrate with email service
    updateEstimateStatus(estimate.estimateId, 'sent')
    alert(`Estimate sent to client! (This is a demo - no actual email was sent)`)
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user.companyName}
        </h1>
        <p className="text-text-secondary">
          Manage your projects and estimates from your dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Projects</p>
              <p className="text-2xl font-bold text-text-primary">{totalProjects}</p>
            </div>
            <Camera className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Estimates</p>
              <p className="text-2xl font-bold text-text-primary">{totalEstimates}</p>
            </div>
            <FileText className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Pending Response</p>
              <p className="text-2xl font-bold text-text-primary">{pendingEstimates}</p>
            </div>
            <Users className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Success Rate</p>
              <p className="text-2xl font-bold text-text-primary">78%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/new-project" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Create New Project</h3>
              <p className="text-sm text-text-secondary">Upload photos and generate estimates</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Recent Activity</h3>
              <p className="text-sm text-text-secondary">
                {recentEstimates.length > 0 
                  ? `${recentEstimates.length} recent estimates`
                  : 'No recent activity'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Estimates */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Recent Estimates</h2>
          {totalEstimates > 5 && (
            <Link to="/estimates" className="btn-outline">
              View All
            </Link>
          )}
        </div>

        {recentEstimates.length > 0 ? (
          <div className="grid gap-6">
            {recentEstimates.map(estimate => (
              <EstimateCard
                key={estimate.estimateId}
                estimate={estimate}
                onDownload={handleDownloadPDF}
                onSend={handleSendEstimate}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No estimates yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first project to start generating estimates
            </p>
            <Link to="/new-project" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Link>
          </div>
        )}
      </div>

      {/* Getting Started */}
      {totalProjects === 0 && (
        <div className="card bg-gradient-to-r from-accent/5 to-primary/5 border-l-4 border-accent">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Getting Started with PhotoQuote AI
          </h3>
          <p className="text-text-secondary mb-4">
            Ready to create your first estimate? Here's how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary mb-6">
            <li>Click "Create New Project" to start</li>
            <li>Upload photos of your job site</li>
            <li>Let our AI analyze and generate estimates</li>
            <li>Customize and send professional quotes to clients</li>
          </ol>
          <Link to="/new-project" className="btn-accent">
            Start Your First Project
          </Link>
        </div>
      )}
    </div>
  )
}