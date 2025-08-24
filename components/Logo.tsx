import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

export default function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Planet Logo */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Planet */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 relative overflow-hidden">
          {/* Stars inside planet */}
          <div className="absolute inset-0">
            <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-4 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="absolute top-8 left-5 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-10 left-3 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-12 left-7 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-14 left-4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-16 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-18 left-2 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-20 left-5 w-0.5 h-0.5 bg-white rounded-full"></div>
            
            {/* Sparkle stars */}
            <div className="absolute top-3 left-4 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute top-7 left-7 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute top-11 left-4 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute top-15 left-6 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 rounded-full transform rotate-12 relative">
            {/* Ring sparkles */}
            <div className="absolute -top-1 left-1/4 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute -top-1 left-3/4 w-1 h-1 bg-white transform rotate-45">
              <div className="w-full h-0.5 bg-white absolute top-1/2 left-0 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full bg-white absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Surrounding Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left stars */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute -top-4 -left-6 w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -top-6 -left-3 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Top-right stars */}
        <div className="absolute -top-3 -right-4 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute -top-5 -right-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        
        {/* Bottom-right stars */}
        <div className="absolute -bottom-2 -right-3 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute -bottom-4 -right-6 w-1 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
      </div>

      {/* Text */}
      {showText && (
        <div>
          <h1 className={`font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent ${textSizes[size]}`}>
            CosmicCraft
          </h1>
          <p className="text-xs text-slate-400 font-medium">AI Career Navigator</p>
        </div>
      )}
    </div>
  )
}
