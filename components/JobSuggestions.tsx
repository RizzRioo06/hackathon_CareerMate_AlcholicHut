'use client'

import { useState } from 'react'
import { useAuth } from './AuthContext'
import config from './config'
import { Briefcase, MapPin, Building, Loader2, TrendingUp, Search, Target, Star, Clock, DollarSign, Users } from 'lucide-react'

interface JobOpportunity {
  title: string
  company: string
  location: string
  type: string
  requiredSkills: string[]
  description: string
  salary: string
  postedDate: string
}

interface JobSuggestionsResponse {
  opportunities: JobOpportunity[]
  skillMatch: {
    [key: string]: number
  }
  recommendations: string[]
}

export default function JobSuggestions() {
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    location: '',
    preferredRole: '',
    education: '',
    interests: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<JobSuggestionsResponse | null>(null)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError('Please log in to use this feature')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${config.apiUrl}/job-suggestions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, language: 'en' })
      })
      
      if (res.ok) {
        const data = await res.json()
        setResponse(data)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to get job suggestions')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to get job suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillMatchColor = (match: number) => {
    if (match >= 80) return 'text-emerald-400'
    if (match >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getSkillMatchBg = (match: number) => {
    if (match >= 80) return 'bg-emerald-900/20'
    if (match >= 60) return 'bg-amber-900/20'
    return 'bg-red-900/20'
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400 text-lg">Please log in to access Opportunity Scanner</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Enhanced Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
            <Briefcase className="h-14 w-14 text-white" />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-6">Opportunity Scanner</h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Welcome to the Opportunity Scanner! Discover personalized job and internship opportunities based on your skills and preferences. 
            Our AI analyzes your profile to find the best matches in the vast universe of career opportunities.
          </p>
        </div>
      </div>

      {/* Enhanced Form */}
      <div className="card max-w-6xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100">Your Profile</h3>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label htmlFor="skills" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Star className="h-6 w-6 text-purple-400" />
                    <span>Skills/Technologies</span>
                  </div>
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Python, AWS, Docker..."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-6">
                <label htmlFor="location" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="h-6 w-6 text-red-400" />
                    <span>Location</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, Remote, New York..."
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label htmlFor="education" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="h-6 w-6 text-yellow-400" />
                    <span>Education</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's, Master's, Bootcamp..."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-6">
                <label htmlFor="experience" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-6 w-6 text-blue-400" />
                    <span>Experience</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 years, Entry level, 5+ years..."
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label htmlFor="preferredRole" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Briefcase className="h-6 w-6 text-green-400" />
                    <span>Job Roles</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="preferredRole"
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Developer, Data Scientist..."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-6">
                <label htmlFor="interests" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                    <span>Interests/Specialization</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., AI/ML, Web3, Cloud, Mobile..."
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-lg px-12 py-5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Scanning Universe...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Search className="h-6 w-6" />
                    <span>Launch Opportunity Scanner</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Response */}
      {response && (
        <div className="max-w-7xl mx-auto space-y-16 animate-slide-up">
          {/* Enhanced Skill Match Analysis */}
          

          {/* Enhanced Job Opportunities */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">Recommended Opportunities</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {response.opportunities.map((job, index) => (
                <div key={index} className="card-hover group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors duration-300">{job.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-300 mb-4">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-blue-400" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-red-400" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full font-medium border border-blue-600/30">
                          {job.type}
                        </span>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-amber-400" />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-200 mb-6 text-lg leading-relaxed line-clamp-3">{job.description}</p>
                  
                  <div className="mb-6">
                    <h5 className="font-semibold text-slate-100 mb-3 text-lg">Required Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-2 bg-slate-700/50 text-slate-200 text-sm rounded-xl border border-slate-600/50 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">Contact the company directly to apply for this position</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Recommendations */}
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span>Career Recommendations</span>
              </h3>
              <div className="space-y-4">
                {response.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-emerald-900/20 rounded-2xl border border-emerald-600/30">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-200 text-lg">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
