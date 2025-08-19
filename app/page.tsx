'use client'

import { useState } from 'react'
import { Briefcase, MessageSquare, Target, Sparkles, Star, Zap, Users } from 'lucide-react'
import CareerGuidance from '@/components/CareerGuidance'
import MockInterview from '@/components/MockInterview'
import JobSuggestions from '@/components/JobSuggestions'

export default function Home() {
  const [activeTab, setActiveTab] = useState('career')

  const tabs = [
    { id: 'career', label: 'Career Guidance', icon: Target, description: 'AI-powered career path analysis' },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare, description: 'Practice with AI interviewer' },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase, description: 'Personalized job recommendations' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-900/90 backdrop-blur-xl shadow-2xl border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl animate-pulse-glow">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  CareerMate
                </h1>
                <p className="text-base text-slate-300 font-medium mt-1">AI Career & Interview Mentor</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-amber-500 fill-current" />
                  <span>Powered by AI</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-indigo-500" />
                  <span>Real-time Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative bg-slate-900/80 backdrop-blur-xl shadow-xl border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center space-y-4 px-10 py-6 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 min-w-[200px] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl transform scale-105'
                      : 'bg-slate-800/90 backdrop-blur-sm text-slate-300 hover:bg-slate-700 border border-slate-600/50 shadow-slate-900/50 hover:shadow-lg transition-all duration-300 hover:scale-105'
                  }`}
                >
                  <Icon className="h-8 w-8" />
                  <span className="font-semibold text-lg">{tab.label}</span>
                  <span className="text-sm opacity-75 text-center leading-tight">{tab.description}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="animate-fade-in">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/30 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">CareerMate</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">Your AI-powered career companion for guidance, practice, and opportunities.</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-slate-100 mb-6 text-lg">Features</h4>
              <div className="space-y-3 text-base text-slate-300">
                <p>🎯 Career Path Analysis</p>
                <p>💬 Mock Interview Practice</p>
                <p>💼 Job Recommendations</p>
                <p>🚀 AI-Powered Insights</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="font-semibold text-slate-100 mb-6 text-lg">Built With</h4>
              <div className="space-y-3 text-base text-slate-300">
                <p>Next.js & React</p>
                <p>TailwindCSS</p>
                <p>OpenAI GPT Integration</p>
                <p>Modern Web Standards</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-base">&copy; 2024 CareerMate. Built with ❤️ for career growth.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
