'use client'

import { useState } from 'react'
import { Crown, Star, Zap, X } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  // Mock usage data for showcase
  const usageData = {
    careerGuidance: { used: 2, limit: 3 },
    mockInterviews: { used: 1, limit: 1 },
    jobSuggestions: { used: 3, limit: 5 }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
            <p className="text-slate-400">Manage your subscription and usage</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Usage */}
        <div className="bg-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Current Usage (Free Tier)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Career Guidance</span>
                <span className="text-white font-semibold">{usageData.careerGuidance.used}/{usageData.careerGuidance.limit}</span>
              </div>
              <div className="w-full bg-slate-500 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usageData.careerGuidance.used / usageData.careerGuidance.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Mock Interviews</span>
                <span className="text-white font-semibold">{usageData.mockInterviews.used}/{usageData.mockInterviews.limit}</span>
              </div>
              <div className="w-full bg-slate-500 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usageData.mockInterviews.used / usageData.mockInterviews.limit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Job Suggestions</span>
                <span className="text-white font-semibold">{usageData.jobSuggestions.used}/{usageData.jobSuggestions.limit}</span>
              </div>
              <div className="w-full bg-slate-500 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usageData.jobSuggestions.used / usageData.jobSuggestions.limit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <p className="text-3xl font-bold text-white">$0</p>
              <p className="text-slate-400 text-sm">Forever</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                3 Career Guidance sessions
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                1 Mock Interview
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                5 Job Suggestions
              </li>
            </ul>
            <button className="w-full py-3 px-6 bg-slate-600 text-white rounded-xl cursor-not-allowed opacity-50 font-semibold">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                POPULAR
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <p className="text-3xl font-bold text-white">$19</p>
              <p className="text-slate-400 text-sm">per month</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Unlimited Career Guidance
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                10 Mock Interviews
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Advanced Job Matching
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Priority Support
              </li>
            </ul>
            <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-semibold">
              Upgrade to Pro
            </button>
          </div>

          {/* Team Tier */}
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Team</h3>
              <p className="text-3xl font-bold text-white">$49</p>
              <p className="text-slate-400 text-sm">per month</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Everything in Pro
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Up to 5 team members
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Team collaboration
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Advanced analytics
              </li>
            </ul>
            <button className="w-full py-3 px-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold">
              Get Team Plan
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Enterprise</h3>
              <p className="text-3xl font-bold text-white">Custom</p>
              <p className="text-slate-400 text-sm">Contact us</p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Unlimited everything
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                White-label options
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                API access
              </li>
              <li className="flex items-center text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Dedicated support
              </li>
            </ul>
            <button className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
