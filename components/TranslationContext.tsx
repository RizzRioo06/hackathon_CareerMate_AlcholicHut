'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Supported languages with their display names
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  it: { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  pt: { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  ja: { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  zh: { name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  my: { name: 'Burmese', flag: '🇲🇲', nativeName: 'မြန်မာဘာသာ' }
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

interface TranslationContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string, fallback?: string) => string
  isRTL: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// RTL languages (none of the current supported languages are RTL)
const RTL_LANGUAGES: string[] = []

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as LanguageCode
      if (SUPPORTED_LANGUAGES[browserLang]) {
        setCurrentLanguage(browserLang)
      }
    }
  }, [])

  // Save language preference to localStorage
  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang)
    localStorage.setItem('preferred-language', lang)
    // Update document direction for RTL languages
    document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
  }

  // Simple translation function - you can enhance this with actual translation data
  const t = (key: string, fallback?: string): string => {
    // For now, return the fallback or key
    // In a real implementation, you'd load translation files or use an API
    return fallback || key
  }

  const isRTL = RTL_LANGUAGES.includes(currentLanguage)

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      isRTL
    }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
