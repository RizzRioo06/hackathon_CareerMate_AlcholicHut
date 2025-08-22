'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, MessageSquare, Briefcase, Trash2, Eye, Calendar, User } from 'lucide-react'
import config from './config'

interface SavedData {
  careerDiscoveries: any[]
  careerGuidance: any[]
  mockInterviews: any[]
  jobSuggestions: any[]
}

export default function Dashboard() {
  const [savedData, setSavedData] = useState<SavedData>({
    careerDiscoveries: [],
    careerGuidance: [],
    mockInterviews: [],
    jobSuggestions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'discoveries' | 'guidance' | 'interviews' | 'jobs'>('discoveries')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // First check if backend is accessible
      const healthCheck = await fetch(`${config.apiUrl.replace('/api', '')}/health`)
      if (!healthCheck.ok) {
        console.warn('Backend health check failed, backend might not be running')
      }
      
      const [discoveries, guidance, interviews, jobs] = await Promise.all([
        fetch(`${config.apiUrl}/career-discoveries`).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/career-guidance`).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/mock-interviews`).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/job-suggestions`).then(res => res.ok ? res.json() : [])
      ])

      setSavedData({
        careerDiscoveries: discoveries,
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
    try {
      const endpoint = type === 'careerDiscoveries' ? 'career-discoveries' : 
                     type === 'careerGuidance' ? 'career-guidance' :
                     type === 'mockInterviews' ? 'mock-interviews' : 'job-suggestions'
      
      console.log(`Attempting to delete ${type} with ID: ${id} from endpoint: /api/${endpoint}/${id}`)
      
      const res = await fetch(`${config.apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE'
      })
      
      console.log(`Delete response status: ${res.status}`)
      
      if (res.ok) {
        const responseData = await res.json()
        console.log('Delete successful:', responseData)
        
        setSavedData(prev => ({
          ...prev,
          [type]: prev[type].filter((item: any) => item._id !== id)
        }))
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Delete failed:', errorData)
        alert(`Failed to delete item: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item. Please check the console for details.')
    }
  }

  const getTotalCount = () => {
    return Object.values(savedData).reduce((total, array) => total + array.length, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Your CareerMate Dashboard</h1>
          <p className="text-xl text-slate-400">All your AI-generated career insights in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedData.careerDiscoveries.length}</p>
                <p className="text-slate-400 text-sm">Discoveries</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedData.careerGuidance.length}</p>
                <p className="text-slate-400 text-sm">Guidance</p>
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
                <p className="text-slate-400 text-sm">Interviews</p>
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
                <p className="text-slate-400 text-sm">Job Suggestions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'discoveries', label: 'Career Discoveries', icon: Brain, count: savedData.careerDiscoveries.length },
              { id: 'guidance', label: 'Career Guidance', icon: Target, count: savedData.careerGuidance.length },
              { id: 'interviews', label: 'Mock Interviews', icon: MessageSquare, count: savedData.mockInterviews.length },
              { id: 'jobs', label: 'Job Suggestions', icon: Briefcase, count: savedData.jobSuggestions.length }
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

        {/* Content */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          {activeTab === 'discoveries' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Career Discoveries</h3>
              {savedData.careerDiscoveries.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No career discoveries yet. Start exploring!</p>
              ) : (
                savedData.careerDiscoveries.map((discovery) => (
                  <div key={discovery._id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <User className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{discovery.userProfile.name}</h4>
                          <p className="text-slate-400">{discovery.userProfile.currentRole}</p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(discovery.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem('careerDiscoveries', discovery._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'guidance' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Career Guidance Sessions</h3>
              {savedData.careerGuidance.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No career guidance sessions yet.</p>
              ) : (
                savedData.careerGuidance.map((guidance) => (
                  <div key={guidance._id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Skills: {guidance.userProfile.skills.join(', ')}</h4>
                          <p className="text-slate-400">Interests: {guidance.userProfile.interests.join(', ')}</p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(guidance.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem('careerGuidance', guidance._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
              <h3 className="text-2xl font-bold mb-6">Mock Interviews</h3>
              {savedData.mockInterviews.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No mock interviews yet.</p>
              ) : (
                savedData.mockInterviews.map((interview) => (
                  <div key={interview._id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{interview.role}</h4>
                          <p className="text-slate-400">{interview.questions.length} questions</p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem('mockInterviews', interview._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
              <h3 className="text-2xl font-bold mb-6">Job Suggestions</h3>
              {savedData.jobSuggestions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No job suggestions yet.</p>
              ) : (
                savedData.jobSuggestions.map((suggestion) => (
                  <div key={suggestion._id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Briefcase className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{suggestion.userProfile.preferredRole}</h4>
                          <p className="text-slate-400">Location: {suggestion.userProfile.location}</p>
                          <p className="text-slate-500 text-sm flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem('jobSuggestions', suggestion._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
