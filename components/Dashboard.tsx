'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, MessageSquare, Briefcase, Trash2, Eye, Calendar, User } from 'lucide-react'
import config from './config'
import { useAuth } from './AuthContext'

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
  
  // NEW: State for expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // NEW: Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  useEffect(() => {
    fetchAllData()
  }, [token])

  const fetchAllData = async () => {
    if (!token) {
      console.log('No authentication token found, skipping data fetch')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      console.log('🔐 Fetching user data with token:', token.substring(0, 20) + '...')
      
      // First check if backend is accessible
      const healthCheck = await fetch(`${config.apiUrl.replace('/api', '')}/health`)
      if (!healthCheck.ok) {
        console.warn('Backend health check failed, backend might not be running')
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      
      const [guidance, interviews, jobs] = await Promise.all([
        fetch(`${config.apiUrl}/career-guidance`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/mock-interviews`, { headers }).then(res => res.ok ? res.json() : []),
        fetch(`${config.apiUrl}/job-suggestions`, { headers }).then(res => res.ok ? res.json() : [])
      ])

      console.log('📊 Fetched data:', {
        careerGuidance: guidance.length,
        mockInterviews: interviews.length,
        jobSuggestions: jobs.length
      })

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
      const endpoint = type === 'careerGuidance' ? 'career-guidance' :
                     type === 'mockInterviews' ? 'mock-interviews' : 'job-suggestions'
      
      console.log(`Attempting to delete ${type} with ID: ${id} from endpoint: /api/${endpoint}/${id}`)
      
      const res = await fetch(`${config.apiUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-2xl shadow-2xl mb-6">
            <User className="h-10 w-10 text-red-400" />
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

        {/* Content */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">

          {activeTab === 'guidance' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Mission Control Sessions</h3>
              {savedData.careerGuidance.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No mission control sessions yet.</p>
              ) : (
                                 savedData.careerGuidance.map((guidance) => {
                   const itemId = guidance._id || `guidance-${Math.random()}`
                   const isExpanded = expandedItems.has(itemId)
                   
                   return (
                     <div key={itemId} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                       {/* Clickable Header */}
                       <div 
                         className="flex items-center justify-between cursor-pointer hover:bg-slate-600/30 rounded-lg p-2 transition-colors"
                         onClick={() => toggleExpanded(itemId)}
                       >
                         <div className="flex items-center space-x-4">
                           <div className="p-2 bg-blue-500/20 rounded-lg">
                             <Target className="h-5 w-5 text-blue-400" />
                           </div>
                           <div>
                             <h4 className="font-semibold text-lg">Skills: {guidance.userProfile?.skills?.join(', ') || 'Not specified'}</h4>
                             <p className="text-slate-400">Interests: {guidance.userProfile?.interests?.join(', ') || 'Not specified'}</p>
                             <p className="text-slate-500 text-sm flex items-center space-x-2">
                               <Calendar className="h-4 w-4" />
                               <span>{guidance.createdAt ? new Date(guidance.createdAt).toLocaleDateString() : 'Date not available'}</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           <span className="text-xs text-slate-400">
                             {isExpanded ? 'Click to collapse' : 'Click to expand'}
                           </span>
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               guidance._id && deleteItem('careerGuidance', guidance._id)
                             }}
                             disabled={!guidance._id}
                             className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Trash2 className="h-5 w-5" />
                           </button>
                         </div>
                       </div>
                       
                                                {/* Expandable Content */}
                         {isExpanded && (
                           <div className="mt-4 pt-4 border-t border-slate-600/50 expand-down">
                           <div className="space-y-4">
                             {/* Career Paths */}
                             {guidance.careerPaths && guidance.careerPaths.length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                                   <Target className="h-4 w-4 text-blue-400" />
                                   <span>Recommended Career Paths</span>
                                 </h5>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                   {guidance.careerPaths.map((path: string, index: number) => (
                                     <div key={index} className="p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
                                       <span className="text-blue-200 text-sm">{path}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {/* Skill Gaps */}
                             {guidance.skillGaps && guidance.skillGaps.length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                                   <Eye className="h-4 w-4 text-amber-400" />
                                   <span>Skill Gaps Identified</span>
                                 </h5>
                                 <div className="space-y-2">
                                   {guidance.skillGaps.map((gap: string, index: number) => (
                                     <div key={index} className="p-3 bg-amber-900/20 rounded-lg border border-amber-600/30">
                                       <span className="text-amber-200 text-sm">{gap}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {/* Learning Roadmap */}
                             {guidance.learningRoadmap && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                                   <Brain className="h-4 w-4 text-green-400" />
                                   <span>Learning Roadmap</span>
                                 </h5>
                                 <div className="space-y-3">
                                   {guidance.learningRoadmap.courses && guidance.learningRoadmap.courses.length > 0 && (
                                     <div>
                                       <h6 className="text-slate-300 text-sm font-medium mb-2">Recommended Courses:</h6>
                                       <div className="space-y-2">
                                         {guidance.learningRoadmap.courses.map((course: string, index: number) => (
                                           <div key={index} className="p-2 bg-green-900/20 rounded border border-green-600/30">
                                             <span className="text-green-200 text-sm">{course}</span>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   )}
                                   
                                   {guidance.learningRoadmap.projects && guidance.learningRoadmap.projects.length > 0 && (
                                     <div>
                                       <h6 className="text-slate-300 text-sm font-medium mb-2">Project Suggestions:</h6>
                                       <div className="space-y-2">
                                         {guidance.learningRoadmap.projects.map((project: string, index: number) => (
                                           <div key={index} className="p-2 bg-purple-900/20 rounded border border-purple-600/30">
                                             <span className="text-purple-200 text-sm">{project}</span>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   )}
                                   
                                   {guidance.learningRoadmap.timeline && (
                                     <div>
                                       <h6 className="text-slate-300 text-sm font-medium mb-2">Timeline:</h6>
                                       <div className="p-2 bg-slate-800/50 rounded border border-slate-600/50">
                                         <span className="text-slate-200 text-sm">{guidance.learningRoadmap.timeline}</span>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   )
                 })
              )}
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Training Simulator Sessions</h3>
              {savedData.mockInterviews.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No training simulator sessions yet.</p>
              ) : (
                                 savedData.mockInterviews.map((interview) => {
                   const itemId = interview._id || `interview-${Math.random()}`
                   const isExpanded = expandedItems.has(itemId)
                   
                   return (
                     <div key={itemId} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                       {/* Clickable Header */}
                       <div 
                         className="flex items-center justify-between cursor-pointer hover:bg-slate-600/30 rounded-lg p-2 transition-colors"
                         onClick={() => toggleExpanded(itemId)}
                       >
                         <div className="flex items-center space-x-4">
                           <div className="p-2 bg-purple-500/20 rounded-lg">
                             <MessageSquare className="h-5 w-5 text-purple-400" />
                           </div>
                           <div>
                             <h4 className="font-semibold text-lg">{interview.role || 'Role not specified'}</h4>
                             <p className="text-slate-400">{interview.questions?.length || 0} questions</p>
                             <p className="text-slate-500 text-sm flex items-center space-x-2">
                               <Calendar className="h-4 w-4" />
                               <span>{interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'Date not available'}</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           <span className="text-xs text-slate-400">
                             {isExpanded ? 'Click to collapse' : 'Click to expand'}
                           </span>
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               interview._id && deleteItem('mockInterviews', interview._id)
                             }}
                             disabled={!interview._id}
                             className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Trash2 className="h-5 w-5" />
                           </button>
                         </div>
                       </div>
                       
                                                {/* Expandable Content */}
                         {isExpanded && (
                           <div className="mt-4 pt-4 border-t border-slate-600/50 expand-down">
                             <div className="space-y-4">
                               {/* Questions and Feedback */}
                               {interview.questions && interview.questions.length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                                   <MessageSquare className="h-4 w-4 text-purple-400" />
                                   <span>Interview Questions & Feedback</span>
                                 </h5>
                                 <div className="space-y-3">
                                   {interview.questions.map((question: any, index: number) => (
                                     <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
                                       <div className="mb-2">
                                         <h6 className="font-medium text-slate-200 text-sm">
                                           Question {index + 1}: {question.question || question.mainQuestion}
                                         </h6>
                                       </div>
                                       
                                       {/* Feedback if available */}
                                       {interview.feedback && interview.feedback[index] && (
                                         <div className="mt-2 p-2 bg-purple-900/20 rounded border border-purple-600/30">
                                           <p className="text-purple-200 text-xs mb-1">
                                             <strong>Feedback:</strong> {interview.feedback[index].feedback}
                                           </p>
                                           {interview.feedback[index].score && (
                                             <p className="text-purple-200 text-xs">
                                               <strong>Score:</strong> {interview.feedback[index].score}/10
                                             </p>
                                           )}
                                         </div>
                                       )}
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {/* Overall Score */}
                             {interview.overallScore && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                                   <Brain className="h-4 w-4 text-green-400" />
                                   <span>Overall Performance</span>
                                 </h5>
                                 <div className="p-3 bg-green-900/20 rounded-lg border border-green-600/30">
                                   <span className="text-green-200 text-sm">
                                     Overall Score: {interview.overallScore}/10
                                   </span>
                                 </div>
                               </div>
                             )}
                             
                             {/* Summary */}
                             {interview.summary && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                                   <Eye className="h-4 w-4 text-amber-400" />
                                   <span>Interview Summary</span>
                                 </h5>
                                 <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-600/30">
                                   <p className="text-amber-200 text-sm">{interview.summary}</p>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   )
                 })
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Opportunity Scanner Results</h3>
              {savedData.jobSuggestions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No opportunity scanner results yet.</p>
              ) : (
                                 savedData.jobSuggestions.map((suggestion) => {
                   const itemId = suggestion._id || `suggestion-${Math.random()}`
                   const isExpanded = expandedItems.has(itemId)
                   
                   return (
                     <div key={itemId} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                       {/* Clickable Header */}
                       <div 
                         className="flex items-center justify-between cursor-pointer hover:bg-slate-600/30 rounded-lg p-2 transition-colors"
                         onClick={() => toggleExpanded(itemId)}
                       >
                         <div className="flex items-center space-x-4">
                           <div className="p-2 bg-orange-500/20 rounded-lg">
                             <Briefcase className="h-5 w-5 text-orange-400" />
                           </div>
                           <div>
                             <h4 className="font-semibold text-lg">{suggestion.userProfile?.preferredRole || 'Role not specified'}</h4>
                             <p className="text-slate-400">Location: {suggestion.userProfile?.location || 'Location not specified'}</p>
                             <p className="text-slate-500 text-sm flex items-center space-x-2">
                               <Calendar className="h-4 w-4" />
                               <span>{suggestion.createdAt ? new Date(suggestion.createdAt).toLocaleDateString() : 'Date not available'}</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           <span className="text-xs text-slate-400">
                             {isExpanded ? 'Click to collapse' : 'Click to expand'}
                           </span>
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               suggestion._id && deleteItem('jobSuggestions', suggestion._id)
                             }}
                             disabled={!suggestion._id}
                             className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Trash2 className="h-5 w-5" />
                           </button>
                         </div>
                       </div>
                       
                                                {/* Expandable Content */}
                         {isExpanded && (
                           <div className="mt-4 pt-4 border-t border-slate-600/50 expand-down">
                             <div className="space-y-4">
                               {/* Job Opportunities */}
                               {suggestion.opportunities && suggestion.opportunities.length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                                   <Briefcase className="h-4 w-4 text-orange-400" />
                                   <span>Recommended Job Opportunities</span>
                                 </h5>
                                 <div className="space-y-3">
                                   {suggestion.opportunities.map((job: any, index: number) => (
                                     <div key={index} className="p-3 bg-orange-900/20 rounded-lg border border-orange-600/30">
                                       <div className="space-y-2">
                                         <h6 className="font-medium text-orange-200 text-sm">{job.title}</h6>
                                         <div className="text-xs text-orange-300 space-y-1">
                                           <p><strong>Company:</strong> {job.company}</p>
                                           <p><strong>Location:</strong> {job.location}</p>
                                           <p><strong>Type:</strong> {job.type}</p>
                                           {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                                         </div>
                                         {job.description && (
                                           <p className="text-orange-200 text-xs mt-2">{job.description}</p>
                                         )}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {/* Skill Match Analysis */}
                             {suggestion.skillMatch && Object.keys(suggestion.skillMatch).length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                                   <Brain className="h-4 w-4 text-green-400" />
                                   <span>Skill Match Analysis</span>
                                 </h5>
                                 <div className="space-y-2">
                                   {Object.entries(suggestion.skillMatch).map(([skill, match]: [string, any]) => (
                                     <div key={skill} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-600/50">
                                       <span className="text-slate-200 text-sm">{skill}</span>
                                       <span className={`text-sm font-medium ${
                                         match >= 80 ? 'text-green-400' : match >= 60 ? 'text-amber-400' : 'text-red-400'
                                       }`}>
                                         {match}% match
                                       </span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                             
                             {/* Career Recommendations */}
                             {suggestion.recommendations && suggestion.recommendations.length > 0 && (
                               <div>
                                 <h5 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
                                   <Eye className="h-4 w-4 text-blue-400" />
                                   <span>Career Recommendations</span>
                                 </h5>
                                 <div className="space-y-2">
                                   {suggestion.recommendations.map((rec: string, index: number) => (
                                     <div key={index} className="p-2 bg-blue-900/20 rounded border border-blue-600/30">
                                       <span className="text-blue-200 text-sm">{rec}</span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   )
                 })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
