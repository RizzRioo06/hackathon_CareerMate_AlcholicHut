'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Briefcase, GraduationCap, MapPin, Target, Sparkles } from 'lucide-react'

interface RegisterProps {
  onSwitchToLogin: () => void
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profile: {
      currentRole: '',
      experience: '',
      education: '',
      skills: [''],
      interests: [''],
      goals: '',
      location: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: (prev.profile[field as keyof typeof prev.profile] as string[]).map((item, i) => 
          i === index ? value : item
        )
      }
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: [...(prev.profile[field as keyof typeof prev.profile] as string[]), '']
      }
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: (prev.profile[field as keyof typeof prev.profile] as string[]).filter((_, i) => i !== index)
      }
    }))
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    // Check if required profile fields have meaningful content (not just empty strings or whitespace)
    const requiredFields = [
      { field: 'currentRole', label: 'Current Role' },
      { field: 'experience', label: 'Experience' },
      { field: 'education', label: 'Education' },
      { field: 'location', label: 'Location' }
    ]
    
    console.log('🔍 Validating Step 2 with profile data:', formData.profile)
    
    for (const { field, label } of requiredFields) {
      const value = formData.profile[field as keyof typeof formData.profile]
      console.log(`  Checking ${field}: "${value}" (trimmed: "${typeof value === 'string' ? value.trim() : value}")`)
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        console.log(`❌ Validation failed for ${field}: "${value}"`)
        setError(`Please fill in ${label}`)
        return false
      }
    }
    
    console.log('✅ Step 2 validation passed')
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    console.log('🚀 Form submission started')
    console.log('📊 Current step:', currentStep)
    console.log('📝 Form data:', formData)

    // Validate both steps before submitting
    if (!validateStep1()) {
      console.log('❌ Step 1 validation failed, staying on step 1')
      setCurrentStep(1) // Go back to step 1 if validation fails
      return
    }
    console.log('✅ Step 1 validation passed')

    // Always validate step 2 if we're submitting the complete form
    if (!validateStep2()) {
      console.log('❌ Step 2 validation failed, moving to step 2')
      setCurrentStep(2) // Go to step 2 if validation fails
      return
    }
    console.log('✅ Step 2 validation passed, proceeding with registration')

    setIsLoading(true)

    try {
      console.log('📤 Sending registration data to backend:', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: formData.profile
      })
      
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: formData.profile
      })
      
      console.log('✅ Registration successful')
    } catch (error) {
      console.error('❌ Registration error:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl mb-6">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join CareerMate</h1>
          <p className="text-slate-400">Create your account and start your career journey</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 1 ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-600 text-slate-400'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              currentStep >= 2 ? 'bg-indigo-500' : 'bg-slate-600'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= 2 ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-600 text-slate-400'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 ? (
              // Step 1: Basic Information
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next Step Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Next: Profile Setup
                </button>
              </div>
            ) : (
              // Step 2: Profile Setup
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Setup</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Role */}
                  <div>
                    <label htmlFor="currentRole" className="block text-sm font-medium text-slate-300 mb-2">
                      Current Role
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="currentRole"
                        type="text"
                        value={formData.profile.currentRole}
                        onChange={(e) => handleInputChange('profile.currentRole', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-slate-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      type="text"
                      value={formData.profile.experience}
                      onChange={(e) => handleInputChange('profile.experience', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., 3 years"
                    />
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-slate-300 mb-2">
                    Education
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="education"
                      type="text"
                      value={formData.profile.education}
                      onChange={(e) => handleInputChange('profile.education', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., Bachelor's in Computer Science"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="location"
                      type="text"
                      value={formData.profile.location}
                      onChange={(e) => handleInputChange('profile.location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Skills
                  </label>
                  <div className="space-y-3">
                    {formData.profile.skills.map((skill, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="e.g., JavaScript, React, Node.js"
                        />
                        {formData.profile.skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('skills', index)}
                            className="px-3 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('skills')}
                      className="w-full py-2 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
                    >
                      + Add Skill
                    </button>
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-slate-300 mb-2">
                    Career Goals
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <textarea
                      id="goals"
                      value={formData.profile.goals}
                      onChange={(e) => handleInputChange('profile.goals', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      placeholder="What are your career goals? (e.g., Become a Senior Developer, Lead a team, etc.)"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-600/50 transition-all duration-200"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
