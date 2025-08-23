'use client'

import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

interface AuthProps {
  mode?: 'login' | 'register'
}

export default function Auth({ mode = 'login' }: AuthProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login')

  return (
    <div>
      <div className="text-center mb-8">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <span>← Back to Welcome</span>
        </button>
      </div>
      
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}
