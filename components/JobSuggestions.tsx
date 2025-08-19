'use client'

import { useState } from 'react'
import { Briefcase, MapPin, Building, ExternalLink, Loader2, TrendingUp } from 'lucide-react'

interface JobOpportunity {
  title: string
  company: string
  location: string
  type: string
  requiredSkills: string[]
  description: string
  salary: string
  applicationLink: string
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/job-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setResponse(data)
      } else {
        throw new Error('Failed to get job suggestions')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillMatchColor = (match: number) => {
    if (match >= 80) return 'text-green-600'
    if (match >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSkillMatchBg = (match: number) => {
    if (match >= 80) return 'bg-green-100'
    if (match >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Briefcase className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover personalized job and internship opportunities based on your skills and preferences. 
          Our AI analyzes your profile to find the best matches in the market.
        </p>
      </div>

      {/* Form */}
      <div className="card max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Python, AWS, Docker..."
                className="input-field h-24 resize-none"
                required
              />
            </div>
            
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
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
            
            <div>
              <label htmlFor="preferredRole" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Role
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
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
            
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Interest
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

          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Finding Opportunities...</span>
                </div>
              ) : (
                'Find Job Opportunities'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Response */}
      {response && (
        <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
          {/* Skill Match Analysis */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Skill Match Analysis</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(response.skillMatch).map(([skill, match]) => (
                <div key={skill} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${getSkillMatchBg(match)}`}>
                    <span className={`text-lg font-bold ${getSkillMatchColor(match)}`}>
                      {match}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job Opportunities */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Recommended Opportunities</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {response.opportunities.map((job, index) => (
                <div key={index} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {job.type}
                        </span>
                        <span>{job.salary}</span>
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Required Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <a
                      href={job.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Recommendations</h3>
            <div className="space-y-3">
              {response.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
