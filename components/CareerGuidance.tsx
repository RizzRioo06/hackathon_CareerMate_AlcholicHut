'use client'

import { useState } from 'react'
import { useAuth } from './AuthContext'
import config from './config'
import { Target, BookOpen, TrendingUp, Loader2, Sparkles, Rocket, Lightbulb, GraduationCap } from 'lucide-react'

interface CareerGuidanceResponse {
  careerPaths: string[]
  skillGaps: string[]
  learningRoadmap: {
    courses: string[]
    projects: string[]
    timeline: string
  }
}

export default function CareerGuidance() {
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    goals: '',
    experience: '',
    education: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<CareerGuidanceResponse | null>(null)
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
      const res = await fetch(`${config.apiUrl}/career-guidance`, {
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
        throw new Error(errorData.error || 'Failed to get career guidance')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to get career guidance')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400 text-lg">Please log in to access Career Guidance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Enhanced Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
            <Target className="h-14 w-14 text-white" />
          </div>
          <h2 className="text-5xl font-bold gradient-text mb-6">Career Guidance</h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Tell us about your skills, interests, and goals. Our AI will provide personalized career recommendations, 
            skill gap analysis, and a learning roadmap to help you succeed.
          </p>
        </div>
      </div>

      {/* Enhanced Form */}
      <div className="card max-w-6xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Sparkles className="h-7 w-7 text-white" />
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
                    <Rocket className="h-6 w-6 text-blue-400" />
                    <span>Current Skills</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Python, AWS, Docker..."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-6">
                <label htmlFor="interests" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    <span>Areas of Interest</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Web development, AI/ML, Cloud computing, Mobile apps..."
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label htmlFor="goals" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="h-6 w-6 text-red-400" />
                    <span>Career Goals</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="e.g., Become a senior developer, transition to data science, start a tech company..."
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-6">
                <label htmlFor="experience" className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                    <span>Years of Experience</span>
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
            
            <div className="space-y-6">
              <label htmlFor="education" className="block text-lg font-semibold text-slate-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-purple-400" />
                  <span>Education Background</span>
                </div>
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g., Bachelor's in Computer Science, Bootcamp graduate, Self-taught..."
                className="input-field"
                required
              />
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
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-6 w-6" />
                    <span>Get Career Guidance</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Response */}
      {response && (
        <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
          {/* Career Paths */}
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recommended Career Paths</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.careerPaths.map((path, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-semibold text-lg">{path}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Skill Gap Analysis</h3>
              </div>
              <div className="space-y-4">
                {response.skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-800 text-lg">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personalized Learning Roadmap</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-xl flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <span>Recommended Courses</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {response.learningRoadmap.courses.map((course, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <span className="text-blue-800 font-medium">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-xl flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-purple-500" />
                    <span>Project Suggestions</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {response.learningRoadmap.projects.map((project, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <span className="text-purple-800 font-medium">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
