'use client'

import { useState, useEffect } from 'react'
import { Target, MessageSquare, Briefcase, Trash2, Calendar, User } from 'lucide-react'
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Your CosmicCraft Dashboard</h1>
          <p className="text-xl text-slate-400">All your AI-generated career insights in one place</p>
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


    </div>
  )
}
