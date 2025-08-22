'use client'

import { useState, useEffect } from 'react'
import { Brain, MessageSquare, Lightbulb, Target, Rocket, Star, Loader2, Sparkles, ArrowRight, CheckCircle, TrendingUp, Users, BookOpen, Award, MapPin, Building, DollarSign, Search, Eye, Download, Share2 } from 'lucide-react'


interface DiscoverySession {
  id: string
  timestamp: number
  userProfile: {
    name: string
    currentRole: string
    interests: string[]
    skills: string[]
    goals: string[]
    experience: string
    education: string
  }
  careerPaths: CareerPath[]
  learningRoadmap: LearningRoadmap
  conversationHistory: ConversationMessage[]
}

interface CareerPath {
  title: string
  description: string
  transferableSkills: string[]
  skillGaps: string[]
  marketDemand: 'High' | 'Medium' | 'Low'
  salaryRange: string
  companies: string[]
  nextSteps: string[]
}

interface LearningRoadmap {
  immediate: string[]
  shortTerm: string[]
  longTerm: string[]
  resources: {
    courses: string[]
    projects: string[]
    certifications: string[]
    networking: string[]
  }
}

interface ConversationMessage {
  role: 'user' | 'ai'
  content: string
  timestamp: number
  type: 'question' | 'answer' | 'insight' | 'recommendation'
}

