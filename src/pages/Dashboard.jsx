import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { 
  Plus, FileText, Camera, TrendingUp, Users, 
  BarChart2, Calendar, Clock, CheckCircle, XCircle, 
  ArrowRight, RefreshCw, Settings
} from 'lucide-react'
import EstimateCard from '../components/EstimateCard'
import StatusChart from '../components/StatusChart'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonLoader from '../components/SkeletonLoader'
import { pdfService } from '../services/pdfService'

export default function Dashboard() {
  const { user } = useAuth()
  const { projects, estimates, updateEstimateStatus } = useProjects()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [user, navigate])

  if (!user) return null

  const recentEstimates = estimates.slice(-5).reverse()
  const totalProjects = projects.length
  const totalEstimates = estimates.length
  
  // Count estimates by status
  const estimatesByStatus = estimates.reduce((acc, estimate) => {
    acc[estimate.status] = (acc[estimate.status] || 0) + 1
    return acc
  }, {})
  
  // Calculate success rate (accepted estimates / total non-draft estimates)
  const nonDraftEstimates = estimates.filter(e => e.status !== 'draft').length
  const acceptedEstimates = estimates.filter(e => e.status === 'accepted').length
  const successRate = nonDraftEstimates > 0 
    ? Math.round((acceptedEstimates / nonDraftEstimates) * 100) 
    : 0

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
    // Use a more modern notification instead of alert
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md shadow-lg z-50 animate-fade-in flex items-center'
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Estimate sent to client! (Demo - no actual email sent)
    `
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.classList.add('animate-fade-out')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <SkeletonLoader variant="text" width="60%" height="2rem" />
          <SkeletonLoader variant="text" width="40%" className="mt-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <SkeletonLoader variant="text" width="50%" />
              <SkeletonLoader variant="text" width="30%" height="2rem" className="mt-2" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card">
              <div className="flex items-center space-x-4">
                <SkeletonLoader variant="circle" width="3rem" height="3rem" />
                <div className="flex-1">
                  <SkeletonLoader variant="text" width="60%" />
                  <SkeletonLoader variant="text" width="40%" className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <SkeletonLoader variant="text" width="30%" height="1.5rem" />
          </div>
          
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card">
                <SkeletonLoader variant="text" width="100%" count={3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user.companyName}
        </h1>
        <p className="text-text-secondary">
          Manage your projects and estimates from your dashboard
        </p>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          <button
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'overview' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'projects' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'estimates' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('estimates')}
          >
            Estimates
          </button>
          <button
            className={`pb-2 px-1 font-medium text-sm transition-colors ${
              activeTab === 'clients' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Projects</p>
              <p className="text-2xl font-bold text-text-primary">{totalProjects}</p>
              <div className="mt-1 text-xs text-green-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Estimates</p>
              <p className="text-2xl font-bold text-text-primary">{totalEstimates}</p>
              <div className="mt-1 text-xs text-green-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+8% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Pending Response</p>
              <p className="text-2xl font-bold text-text-primary">{estimatesByStatus.sent || 0}</p>
              <div className="mt-1 text-xs text-yellow-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Awaiting client review</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Success Rate</p>
              <p className="text-2xl font-bold text-text-primary">{successRate}%</p>
              <div className="mt-1 text-xs text-green-500 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>{estimatesByStatus.accepted || 0} accepted estimates</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Quick Actions */}
        <div className="md:col-span-1 space-y-6">
          <div className="card border border-gray-100">
            <h3 className="font-semibold text-text-primary text-lg mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link to="/new-project" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">New Project</h4>
                  <p className="text-xs text-text-secondary">Upload photos and generate estimates</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary" />
              </Link>
              
              <Link to="/dashboard" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <BarChart2 className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">View Reports</h4>
                  <p className="text-xs text-text-secondary">See analytics and performance</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary" />
              </Link>
              
              <Link to="/dashboard" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">Settings</h4>
                  <p className="text-xs text-text-secondary">Customize your account</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary" />
              </Link>
            </div>
          </div>
          
          {/* Estimate Status Chart */}
          <div className="card border border-gray-100">
            <h3 className="font-semibold text-text-primary text-lg mb-4">Estimate Status</h3>
            <div className="flex justify-center">
              <StatusChart data={estimatesByStatus} />
            </div>
          </div>
        </div>
        
        {/* Right Column - Recent Estimates */}
        <div className="md:col-span-2">
          <div className="card border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-text-primary text-lg">Recent Estimates</h3>
              {totalEstimates > 5 && (
                <Link to="/estimates" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>

            {recentEstimates.length > 0 ? (
              <div className="space-y-6">
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
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  No estimates yet
                </h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  Create your first project to start generating estimates for your clients.
                </p>
                <Link to="/new-project" className="btn-primary inline-flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Link>
              </div>
            )}
          </div>
        </div>
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
