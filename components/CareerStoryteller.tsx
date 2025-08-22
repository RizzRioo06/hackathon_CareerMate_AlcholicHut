'use client'

import { useState, useRef } from 'react'
import { 
  BookOpen, 
  MessageSquare, 
  Linkedin, 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Loader2, 
  RefreshCw,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Heart
} from 'lucide-react'
import { useTranslation } from './TranslationContext'
import { getTranslation, TRANSLATION_KEYS } from './translations'
import LanguageSelector from './LanguageSelector'

interface CareerStory {
  id: string
  type: 'interview' | 'linkedin' | 'networking' | 'resume'
  content: string
  timestamp: number
}

interface UserProfile {
  name: string
  currentRole: string
  experience: string
  education: string
  keySkills: string[]
  achievements: string[]
  careerGoals: string
  personalInterests: string[]
}

export default function CareerStoryteller() {
  const { currentLanguage } = useTranslation()
  
  // Add refs for input fields
  const skillInputRef = useRef<HTMLInputElement>(null)
  const achievementInputRef = useRef<HTMLInputElement>(null)
  const interestInputRef = useRef<HTMLInputElement>(null)
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    currentRole: '',
    experience: '',
    education: '',
    keySkills: [],
    achievements: [],
    careerGoals: '',
    personalInterests: []
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [stories, setStories] = useState<CareerStory[]>([])
  const [activeTab, setActiveTab] = useState<'input' | 'stories'>('input')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInputChange = (field: keyof UserProfile, value: string | string[]) => {
    setUserProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillInput = (value: string) => {
    if (value.trim()) {
      setUserProfile(prev => ({
        ...prev,
        keySkills: [...prev.keySkills, value.trim()]
      }))
    }
  }

  const removeSkill = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter((_, i) => i !== index)
    }))
  }

  const handleAchievementInput = (value: string) => {
    if (value.trim()) {
      setUserProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, value.trim()]
      }))
    }
  }

  const removeAchievement = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const handleInterestInput = (value: string) => {
    if (value.trim()) {
      setUserProfile(prev => ({
        ...prev,
        personalInterests: [...prev.personalInterests, value.trim()]
      }))
    }
  }

  const removeInterest = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      personalInterests: prev.personalInterests.filter((_, i) => i !== index)
    }))
  }

  const generateStories = async () => {
    setIsGenerating(true)
    setErrorMessage(null)
    
    try {
      const storyTypes = ['interview', 'linkedin', 'networking', 'resume']
      const newStories: CareerStory[] = []
      
      for (const type of storyTypes) {
        const res = await fetch('http://localhost:5000/api/career-storyteller', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userProfile, storyType: type, language: currentLanguage })
        })
        
        if (!res.ok) {
          throw new Error(`Failed to generate ${type} story`)
        }
        
        const data = await res.json()
        newStories.push({
          id: Date.now().toString() + type,
          type: type as any,
          content: data.story,
          timestamp: Date.now()
        })
      }
      
      setStories(newStories)
      setActiveTab('stories')
      
    } catch (error) {
      console.error('Story generation error:', error)
      setErrorMessage(getTranslation(currentLanguage, 'FAILED_TO_GENERATE'))
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadStory = (story: CareerStory) => {
    const blob = new Blob([story.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `career-story-${story.type}-${userProfile.name}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const regenerateStory = async (storyType: string) => {
    setIsGenerating(true)
    setErrorMessage(null)
    
    try {
      const res = await fetch('http://localhost:5000/api/career-storyteller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userProfile, storyType, language: currentLanguage })
      })
      
      if (!res.ok) {
        throw new Error(`Failed to regenerate ${storyType} story`)
      }
      
      const data = await res.json()
      
      setStories(prev => prev.map(story => 
        story.type === storyType 
          ? { ...story, content: data.story, timestamp: Date.now() }
          : story
      ))
      
    } catch (error) {
      console.error('Story regeneration error:', error)
      setErrorMessage(getTranslation(currentLanguage, 'FAILED_TO_REGENERATE'))
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setUserProfile({
      name: '',
      currentRole: '',
      experience: '',
      education: '',
      keySkills: [],
      achievements: [],
      careerGoals: '',
      personalInterests: []
    })
    setStories([])
    setActiveTab('input')
    setErrorMessage(null)
  }

  if (activeTab === 'stories' && stories.length > 0) {
    return (
      <div className="space-y-16 max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-6 animate-bounce-in">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-6">
              {getTranslation(currentLanguage, 'YOUR_CAREER_STORIES')}
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {getTranslation(currentLanguage, 'STORIES_DESCRIPTION')}
            </p>
          </div>
        </div>

        {/* Story Tabs */}
        <div className="space-y-8">
          {stories.map((story) => (
            <div key={story.id} className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                      {story.type === 'interview' && <MessageSquare className="h-6 w-6 text-white" />}
                      {story.type === 'linkedin' && <Linkedin className="h-6 w-6 text-white" />}
                      {story.type === 'networking' && <User className="h-6 w-6 text-white" />}
                      {story.type === 'resume' && <FileText className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100 capitalize">
                        {story.type === 'interview' && getTranslation(currentLanguage, 'INTERVIEW_STORY')}
                        {story.type === 'linkedin' && getTranslation(currentLanguage, 'LINKEDIN_BIO')}
                        {story.type === 'networking' && getTranslation(currentLanguage, 'NETWORKING_PITCH')}
                        {story.type === 'resume' && getTranslation(currentLanguage, 'RESUME_SUMMARY')}
                      </h3>
                                              <p className="text-slate-400 text-sm">
                          {getTranslation(currentLanguage, 'GENERATED_ON')} {new Date(story.timestamp).toLocaleString()}
                        </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => regenerateStory(story.type)}
                      disabled={isGenerating}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{getTranslation(currentLanguage, 'REGENERATE')}</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(story.content)}
                      className="btn-accent flex items-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{getTranslation(currentLanguage, 'COPY')}</span>
                    </button>
                    <button
                      onClick={() => downloadStory(story)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>{getTranslation(currentLanguage, 'DOWNLOAD')}</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-lg">
                      {story.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={resetForm}
            className="btn-secondary flex items-center space-x-3"
          >
            <Sparkles className="h-5 w-5" />
            <span>{getTranslation(currentLanguage, 'CREATE_NEW_STORIES')}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        <div className="relative">
          {/* Language Selector */}
          <div className="absolute top-0 right-0 z-10">
            <LanguageSelector />
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-6 animate-bounce-in">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-6">
            {getTranslation(currentLanguage, 'AI_CAREER_STORYTELLER')}
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {getTranslation(currentLanguage, 'HEADER_DESCRIPTION')}
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="card max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100">
              {getTranslation(currentLanguage, 'TELL_YOUR_STORY')}
            </h3>
          </div>
          
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span>{getTranslation(currentLanguage, 'YOUR_NAME')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={getTranslation(currentLanguage, 'ENTER_FULL_NAME')}
                  className="input-field text-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    <span>{getTranslation(currentLanguage, 'CURRENT_ROLE')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={userProfile.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  placeholder={getTranslation(currentLanguage, 'CURRENT_ROLE_PLACEHOLDER')}
                  className="input-field text-lg"
                  required
                />
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="h-5 w-5 text-blue-400" />
                    <span>{getTranslation(currentLanguage, 'YEARS_OF_EXPERIENCE')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={userProfile.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder={getTranslation(currentLanguage, 'EXPERIENCE_PLACEHOLDER')}
                  className="input-field text-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-slate-200 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                    <span>{getTranslation(currentLanguage, 'EDUCATION')}</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={userProfile.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder={getTranslation(currentLanguage, 'EDUCATION_PLACEHOLDER')}
                  className="input-field text-lg"
                  required
                />
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <label className="block text-lg font-semibold text-slate-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Award className="h-5 w-5 text-blue-400" />
                  <span>{getTranslation(currentLanguage, 'KEY_SKILLS')}</span>
                </div>
              </label>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    ref={skillInputRef}
                    type="text"
                    placeholder={getTranslation(currentLanguage, 'SKILL_PLACEHOLDER')}
                    className="input-field flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillInput((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                                     <button
                     onClick={() => {
                       if (skillInputRef.current) {
                         handleSkillInput(skillInputRef.current.value)
                         skillInputRef.current.value = ''
                       }
                     }}
                     className="btn-primary px-6"
                   >
                     {getTranslation(currentLanguage, 'ADD')}
                   </button>
                </div>
                {userProfile.keySkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.keySkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-900/30 text-blue-200 text-sm rounded-xl border border-blue-600/30 font-medium flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-blue-400 hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-lg font-semibold text-slate-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Award className="h-5 w-5 text-blue-400" />
                  <span>{getTranslation(currentLanguage, 'KEY_ACHIEVEMENTS')}</span>
                </div>
              </label>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    ref={achievementInputRef}
                    type="text"
                    placeholder={getTranslation(currentLanguage, 'ACHIEVEMENT_PLACEHOLDER')}
                    className="input-field flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAchievementInput((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                                     <button
                     onClick={() => {
                       if (achievementInputRef.current) {
                         handleAchievementInput(achievementInputRef.current.value)
                         achievementInputRef.current.value = ''
                       }
                     }}
                     className="btn-primary px-6"
                   >
                     {getTranslation(currentLanguage, 'ADD')}
                   </button>
                </div>
                {userProfile.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-green-900/30 text-green-200 text-sm rounded-xl border border-green-600/30 font-medium flex items-center space-x-2"
                      >
                        <span>{achievement}</span>
                        <button
                          onClick={() => removeAchievement(index)}
                          className="text-green-400 hover:text-green-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Career Goals */}
            <div>
              <label className="block text-lg font-semibold text-slate-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="h-5 w-5 text-blue-400" />
                  <span>{getTranslation(currentLanguage, 'CAREER_GOALS')}</span>
                </div>
              </label>
              <textarea
                value={userProfile.careerGoals}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                placeholder={getTranslation(currentLanguage, 'CAREER_GOALS_PLACEHOLDER')}
                className="input-field text-lg min-h-[100px]"
                required
              />
            </div>

            {/* Personal Interests */}
            <div>
              <label className="block text-lg font-semibold text-slate-200 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="h-5 w-5 text-blue-400" />
                  <span>{getTranslation(currentLanguage, 'PERSONAL_INTERESTS')}</span>
                </div>
              </label>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    ref={interestInputRef}
                    type="text"
                    placeholder={getTranslation(currentLanguage, 'INTEREST_PLACEHOLDER')}
                    className="input-field flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleInterestInput((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                                     <button
                     onClick={() => {
                       if (interestInputRef.current) {
                         handleInterestInput(interestInputRef.current.value)
                         interestInputRef.current.value = ''
                       }
                     }}
                     className="btn-primary px-6"
                   >
                     {getTranslation(currentLanguage, 'ADD')}
                   </button>
                </div>
                {userProfile.personalInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.personalInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-purple-900/30 text-purple-200 text-sm rounded-xl border border-purple-600/30 font-medium flex items-center space-x-2"
                      >
                        <span>{interest}</span>
                        <button
                          onClick={() => removeInterest(index)}
                          className="text-purple-400 hover:text-purple-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-600/30 bg-red-900/20 p-4 text-red-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-6">
              <button
                onClick={generateStories}
                disabled={!userProfile.name || !userProfile.currentRole || !userProfile.experience || !userProfile.education || isGenerating}
                className="btn-primary text-lg px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>{getTranslation(currentLanguage, 'GENERATING_STORIES')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-6 w-6" />
                    <span>{getTranslation(currentLanguage, 'GENERATE_MY_STORIES')}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
