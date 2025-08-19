'use client'

import { useState } from 'react'
import { Briefcase, MessageSquare, Target, Sparkles } from 'lucide-react'
import CareerGuidance from '@/components/CareerGuidance'
import MockInterview from '@/components/MockInterview'
import JobSuggestions from '@/components/JobSuggestions'

export default function Home() {
  const [activeTab, setActiveTab] = useState('career')

  const tabs = [
    { id: 'career', label: 'Career Guidance', icon: Target },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase },
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'career':
        return <CareerGuidance />
      case 'interview':
        return <MockInterview />
      case 'jobs':
        return <JobSuggestions />
      default:
        return <CareerGuidance />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                CareerMate
              </h1>
            </div>
            <p className="text-gray-600 text-sm">AI Career & Interview Mentor</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'tab-active'
                      : 'tab-inactive'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 CareerMate. Built with Next.js, TailwindCSS, and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
