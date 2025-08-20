import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Camera, FileText, Send, TrendingUp, CheckCircle, Clock } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'AI Photo Analysis',
      description: 'Upload job site photos and get instant material and labor estimates powered by advanced AI.'
    },
    {
      icon: FileText,
      title: 'Professional Quotes',
      description: 'Generate branded PDF estimates with your company logo and custom templates.'
    },
    {
      icon: Send,
      title: 'Client Management',
      description: 'Send estimates directly to clients and track their status in real-time.'
    },
    {
      icon: TrendingUp,
      title: 'Close Deals Faster',
      description: 'Reduce estimation time from hours to minutes, helping you win more projects.'
    }
  ]

  const benefits = [
    'Save 80% of time on estimations',
    'Increase accuracy with AI analysis',
    'Professional branded quotes',
    'Real-time client tracking',
    'Mobile-first design',
    'Free to get started'
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Generate Professional Estimates from Photos in Minutes
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Upload job site photos, get AI-powered estimates, and send branded quotes to clients faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Win More Projects
            </h2>
            <p className="text-xl text-text-secondary">
              Powerful tools designed for modern contractors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary">
              From photos to professional estimates in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Upload Photos
              </h3>
              <p className="text-text-secondary">
                Take photos of your job site and upload them to our platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                AI Analysis
              </h3>
              <p className="text-text-secondary">
                Our AI analyzes the images and generates detailed material and labor estimates
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Send Quote
              </h3>
              <p className="text-text-secondary">
                Generate a professional PDF quote and send it directly to your client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
                Why Contractors Choose PhotoQuote AI
              </h2>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-accent mb-2">80%</div>
              <div className="text-text-secondary mb-4">Time Saved</div>
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <div className="text-text-secondary mb-4">Accuracy Rate</div>
              <div className="text-4xl font-bold text-accent mb-2">3x</div>
              <div className="text-text-secondary">Faster Quotes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Estimation Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of contractors who are closing deals faster with PhotoQuote AI
          </p>
          {!user && (
            <Link to="/register" className="btn bg-accent text-white hover:bg-accent/90 text-lg px-8 py-3">
              Start Free Trial
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}