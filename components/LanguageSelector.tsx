'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from './TranslationContext'

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Group languages by region for better organization
  const languageGroups: Record<string, LanguageCode[]> = {
    'Popular': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'my']
  }

  const handleLanguageSelect = (lang: LanguageCode) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 text-slate-200 hover:text-white transition-all duration-200"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:block">{SUPPORTED_LANGUAGES[currentLanguage].flag}</span>
        <span className="hidden md:block">{SUPPORTED_LANGUAGES[currentLanguage].name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-slate-900 border border-slate-600/30 rounded-2xl shadow-2xl z-50">
          <div className="p-4">
            <div className="text-sm font-semibold text-slate-400 mb-3 px-2">Select Language</div>
            
            {Object.entries(languageGroups).map(([groupName, languages]) => (
              <div key={groupName} className="mb-4">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {groupName}
                </div>
                <div className="space-y-1">
                  {languages.map((lang) => {
                    const language = SUPPORTED_LANGUAGES[lang]
                    const isSelected = lang === currentLanguage
                    
                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30' 
                            : 'hover:bg-slate-800/50 text-slate-200 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{language.name}</div>
                          <div className="text-xs text-slate-400 truncate">{language.nativeName}</div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
