'use client'

import { useState } from 'react'
import { Brain, Lightbulb, Target, CheckCircle } from 'lucide-react'

interface PersonalitySnapshotProps {
  onComplete: (results: any) => void
}

export default function PersonalitySnapshot({ onComplete }: PersonalitySnapshotProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const questions = [
    {
      id: 1,
      question: "When working on a project, I prefer to...",
      options: [
        { value: "A", label: "Plan everything first", icon: Target },
        { value: "B", label: "Start and figure it out as I go", icon: Lightbulb },
        { value: "C", label: "Work with others to brainstorm", icon: Brain }
      ]
    },
    {
      id: 2,
      question: "I'm most comfortable in...",
      options: [
        { value: "A", label: "Quiet, focused environments", icon: Target },
        { value: "B", label: "Dynamic, changing situations", icon: Lightbulb },
        { value: "C", label: "Collaborative, social settings", icon: Brain }
      ]
    },
    {
      id: 3,
      question: "I learn best by...",
      options: [
        { value: "A", label: "Reading and studying", icon: Target },
        { value: "B", label: "Doing and experimenting", icon: Lightbulb },
        { value: "C", label: "Discussing with others", icon: Brain }
      ]
    }
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      analyzePersonality(newAnswers)
    }
  }

  const analyzePersonality = async (userAnswers: string[]) => {
    setIsAnalyzing(true)
    
    try {
      const prompt = `Based on these personality answers: ${userAnswers.join(', ')}
      
      Give a simple personality insight and 3 career recommendations.
      Format your response as JSON:
      {
        "insight": "Brief personality description",
        "careers": ["Career 1", "Career 2", "Career 3"],
        "workStyle": "Brief work style description",
        "learningStyle": "Brief learning style description"
      }
      
      Keep it short, practical, and career-focused.`

      const response = await fetch('/api/analyze-personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: userAnswers, prompt })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        onComplete(data)
      } else {
        // Fallback to mock data if API fails
        const mockResults = {
          insight: "You're analytical and methodical in your approach to work.",
          careers: ["Data Analysis", "Engineering", "Research"],
          workStyle: "You prefer structured environments and planning ahead.",
          learningStyle: "You learn best through systematic study and analysis."
        }
        setResults(mockResults)
        onComplete(mockResults)
      }
    } catch (error) {
      // Fallback to mock data
      const mockResults = {
        insight: "You're analytical and methodical in your approach to work.",
        careers: ["Data Analysis", "Engineering", "Research"],
        workStyle: "You prefer structured environments and planning ahead.",
        learningStyle: "You learn best through systematic study and analysis."
      }
      setResults(mockResults)
      onComplete(mockResults)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResults(null)
  }

  if (results) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Personality Snapshot</h2>
          <p className="text-slate-400">AI-powered career insights based on your preferences</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
              Personality Insight
            </h3>
            <p className="text-slate-300">{results.insight}</p>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Target className="h-5 w-5 text-blue-400 mr-2" />
              Recommended Careers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {results.careers.map((career: string, index: number) => (
                <div key={index} className="bg-slate-600/50 rounded-lg p-3 text-center">
                  <span className="text-white font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">Work Style</h4>
              <p className="text-slate-300 text-sm">{results.workStyle}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">Learning Style</h4>
              <p className="text-slate-300 text-sm">{results.learningStyle}</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={resetAssessment}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors font-medium"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Analyzing Your Personality...</h2>
        <p className="text-slate-400">AI is processing your answers and generating insights</p>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Quick Personality Snapshot</h2>
        <p className="text-slate-400">Answer 3 simple questions to get AI-powered career insights</p>
        
        <div className="flex justify-center mt-4 space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentQuestion ? 'bg-indigo-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">{currentQ.question}</h3>
          
          <div className="space-y-4">
            {currentQ.options.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-600 group-hover:bg-slate-500 rounded-lg flex items-center justify-center transition-colors">
                      <Icon className="h-6 w-6 text-slate-300" />
                    </div>
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="text-center text-slate-400 text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  )
}
