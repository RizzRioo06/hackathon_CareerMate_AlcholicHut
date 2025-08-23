'use client'

import React from 'react'
import { UserPlus, LogIn, User, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onShowRegister: () => void
  onShowLogin: () => void
  onContinueAsGuest: () => void
}

export default function WelcomeScreen({ onShowRegister, onShowLogin, onContinueAsGuest }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-900/90 backdrop-blur-xl shadow-2xl border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center h-24">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-xl shadow-lg animate-pulse-glow">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  CareerMate
                </h1>
                <p className="text-base text-slate-300 font-medium mt-1">AI Career & Interview Mentor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Your Career Journey
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get personalized career guidance, practice interviews with AI, and discover job opportunities tailored just for you.
          </p>
        </div>



        {/* Action Buttons */}
        <div className="space-y-6 max-w-md mx-auto">
          <button
            onClick={onShowRegister}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <UserPlus className="h-6 w-6" />
            <span className="text-lg">Create Your Account</span>
          </button>

          <button
            onClick={onShowLogin}
            className="w-full flex items-center justify-center space-x-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-4 px-6 rounded-2xl border border-slate-600/30 shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <LogIn className="h-6 w-6" />
            <span className="text-lg">Sign In</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-950 text-slate-400">or</span>
            </div>
          </div>

          <button
            onClick={onContinueAsGuest}
            className="w-full flex items-center justify-center space-x-3 bg-slate-800/30 hover:bg-slate-700/30 text-slate-300 hover:text-white font-medium py-3 px-6 rounded-xl border border-slate-600/20 transition-all duration-200"
          >
            <User className="h-5 w-5" />
            <span>Continue as Guest</span>
          </button>
        </div>


      </main>
    </div>
  )
}
