'use client'

import { useState } from 'react'
import { Target, BookOpen, TrendingUp, Loader2 } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    goals: '',
    experience: '',
    education: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<CareerGuidanceResponse | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/career-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setResponse(data)
      } else {
        throw new Error('Failed to get career guidance')
      }
    } catch (error) {
      console.error('Error:', error)
      // Handle error appropriately - could show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Target className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Career Guidance</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your skills, interests, and goals. Our AI will provide personalized career recommendations, 
          skill gap analysis, and a learning roadmap to help you succeed.
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Current Skills
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, Python, React, SQL..."
                className="input-field h-24 resize-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Interest
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="e.g., Web development, AI/ML, Cloud computing..."
                className="input-field h-24 resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
              Career Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              placeholder="e.g., Become a senior developer, transition to data science, start a tech company..."
              className="input-field h-20 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
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
            
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Education Background
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science degree, Bootcamp, Self-taught..."
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Get Career Guidance'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Response */}
      {response && (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
          {/* Career Paths */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Recommended Career Paths</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {response.careerPaths.map((path, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-green-800 font-medium">{path}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-gray-900">Skill Gap Analysis</h3>
            </div>
            <div className="space-y-3">
              {response.skillGaps.map((gap, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Personalized Learning Roadmap</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommended Courses</h4>
                <div className="space-y-2">
                  {response.learningRoadmap.courses.map((course, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <span className="text-blue-800">{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Project Suggestions</h4>
                <div className="space-y-2">
                  {response.learningRoadmap.projects.map((project, index) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <span className="text-purple-800">{project}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                <p className="text-gray-700">{response.learningRoadmap.timeline}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
