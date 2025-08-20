import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NewProject from './pages/NewProject'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <div className="min-h-screen bg-bg">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Routes>
          </main>
        </div>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App