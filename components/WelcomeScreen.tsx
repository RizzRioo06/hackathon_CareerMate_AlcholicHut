'use client'

import React from 'react'
import { UserPlus, LogIn, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onShowRegister: () => void
  onShowLogin: () => void
}

export default function WelcomeScreen({ onShowRegister, onShowLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 via-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/5 via-pink-400/5 to-rose-400/5 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-900/90 backdrop-blur-xl shadow-2xl border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg animate-pulse-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  CareerMate
                </h1>
                <p className="text-sm text-slate-400 font-medium">AI Career & Interview Mentor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8 animate-bounce-in">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Welcome to Your Career Journey
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Get personalized career guidance, practice interviews with AI, and discover job opportunities tailored just for you.
          </p>
        </div>



        {/* Action Buttons */}
        <div className="space-y-6 max-w-lg mx-auto">
          <button
            onClick={onShowRegister}
            className="w-full flex items-center justify-center space-x-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-xl border-0"
          >
            <UserPlus className="h-7 w-7" />
            <span>Create Your Account</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center space-x-4 text-slate-400 text-sm">
              <div className="w-8 h-px bg-slate-600"></div>
              <span>or</span>
              <div className="w-8 h-px bg-slate-600"></div>
            </div>
          </div>

          <button
            onClick={onShowLogin}
            className="w-full flex items-center justify-center space-x-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white font-semibold py-5 px-8 rounded-2xl border border-slate-600/30 shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            <LogIn className="h-6 w-6" />
            <span>Sign In</span>
          </button>
        </div>


      </main>
    </div>
  )
}
