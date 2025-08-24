'use client'

import { useState, useEffect } from 'react'
import { Target, MessageSquare, Briefcase, Trash2, Calendar, User, Settings, Crown, Star, Zap } from 'lucide-react'
import config from './config'
import { useAuth } from './AuthContext'
import Logo from './Logo'

interface SavedData {
  careerGuidance: any[]
  mockInterviews: any[]
  jobSuggestions: any[]
}

export default function Dashboard() {
  const { token } = useAuth()
  const [savedData, setSavedData] = useState<SavedData>({
    careerGuidance: [],
    mockInterviews: [],
    jobSuggestions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'guidance' | 'interviews' | 'jobs'>('guidance')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'team' | 'enterprise'>('free')

  // Mock usage data for showcase
  const usageData = {
    careerGuidance: { used: 2, limit: 3 },
    mockInterviews: { used: 1, limit: 1 },
    jobSuggestions: { used: 3, limit: 5 }
  }

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchAllData = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Optional health check (non-blocking)
      fetch(`${config.apiUrl.replace('/api', '')}/health`).catch(() => {})

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [guidance, interviews, jobs] = await Promise.all([
        fetch(`${config.apiUrl}/career-guidance`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/mock-interviews`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/job-suggestions`, { headers }).then(res => res.ok ? res.json() : [])
      ])

      setSavedData({
        careerGuidance: guidance,
        mockInterviews: interviews,
        jobSuggestions: jobs
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteItem = async (type: keyof SavedData, id: string) => {
    if (!token) {
      alert('No authentication token found. Please log in again.')
      return
    }

    try {
      const endpoint =
        type === 'careerGuidance' ? 'career-guidance'
        : type === 'mockInterviews' ? 'mock-interviews'
        : 'job-suggestions'

      const res = await fetch(`${config.apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        await res.json().catch(() => ({}))
        setSavedData(prev => ({
          ...prev,
          [type]: prev[type].filter((item: any) => item._id !== id)
        }))
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed to delete item: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item. Please check the console for details.')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400 text-lg">Please log in to view your dashboard</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <Logo size="xl" />
          </div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center mb-6">
              <Logo size="xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your CosmicCraft Dashboard</h1>
            <p className="text-xl text-slate-400">All your AI-generated career insights in one place</p>
          </div>
          
          {/* User Info & Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-300">
              <User className="h-5 w-5" />
              <span>Welcome, Admin!</span>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 transition-colors group"
              title="Account Settings & Subscription"
            >
              <Settings className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedData.careerGuidance.length}</p>
                <p className="text-slate-400 text-sm">Mission Control</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedData.mockInterviews.length}</p>
                <p className="text-slate-400 text-sm">Training Simulator</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Briefcase className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedData.jobSuggestions.length}</p>
                <p className="text-slate-400 text-sm">Opportunity Scanner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'guidance', label: 'Mission Control', icon: Target, count: savedData.careerGuidance.length },
              { id: 'interviews', label: 'Training Simulator', icon: MessageSquare, count: savedData.mockInterviews.length },
              { id: 'jobs', label: 'Opportunity Scanner', icon: Briefcase, count: savedData.jobSuggestions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                <span className="bg-slate-700/50 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content (no expandable sections) */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          {activeTab === 'guidance' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Mission Control Sessions</h3>
              {savedData.careerGuidance.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No mission control sessions yet.</p>
              ) : (
                savedData.careerGuidance.map((guidance) => (
                  <div
                    key={guidance._id || `guidance-${Math.random()}`}
                    className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            Skills: {guidance.userProfile?.skills?.join(', ') || 'Not specified'}
                          </h4>
                          <p className="text-slate-400">
                            Interests: {guidance.userProfile?.interests?.join(', ') || 'Not specified'}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {guidance.createdAt ? new Date(guidance.createdAt).toLocaleDateString() : 'Date not available'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => guidance._id && deleteItem('careerGuidance', guidance._id)}
                        disabled={!guidance._id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Training Simulator Sessions</h3>
              {savedData.mockInterviews.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No training simulator sessions yet.</p>
              ) : (
                savedData.mockInterviews.map((interview) => (
                  <div
                    key={interview._id || `interview-${Math.random()}`}
                    className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{interview.role || 'Role not specified'}</h4>
                          <p className="text-slate-400">{interview.questions?.length || 0} questions</p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'Date not available'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => interview._id && deleteItem('mockInterviews', interview._id)}
                        disabled={!interview._id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Opportunity Scanner Results</h3>
              {savedData.jobSuggestions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No opportunity scanner results yet.</p>
              ) : (
                savedData.jobSuggestions.map((suggestion) => (
                  <div
                    key={suggestion._id || `suggestion-${Math.random()}`}
                    className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Briefcase className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {suggestion.userProfile?.preferredRole || 'Role not specified'}
                          </h4>
                          <p className="text-slate-400">
                            Location: {suggestion.userProfile?.location || 'Location not specified'}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {suggestion.createdAt ? new Date(suggestion.createdAt).toLocaleDateString() : 'Date not available'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => suggestion._id && deleteItem('jobSuggestions', suggestion._id)}
                        disabled={!suggestion._id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
                <p className="text-slate-400">Manage your subscription and usage</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Usage */}
            <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Current Usage (Free Tier)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Career Guidance</span>
                    <span className="text-white font-semibold">{usageData.careerGuidance.used}/{usageData.careerGuidance.limit}</span>
                  </div>
                  <div className="w-full bg-slate-500 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(usageData.careerGuidance.used / usageData.careerGuidance.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Mock Interviews</span>
                    <span className="text-white font-semibold">{usageData.mockInterviews.used}/{usageData.mockInterviews.limit}</span>
                  </div>
                  <div className="w-full bg-slate-500 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(usageData.mockInterviews.used / usageData.mockInterviews.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Job Suggestions</span>
                    <span className="text-white font-semibold">{usageData.jobSuggestions.used}/{usageData.jobSuggestions.limit}</span>
                  </div>
                  <div className="w-full bg-slate-500 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(usageData.jobSuggestions.used / usageData.jobSuggestions.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Free Tier */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Free</h3>
                  <p className="text-3xl font-bold text-white">$0</p>
                  <p className="text-slate-400 text-sm">Forever</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                    3 Career Guidance sessions
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                    1 Mock Interview
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                    5 Job Suggestions
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-slate-600 text-white rounded-lg cursor-not-allowed opacity-50">
                  Current Plan
                </button>
              </div>

              {/* Pro Tier */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    POPULAR
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Pro</h3>
                  <p className="text-3xl font-bold text-white">$19</p>
                  <p className="text-slate-400 text-sm">per month</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Unlimited Career Guidance
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    10 Mock Interviews
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Advanced Job Matching
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Priority Support
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-semibold">
                  Upgrade to Pro
                </button>
              </div>

              {/* Team Tier */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Team</h3>
                  <p className="text-3xl font-bold text-white">$49</p>
                  <p className="text-slate-400 text-sm">per month</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Up to 5 team members
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Team collaboration
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Advanced analytics
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold">
                  Get Team Plan
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                  <p className="text-3xl font-bold text-white">Custom</p>
                  <p className="text-slate-400 text-sm">Contact us</p>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Unlimited everything
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    White-label options
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    API access
                  </li>
                  <li className="flex items-center text-sm text-slate-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Dedicated support
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
