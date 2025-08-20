import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../contexts/ProjectContext'
import { Camera, Upload, ArrowRight, Loader } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import { aiService } from '../services/aiService'

export default function NewProject() {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    clientName: '',
    clientEmail: '',
    jobSiteAddress: '',
    projectDescription: ''
  })
  const [images, setImages] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const { createProject, createEstimate } = useProjects()
  const navigate = useNavigate()

  const handleProjectDataChange = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!projectData.clientName || !projectData.jobSiteAddress) {
        setError('Please fill in all required fields')
        return
      }
      setError('')
      setStep(2)
    }
  }

  const handleAnalyzeImages = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image')
      return
    }

    setAnalyzing(true)
    setError('')

    try {
      // Create project
      const project = createProject({
        userId: user.userId,
        ...projectData
      })

      // Analyze images with AI
      const analysis = await aiService.analyzeImages(images)

      // Create estimate from analysis
      const estimate = createEstimate({
        projectId: project.projectId,
        estimateName: `${projectData.clientName} - Estimate`,
        materials: analysis.materials,
        laborHours: analysis.laborHours,
        totalCost: analysis.totalCost
      })

      // Navigate to project detail page
      navigate(`/project/${project.projectId}`)
    } catch (err) {
      setError('Failed to analyze images. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-accent' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Project Details</span>
            <span>Upload Photos</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold text-text-primary">
                New Project Details
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter client name"
                  value={projectData.clientName}
                  onChange={(e) => handleProjectDataChange('clientName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="client@email.com"
                  value={projectData.clientEmail}
                  onChange={(e) => handleProjectDataChange('clientEmail', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Job Site Address *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter job site address"
                  value={projectData.jobSiteAddress}
                  onChange={(e) => handleProjectDataChange('jobSiteAddress', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project Description
                </label>
                <textarea
                  className="input h-24 resize-none"
                  placeholder="Brief description of the work to be done"
                  value={projectData.projectDescription}
                  onChange={(e) => handleProjectDataChange('projectDescription', e.target.value)}
                />
              </div>

              <button
                onClick={handleNextStep}
                className="w-full btn-primary"
              >
                <span>Next: Upload Photos</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold text-text-primary">
                Upload Job Site Photos
              </h1>
            </div>

            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                Upload photos of the job site for AI analysis. The more detailed photos you provide, 
                the more accurate the estimate will be.
              </p>
              
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-text-primary mb-2">Tips for better estimates:</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Take photos from multiple angles</li>
                  <li>• Include close-ups of damaged or problem areas</li>
                  <li>• Capture the full scope of work needed</li>
                  <li>• Ensure good lighting for clear images</li>
                </ul>
              </div>
            </div>

            <ImageUpload onImagesChange={setImages} />

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn-outline flex-1"
              >
                Back
              </button>
              <button
                onClick={handleAnalyzeImages}
                disabled={analyzing || images.length === 0}
                className="btn-primary flex-1"
              >
                {analyzing ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Analyzing Photos...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Generate Estimate
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}