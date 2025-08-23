'use client'

import CareerGuidance from '../components/CareerGuidance'
import JobSuggestions from '../components/JobSuggestions'
import MockInterview from '../components/MockInterview'
import CareerStoryteller from '../components/CareerStoryteller'
import Dashboard from '../components/Dashboard'
import Auth from '../components/Auth'
import { useAuth } from '../components/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { 
  Brain, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Zap, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  Sparkles,
  BookOpen,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Settings
} from 'lucide-react'

export default function Home() {
  const { user, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('career')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  const tabs = [
    { id: 'career', label: 'Career Guidance', icon: Brain, description: 'AI-powered career path analysis' },
    { id: 'interview', label: 'AI Interview Practice', icon: MessageSquare, description: 'Practice with AI interviewer' },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase, description: 'Personalized job recommendations' },
    { id: 'storyteller', label: 'Career Storyteller', icon: BookOpen, description: 'AI-powered career storytelling' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'View all your saved data' },
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'career':
        return <CareerGuidance />
      case 'interview':
        return <MockInterview />
      case 'jobs':
        return <JobSuggestions />

      case 'storyteller':
        return <CareerStoryteller />
      case 'dashboard':
        return <Dashboard />
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
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-xl shadow-lg animate-pulse-glow">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  CareerMate
                </h1>
                <p className="text-base text-slate-300 font-medium mt-1">AI Career & Interview Mentor</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-3 text-sm text-slate-300">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-indigo-400" />
                      <span>Welcome, {user.firstName}!</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span>Powered by AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>Real-time Guidance</span>
                  </div>
                </div>
              )}
              
              {/* Mobile menu button */}
              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-all duration-200"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && user && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-24 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/30 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="space-y-4">
              {/* Header with close button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Quick Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl border border-slate-600/30">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <BarChart3 className="h-5 w-5 text-indigo-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('career')
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <Brain className="h-5 w-5 text-green-400" />
                  <span>Career Guide</span>
                </button>
              </div>
              
              {/* Account Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // TODO: Add settings functionality
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <Settings className="h-5 w-5 text-blue-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={() => {
                    // This will show the login/register screen again
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-slate-300 hover:text-white transition-all duration-200"
                >
                  <User className="h-5 w-5 text-indigo-400" />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-slate-400 text-lg">Loading CareerMate...</p>
            </div>
          </div>
        ) : user ? (
          <div className="animate-fade-in">
            {renderActiveComponent()}
          </div>
        ) : (
          <Auth />
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/30 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">CareerMate</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">Your AI-powered career companion for guidance, practice, and opportunities.</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-slate-100 mb-6 text-lg">Features</h4>
              <div className="space-y-3 text-base text-slate-300">
                <p>🎯 Career Path Analysis</p>
                <p>💬 AI Interview Practice</p>
                <p>💼 Job Recommendations</p>
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
            <p className="text-slate-400 text-base">&copy; 2025 CareerMate. Built with ❤️ for career growth.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
