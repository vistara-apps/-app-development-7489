import React, { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ProjectContext = createContext()

export function useProjects() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [estimates, setEstimates] = useState([])

  const createProject = (projectData) => {
    const newProject = {
      projectId: uuidv4(),
      ...projectData,
      uploadTimestamp: new Date().toISOString()
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  const getProject = (projectId) => {
    return projects.find(p => p.projectId === projectId)
  }

  const createEstimate = (estimateData) => {
    const newEstimate = {
      estimateId: uuidv4(),
      ...estimateData,
      generatedOn: new Date().toISOString(),
      status: 'draft'
    }
    setEstimates(prev => [...prev, newEstimate])
    return newEstimate
  }

  const getEstimatesForProject = (projectId) => {
    return estimates.filter(e => e.projectId === projectId)
  }

  const updateEstimateStatus = (estimateId, status) => {
    setEstimates(prev => 
      prev.map(e => 
        e.estimateId === estimateId 
          ? { ...e, status }
          : e
      )
    )
  }

  const value = {
    projects,
    estimates,
    createProject,
    getProject,
    createEstimate,
    getEstimatesForProject,
    updateEstimateStatus
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}