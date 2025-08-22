'use client'

import { useState } from 'react'
import { MessageSquare, Play, CheckCircle, Star, Loader2, ArrowRight, Brain, Target, Award, Clock, Users, Search } from 'lucide-react'

interface InterviewQuestion {
  question?: string
  mainQuestion?: string
  tips?: string[]
  category?: string
}

interface InterviewFeedback {
  score: number
  feedback: string
  improvements: string[]
}

interface MockInterviewResponse {
  questions: InterviewQuestion[]
  feedback: InterviewFeedback[]
  overallScore: number
  summary: string
}

export default function MockInterview() {
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [response, setResponse] = useState<MockInterviewResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Suggested job roles for inspiration (but users can type their own)
  const suggestedJobRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
    'UI/UX Designer',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Software Architect',
    'Content Creator',
    'QA Engineer',
    'System Administrator',
    'Network Engineer',
    'Cybersecurity Analyst'
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-900/20'
    if (score >= 60) return 'bg-amber-900/20'
    return 'bg-red-900/20'
  }

  const startInterview = async () => {
    if (!selectedRole.trim()) return
    
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch('https://careermate-backend-nzb0.onrender.com/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole.trim(), language: 'en' })
      })
      
      const text = await res.text()
      if (!res.ok) {
        let msg = 'Failed to start interview'
        try {
          const parsed = JSON.parse(text)
          msg = parsed?.error || msg
        } catch {}
        throw new Error(msg)
      }
      const data = JSON.parse(text)
      console.log('Interview response data:', data) // Debug log
      if (!data?.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Interview service returned no questions. Check API key and backend logs.')
      }
      setResponse(data)
      setInterviewStarted(true)
      setCurrentQuestion(0)
      setUserAnswers(new Array(data.questions.length).fill(''))
    } catch (error) {
      console.error('Error:', error)
      const message = (error as any)?.message || 'Something went wrong starting the interview'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSubmit = async (answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
    
    // Evaluate the answer with AI
    try {
      const currentQ = response?.questions[currentQuestion]
      if (currentQ && answer.trim()) {
        const evalResponse = await fetch('https://careermate-backend-nzb0.onrender.com/api/evaluate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQ.question || currentQ.mainQuestion,
            answer: answer.trim(),
            role: selectedRole,
            language: 'en'
          })
        })
        
        if (evalResponse.ok) {
          const feedback = await evalResponse.json()
          // Update the feedback for this question
          if (response) {
            const updatedResponse = { ...response }
            updatedResponse.feedback[currentQuestion] = feedback
            setResponse(updatedResponse)
          }
        }
      }
    } catch (error) {
      console.error('Failed to evaluate answer:', error)
    }
    
    if (currentQuestion < (response?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setInterviewComplete(true)
    }
  }

  const goBackToSelection = () => {
    setInterviewStarted(false)
    setInterviewComplete(false)
    setResponse(null)
    setCurrentQuestion(0)
    setUserAnswers([])
    setSelectedRole('')
    setErrorMessage(null)
  }

  if (!interviewStarted) {
    return (
      <div className="space-y-16">
        {/* Enhanced Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <MessageSquare className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-5xl font-bold gradient-text mb-6">AI Interview Practice</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Practice your interview skills with our AI-powered mock interviews. Answer questions in your own words to improve your interview performance.
            </p>
          </div>
        </div>

        {/* Enhanced Job Role Selection */}
        <div className="card max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-10">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-100">Enter Your Target Role</h3>
            </div>
            
            {/* Job Role Input */}
            <div className="mb-8">
              <label htmlFor="jobRole" className="block text-lg font-semibold text-slate-200 mb-4">
                What job role are you interviewing for?
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
                <input
                  id="jobRole"
                  type="text"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer, Data Scientist, Product Manager..."
                  className="input-field-large pl-12 text-lg"
                  required
                />
              </div>
            </div>

            {/* Suggested Roles for Inspiration */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-200 mb-4">Popular roles for inspiration:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestedJobRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 text-sm font-medium ${
                      selectedRole === role
                        ? 'border-blue-400 bg-blue-900/30 text-blue-300 shadow-lg'
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 text-slate-300 hover:text-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-600/30 bg-red-900/20 p-4 text-red-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={startInterview}
              disabled={!selectedRole.trim() || isLoading}
              className="btn-primary w-full py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Preparing Interview...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Play className="h-6 w-6" />
                  <span>Start AI Interview Practice</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (interviewComplete && response) {
    return (
      <div className="space-y-16 max-w-6xl mx-auto">
        {/* Enhanced Results Header */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-5xl font-bold gradient-text mb-6">Interview Complete!</h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className="text-xl text-slate-300">Overall Score:</span>
              <div className={`px-6 py-3 rounded-2xl ${getScoreBg(response.overallScore)} shadow-lg`}>
                <span className={`text-3xl font-bold ${getScoreColor(response.overallScore)}`}>
                  {response.overallScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Question-by-Question Feedback */}
        <div className="space-y-8">
          {response.questions.map((question, index) => (
            <div key={index} className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100 flex-1">
                    Question {index + 1}: {question.question || question.mainQuestion}
                  </h3>
                  <div className={`px-4 py-2 rounded-2xl ${getScoreBg(response.feedback[index].score)} shadow-md ml-4`}>
                    <span className={`font-bold text-lg ${getScoreColor(response.feedback[index].score)}`}>
                      {response.feedback[index].score}/10
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-100 mb-3 text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span>Your Answer:</span>
                  </h4>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-2xl p-4">
                    <p className="text-slate-200 text-lg">{userAnswers[index] || 'No answer provided'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-100 mb-3 text-lg flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span>Feedback:</span>
                  </h4>
                  <p className="text-slate-200 text-lg">{response.feedback[index].feedback}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 mb-3 text-lg flex items-center space-x-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span>Areas for Improvement:</span>
                  </h4>
                  <ul className="space-y-2">
                    {response.feedback[index].improvements.map((improvement, impIndex) => (
                      <li key={impIndex} className="flex items-start space-x-3 p-3 bg-amber-900/20 rounded-2xl border border-amber-600/30">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-200">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Summary */}
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-400" />
              <span>Interview Summary</span>
            </h3>
            <p className="text-slate-200 text-lg mb-6">{response.summary}</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={goBackToSelection}
                className="btn-secondary"
              >
                ← Back to Job Selection
              </button>
              <button
                onClick={() => {
                  setInterviewStarted(false)
                  setInterviewComplete(false)
                  setResponse(null)
                  setCurrentQuestion(0)
                  setUserAnswers([])
                }}
                className="btn-accent"
              >
                Practice Another Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!response) return null

  const currentQ = response.questions[currentQuestion]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Progress Bar */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBackToSelection}
                className="btn-secondary py-2 px-4 text-sm hover:scale-105 transition-all duration-300"
              >
                ← Back to Job Selection
              </button>
              <h3 className="text-xl font-bold text-slate-100">
                Question {currentQuestion + 1} of {response.questions.length}
              </h3>
            </div>
            <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              {Math.round(((currentQuestion + 1) / response.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / response.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enhanced Current Question */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="mb-8">
            {currentQ.category && (
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-2 bg-blue-900/30 text-blue-300 text-sm font-semibold rounded-full border border-blue-600/30">
                  {currentQ.category}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-100 mb-6">{currentQ.question || currentQ.mainQuestion}</h3>
            
            {currentQ.tips && currentQ.tips.length > 0 && (
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-2xl p-6 mb-8">
                <h4 className="font-semibold text-blue-300 mb-4 flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg">Pro Tips</span>
                </h4>
                <ul className="space-y-3">
                  {currentQ.tips.map((tip, index) => (
                    <li key={index} className="text-blue-200 text-lg flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Text Response Mode */}
          <div className="space-y-6">
            <label htmlFor="answer" className="block text-lg font-semibold text-slate-200">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={userAnswers[currentQuestion] || ''}
              onChange={(e) => {
                const newAnswers = [...userAnswers]
                newAnswers[currentQuestion] = e.target.value
                setUserAnswers(newAnswers)
              }}
              placeholder="Type your answer here..."
              className="input-field resize-none"
              rows={4}
              required
            />
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Question
              </button>
              <button
                onClick={goBackToSelection}
                className="btn-secondary hover:bg-red-700 hover:border-red-500"
              >
                ← Exit Interview
              </button>
              <button
                onClick={() => handleAnswerSubmit(userAnswers[currentQuestion] || '')}
                disabled={!userAnswers[currentQuestion]?.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === response.questions.length - 1 ? (
                  'Finish Interview'
                ) : (
                  <div className="flex items-center space-x-3">
                    <span>Next Question</span>
                    <ArrowRight className="h-5 w-5" />
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
