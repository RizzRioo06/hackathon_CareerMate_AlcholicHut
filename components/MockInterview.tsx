'use client'

import { useState } from 'react'
import { MessageSquare, Play, CheckCircle, Star, Loader2, ArrowRight } from 'lucide-react'

interface InterviewQuestion {
  question: string
  tips: string[]
  category: string
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

  const jobRoles = [
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
    'Singer'
  ]

  const startInterview = async () => {
    if (!selectedRole) return
    
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
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

  const handleAnswerSubmit = (answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
    
    if (currentQuestion < (response?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setInterviewComplete(true)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-100'
    if (score >= 6) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (!interviewStarted) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mock Interview Practice</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with our AI-powered mock interviews. Select a job role and answer 
            5 questions to get personalized feedback and scoring.
          </p>
        </div>

        {/* Job Role Selection */}
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Target Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {jobRoles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedRole === role
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {errorMessage}
            </div>
          )}
          
          <button
            onClick={startInterview}
            disabled={!selectedRole || isLoading}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Preparing Interview...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Start Mock Interview</span>
              </div>
            )}
          </button>
        </div>
      </div>
    )
  }

  if (interviewComplete && response) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg text-gray-600">Overall Score:</span>
            <div className={`px-4 py-2 rounded-full ${getScoreBg(response.overallScore)}`}>
              <span className={`text-2xl font-bold ${getScoreColor(response.overallScore)}`}>
                {response.overallScore}/10
              </span>
            </div>
          </div>
        </div>

        {/* Question-by-Question Feedback */}
        <div className="space-y-6">
          {response.questions.map((question, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}: {question.question}
                </h3>
                <div className={`px-3 py-1 rounded-full ${getScoreBg(response.feedback[index].score)}`}>
                  <span className={`font-semibold ${getScoreColor(response.feedback[index].score)}`}>
                    {response.feedback[index].score}/10
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-700">{userAnswers[index] || 'No answer provided'}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                <p className="text-gray-700">{response.feedback[index].feedback}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement:</h4>
                <ul className="space-y-1">
                  {response.feedback[index].improvements.map((improvement, impIndex) => (
                    <li key={impIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Summary</h3>
          <p className="text-gray-700 mb-4">{response.summary}</p>
          
          <button
            onClick={() => {
              setInterviewStarted(false)
              setInterviewComplete(false)
              setResponse(null)
              setCurrentQuestion(0)
              setUserAnswers([])
            }}
            className="btn-primary"
          >
            Practice Another Interview
          </button>
        </div>
      </div>
    )
  }

  if (!response) return null

  const currentQ = response.questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestion + 1} of {response.questions.length}
          </h3>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestion + 1) / response.questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / response.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {currentQ.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentQ.question}</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Pro Tips</span>
            </h4>
            <ul className="space-y-1">
              {currentQ.tips.map((tip, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
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
            className="input-field h-32 resize-none"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handleAnswerSubmit(userAnswers[currentQuestion] || '')}
              disabled={!userAnswers[currentQuestion]?.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === response.questions.length - 1 ? (
                'Finish Interview'
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