export default function CareerDiscovery() {
  
  const [currentStep, setCurrentStep] = useState<'start' | 'discovery' | 'analysis' | 'results'>('start')
  
  useEffect(() => {
    fetchSavedDiscoveries()
  }, [])
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [userInputs, setUserInputs] = useState({
    name: '',
    currentRole: '',
    primaryInterest: '',
    secondaryInterest: '',
    experience: '',
    education: ''
  })
  const [discoverySession, setDiscoverySession] = useState<DiscoverySession | null>(null)
  const [savedDiscoveries, setSavedDiscoveries] = useState<any[]>([])
  const [showSavedDiscoveries, setShowSavedDiscoveries] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Progressive questions that adapt based on user responses
  const discoveryQuestions = [
    {
      id: 'name',
      question: "What's your name?",
      placeholder: "Enter your full name",
      type: 'text'
    },
    {
      id: 'currentRole',
      question: "What's your current role or profession?",
      placeholder: "e.g., Software Developer, Teacher, Manager",
      type: 'text'
    },
    {
      id: 'primaryInterest',
      question: "What's your primary interest or passion?",
      placeholder: "e.g., Technology, Arts, Health, Education",
      type: 'text'
    },
    {
      id: 'secondaryInterest',
      question: "What's a secondary interest you'd like to explore?",
      placeholder: "e.g., Leadership, Creative Writing, Data Analysis",
      type: 'text'
    },
    {
      id: 'experience',
      question: "How many years of experience do you have in your field?",
      placeholder: "e.g., 3 years, Entry level, 10+ years",
      type: 'text'
    },
    {
      id: 'education',
      question: "What's your educational background?",
      placeholder: "e.g., Bachelor's in Computer Science, Self-taught",
      type: 'text'
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerateDiscovery = () => {
    startDiscovery()
  }

  const fetchSavedDiscoveries = async () => {
    try {
      const res = await fetch('https://your-render-backend.onrender.com/api/career-discoveries')
      if (res.ok) {
        const data = await res.json()
        setSavedDiscoveries(data)
      }
    } catch (error) {
      console.error('Failed to fetch discoveries:', error)
    }
  }

  const deleteDiscovery = async (id: string) => {
    try {
      const res = await fetch(`https://your-render-backend.onrender.com/api/career-discoveries/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setSavedDiscoveries(prev => prev.filter(d => d._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete discovery:', error)
    }
  }

  const startDiscovery = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    
    try {
      // Add user inputs to conversation
      const userMessages: ConversationMessage[] = Object.entries(userInputs).map(([key, value]) => ({
        role: 'user',
        content: `${key}: ${value}`,
        timestamp: Date.now(),
        type: 'answer'
      }))
      
      setConversation(userMessages)
      
      // Call AI discovery API
      const res = await fetch('https://your-render-backend.onrender.com/api/career-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userInputs })
      })
      
      if (!res.ok) {
        throw new Error('Failed to start career discovery')
      }
      
      const data = await res.json()
      
      // Create discovery session
      const session: DiscoverySession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        userProfile: {
          name: userInputs.name,
          currentRole: userInputs.currentRole,
          interests: [userInputs.primaryInterest, userInputs.secondaryInterest].filter(Boolean),
          skills: [],
          goals: [],
          experience: userInputs.experience,
          education: userInputs.education
        },
        careerPaths: data.careerPaths || [],
        learningRoadmap: data.learningRoadmap || {
          immediate: [],
          shortTerm: [],
          longTerm: [],
          resources: { courses: [], projects: [], certifications: [], networking: [] }
        },
        conversationHistory: [...userMessages, ...(data.conversation || [])]
      }
      
      setDiscoverySession(session)
      setConversation(session.conversationHistory)
      setCurrentStep('results')
      
    } catch (error) {
      console.error('Discovery error:', error)
      setErrorMessage('Failed to start career discovery. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const exportSession = () => {
    if (!discoverySession) return
    
    // Create formatted report content
    const reportContent = generateReportContent(discoverySession)
    
    // Create and download as text file (users can convert to PDF)
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `career-discovery-${discoverySession.userProfile.name}-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const generateReportContent = (session: DiscoverySession) => {
    // Create a formatted text report that can be saved as a file
    // Users can then convert this to PDF using their preferred method
    
    const content = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           CAREER DISCOVERY REPORT                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

Generated on: ${new Date().toLocaleDateString()}
User: ${session.userProfile.name}

╔══════════════════════════════════════════════════════════════════════════════╗
║                              CURRENT PROFILE                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

Role: ${session.userProfile.currentRole}
Experience: ${session.userProfile.experience}
Education: ${session.userProfile.education}
Interests: ${session.userProfile.interests.join(', ')}

╔══════════════════════════════════════════════════════════════════════════════╗
║                           DISCOVERED CAREER PATHS                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

${session.careerPaths.map((path, index) => `
${index + 1}. ${path.title.toUpperCase()}
   Market Demand: ${path.marketDemand}
   Salary Range: ${path.salaryRange}
   
   Description:
   ${path.description}
   
   Transferable Skills:
   ${path.transferableSkills.map(skill => `   • ${skill}`).join('\n')}
   
   Skills to Develop:
   ${path.skillGaps.map(skill => `   • ${skill}`).join('\n')}
   
   Next Steps:
   ${path.nextSteps.map(step => `   • ${step}`).join('\n')}
   
   ───────────────────────────────────────────────────────────────────────────────
`).join('\n')}

╔══════════════════════════════════════════════════════════════════════════════╗
║                            LEARNING ROADMAP                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

🚀 IMMEDIATE ACTIONS (This Week):
${session.learningRoadmap.immediate.map(action => `• ${action}`).join('\n')}

📈 SHORT TERM (1-3 Months):
${session.learningRoadmap.shortTerm.map(action => `• ${action}`).join('\n')}

⭐ LONG TERM (6-12 Months):
${session.learningRoadmap.longTerm.map(action => `• ${action}`).join('\n')}

╔══════════════════════════════════════════════════════════════════════════════╗
║                              RESOURCES                                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

📚 Courses:
${session.learningRoadmap.resources.courses.map(course => `• ${course}`).join('\n')}

🔨 Projects:
${session.learningRoadmap.resources.projects.map(project => `• ${project}`).join('\n')}

🏆 Certifications:
${session.learningRoadmap.resources.certifications.map(cert => `• ${cert}`).join('\n')}

🤝 Networking:
${session.learningRoadmap.resources.networking.map(network => `• ${network}`).join('\n')}

╔══════════════════════════════════════════════════════════════════════════════╗
║                    Generated by CareerMate AI Career Discovery Engine       ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `.trim()
    
    return content
  }

  const resetDiscovery = () => {
    setCurrentStep('start')
    setConversation([])
    setDiscoverySession(null)
    setUserInputs({
      name: '',
      currentRole: '',
      primaryInterest: '',
      secondaryInterest: '',
      experience: '',
      education: ''
    })
    setErrorMessage(null)
  }

  if (currentStep === 'start') {
    return (
      <div className="space-y-16">
        {/* Enhanced Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="relative">
            {/* Language Selector */}
            <div className="absolute top-0 right-0 z-10">

            </div>
            
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <Brain className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-5xl font-bold gradient-text mb-6">Career Discovery</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Discover unexpected career paths by combining your current skills with your interests. Our AI analyzes your unique profile to uncover opportunities you might never have considered.
            </p>
          </div>
        </div>

        {/* Discovery Form */}
        <div className="card max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
          <div className="relative">
                         <div className="flex items-center space-x-4 mb-10">
               <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                 <Sparkles className="h-7 w-7 text-white" />
               </div>
               <h3 className="text-3xl font-bold text-slate-100">Start Your Discovery</h3>
             </div>
             <div className="text-center mb-8">
               <p className="text-slate-300 text-lg">
                 Tell us about yourself and we'll discover unique career paths that combine your skills with your interests.
               </p>
             </div>
            
                         <div className="space-y-8">
               {discoveryQuestions.map((question, index) => (
                 <div key={question.id} className="transition-all duration-500 opacity-100 scale-100">
                   <label htmlFor={question.id} className="block text-lg font-semibold text-slate-200 mb-4">
                     <div className="flex items-center space-x-3 mb-3">
                       <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                         {index + 1}
                       </div>
                       <span>{question.question}</span>
                     </div>
                   </label>
                   <input
                     type={question.type}
                     id={question.id}
                     value={userInputs[question.id as keyof typeof userInputs] || ''}
                     onChange={(e) => handleInputChange(question.id, e.target.value)}
                     placeholder={question.placeholder}
                     className={`input-field text-lg ${userInputs[question.id as keyof typeof userInputs]?.trim() ? 'border-green-500/50 bg-green-900/20' : ''}`}
                     required
                   />
                 </div>
               ))}
              
              {errorMessage && (
                <div className="rounded-2xl border border-red-600/30 bg-red-900/20 p-4 text-red-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
              
              {/* Saved Discoveries Section */}
              {savedDiscoveries.length > 0 && (
                <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-slate-200">Your Previous Discoveries</h4>
                    <button
                      onClick={() => setShowSavedDiscoveries(!showSavedDiscoveries)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {showSavedDiscoveries ? 'Hide' : 'Show'} ({savedDiscoveries.length})
                    </button>
                  </div>
                  
                  {showSavedDiscoveries && (
                    <div className="space-y-4">
                      {savedDiscoveries.map((discovery) => (
                        <div key={discovery._id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-slate-200">{discovery.userProfile.name}</h5>
                              <p className="text-slate-400 text-sm">{discovery.userProfile.currentRole}</p>
                              <p className="text-slate-500 text-xs">{new Date(discovery.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                              onClick={() => deleteDiscovery(discovery._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-center pt-6">
                 <button
                   onClick={handleGenerateDiscovery}
                   disabled={!Object.values(userInputs).every(value => value.trim()) || isLoading}
                   className="btn-primary text-lg px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoading ? (
                     <div className="flex items-center space-x-3">
                       <Loader2 className="h-6 w-6 animate-spin" />
                       <span>Generating...</span>
                     </div>
                   ) : (
                     <div className="flex items-center space-x-3">
                       <Sparkles className="h-6 w-6" />
                       <span>Start Discovery</span>
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

  if (currentStep === 'results' && discoverySession) {
    return (
      <div className="space-y-16 max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="relative">
            {/* Language Selector */}
            <div className="absolute top-0 right-0 z-10">

            </div>
            
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-5xl font-bold gradient-text mb-6">Career Discovery Results</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Based on your profile, we've discovered exciting career paths that combine your skills with your interests.
            </p>
          </div>
        </div>

        {/* Career Paths */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Discovered Career Paths</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {discoverySession.careerPaths.map((path, index) => (
              <div key={index} className="card-hover group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-400 transition-colors duration-300">
                      {path.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-300 mb-4">
                      <span className={`px-3 py-1 rounded-full font-medium border ${
                        path.marketDemand === 'High' ? 'bg-green-900/30 text-green-300 border-green-600/30' :
                        path.marketDemand === 'Medium' ? 'bg-amber-900/30 text-amber-300 border-amber-600/30' :
                        'bg-red-900/30 text-red-300 border-red-600/30'
                      }`}>
                        {path.marketDemand} Demand
                      </span>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span>{path.salaryRange}</span>
                      </div>

                    </div>
                  </div>
                </div>
                
                <p className="text-slate-200 mb-6 text-lg leading-relaxed">{path.description}</p>
                
                <div className="mb-6">
                  <h5 className="font-semibold text-slate-100 mb-3 text-lg">Transferable Skills:</h5>
                  <div className="flex flex-wrap gap-2">
                    {path.transferableSkills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-2 bg-green-900/30 text-green-200 text-sm rounded-xl border border-green-600/30 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-slate-100 mb-3 text-lg">Skills to Develop:</h5>
                  <div className="flex flex-wrap gap-2">
                    {path.skillGaps.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-2 bg-amber-900/30 text-amber-200 text-sm rounded-xl border border-amber-600/30 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-slate-100 mb-3 text-lg">Next Steps:</h5>
                  <ul className="space-y-2">
                    {path.nextSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-200">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Roadmap */}
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold text-slate-100 mb-8 flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span>Learning Roadmap</span>
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-slate-100 mb-4 text-xl flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-green-400" />
                  <span>Immediate Actions (This Week)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverySession.learningRoadmap.immediate.map((action, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="text-green-800 font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 mb-4 text-xl flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Short Term (1-3 Months)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverySession.learningRoadmap.shortTerm.map((action, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="text-blue-800 font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 mb-4 text-xl flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  <span>Long Term (6-12 Months)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverySession.learningRoadmap.longTerm.map((action, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="text-purple-800 font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          {/* Export functionality - creates a formatted text report that users can convert to PDF */}
                                                          <div className="flex flex-col items-center space-y-2">
              <button
                onClick={exportSession}
                className="btn-accent flex items-center space-x-3"
              >
                <Download className="h-5 w-5" />
                <span>Export Report</span>
              </button>
              <div className="text-center text-sm text-slate-400">
                Downloads as .txt file - open in Word/Google Docs to convert to PDF
              </div>
            </div>
            <button
              onClick={resetDiscovery}
              className="btn-secondary flex items-center space-x-3"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start New Discovery</span>
            </button>
        </div>
      </div>
    )
  }

  return null
}
