import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { ArrowLeft, FileText, Download, Send, Edit, MapPin, User, Calendar } from 'lucide-react'
import EstimateCard from '../components/EstimateCard'
import { pdfService } from '../services/pdfService'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getProject, getEstimatesForProject, updateEstimateStatus } = useProjects()
  const navigate = useNavigate()

  const project = getProject(id)
  const estimates = getEstimatesForProject(id)

  if (!user) {
    navigate('/login')
    return null
  }

  if (!project) {
    return (
      <div className="container py-8">
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Project Not Found
          </h2>
          <p className="text-text-secondary mb-4">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleDownloadPDF = (estimate) => {
    const pdf = pdfService.generateEstimatePDF(estimate, project, user)
    pdfService.downloadPDF(pdf, `${estimate.estimateName.replace(/\s+/g, '_')}.pdf`)
  }

  const handleSendEstimate = (estimate) => {
    // Mock sending - in production this would integrate with email service
    updateEstimateStatus(estimate.estimateId, 'sent')
    alert(`Estimate sent to ${project.clientEmail || project.clientName}! (This is a demo - no actual email was sent)`)
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {project.clientName} Project
          </h1>
          <p className="text-text-secondary">
            Created {new Date(project.uploadTimestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Project Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Project Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Client</p>
                  <p className="font-medium text-text-primary">{project.clientName}</p>
                  {project.clientEmail && (
                    <p className="text-sm text-text-secondary">{project.clientEmail}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Location</p>
                  <p className="font-medium text-text-primary">{project.jobSiteAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Created</p>
                  <p className="font-medium text-text-primary">
                    {new Date(project.uploadTimestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {project.projectDescription && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Description</p>
                  <p className="text-text-primary">{project.projectDescription}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full btn-outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="card mt-6">
            <h3 className="font-semibold text-text-primary mb-4">Project Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Estimates</span>
                <span className="font-medium text-text-primary">{estimates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Sent to Client</span>
                <span className="font-medium text-text-primary">
                  {estimates.filter(e => e.status === 'sent').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Viewed by Client</span>
                <span className="font-medium text-text-primary">
                  {estimates.filter(e => e.status === 'viewed').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimates */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              Estimates ({estimates.length})
            </h2>
            <button
              onClick={() => navigate('/new-project')}
              className="btn-primary"
            >
              <FileText className="w-4 h-4 mr-2" />
              New Estimate
            </button>
          </div>

          {estimates.length > 0 ? (
            <div className="space-y-6">
              {estimates.map(estimate => (
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
                Upload job site photos to generate your first estimate for this project
              </p>
              <button
                onClick={() => navigate('/new-project')}
                className="btn-primary"
              >
                Generate Estimate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}