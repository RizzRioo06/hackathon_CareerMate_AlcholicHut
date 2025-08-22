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
  ar: { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  hi: { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  tr: { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  nl: { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  sv: { name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  da: { name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  no: { name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  fi: { name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  pl: { name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  cs: { name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
  hu: { name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },
  ro: { name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
  bg: { name: 'Bulgarian', flag: '🇧🇬', nativeName: 'Български' },
  hr: { name: 'Croatian', flag: '🇭🇷', nativeName: 'Hrvatski' },
  sk: { name: 'Slovak', flag: '🇸🇰', nativeName: 'Slovenčina' },
  sl: { name: 'Slovenian', flag: '🇸🇮', nativeName: 'Slovenščina' },
  et: { name: 'Estonian', flag: '🇪🇪', nativeName: 'Eesti' },
  lv: { name: 'Latvian', flag: '🇱🇻', nativeName: 'Latviešu' },
  lt: { name: 'Lithuanian', flag: '🇱🇹', nativeName: 'Lietuvių' },
  uk: { name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська' },
  be: { name: 'Belarusian', flag: '🇧🇾', nativeName: 'Беларуская' },
  mk: { name: 'Macedonian', flag: '🇲🇰', nativeName: 'Македонски' },
  sr: { name: 'Serbian', flag: '🇷🇸', nativeName: 'Српски' },
  bs: { name: 'Bosnian', flag: '🇧🇦', nativeName: 'Bosanski' },
  me: { name: 'Montenegrin', flag: '🇲🇪', nativeName: 'Crnogorski' },
  sq: { name: 'Albanian', flag: '🇦🇱', nativeName: 'Shqip' },
  el: { name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
  mt: { name: 'Maltese', flag: '🇲🇹', nativeName: 'Malti' },
  ga: { name: 'Irish', flag: '🇮🇪', nativeName: 'Gaeilge' },
  cy: { name: 'Welsh', flag: '🇬🇧', nativeName: 'Cymraeg' },
  gd: { name: 'Scottish Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', nativeName: 'Gàidhlig' },
  is: { name: 'Icelandic', flag: '🇮🇸', nativeName: 'Íslenska' },
  fo: { name: 'Faroese', flag: '🇫🇴', nativeName: 'Føroyskt' },
  kl: { name: 'Greenlandic', flag: '🇬🇱', nativeName: 'Kalaallisut' },
  se: { name: 'Northern Sami', flag: '🇳🇴', nativeName: 'Davvisámegiella' },
  sm: { name: 'Samoan', flag: '🇼🇸', nativeName: 'Gagana Samoa' },
  to: { name: 'Tongan', flag: '🇹🇴', nativeName: 'Lea faka-Tonga' },
  fj: { name: 'Fijian', flag: '🇫🇯', nativeName: 'Vosa Vakaviti' },
  mi: { name: 'Maori', flag: '🇳🇿', nativeName: 'Te Reo Māori' },
  haw: { name: 'Hawaiian', flag: '🇺🇸', nativeName: 'ʻŌlelo Hawaiʻi' },
  qu: { name: 'Quechua', flag: '🇵🇪', nativeName: 'Runa Simi' },
  gn: { name: 'Guarani', flag: '🇵🇾', nativeName: 'Avañe\'ẽ' },
  ay: { name: 'Aymara', flag: '🇧🇴', nativeName: 'Aymar aru' },
  st: { name: 'Southern Sotho', flag: '🇱🇸', nativeName: 'Sesotho' },
  zu: { name: 'Zulu', flag: '🇿🇦', nativeName: 'IsiZulu' },
  xh: { name: 'Xhosa', flag: '🇿🇦', nativeName: 'IsiXhosa' },
  af: { name: 'Afrikaans', flag: '🇿🇦', nativeName: 'Afrikaans' },
  sw: { name: 'Swahili', flag: '🇹🇿', nativeName: 'Kiswahili' },
  am: { name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
  ha: { name: 'Hausa', flag: '🇳🇬', nativeName: 'Hausa' },
  ig: { name: 'Igbo', flag: '🇳🇬', nativeName: 'Igbo' },
  yo: { name: 'Yoruba', flag: '🇳🇬', nativeName: 'Yorùbá' },
  so: { name: 'Somali', flag: '🇸🇴', nativeName: 'Soomaali' },
  om: { name: 'Oromo', flag: '🇪🇹', nativeName: 'Afaan Oromoo' },
  ti: { name: 'Tigrinya', flag: '🇪🇷', nativeName: 'ትግርኛ' },
  he: { name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  fa: { name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی' },
  ur: { name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  bn: { name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
  ta: { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  ml: { name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  kn: { name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  gu: { name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  pa: { name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  mr: { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  or: { name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ' },
  as: { name: 'Assamese', flag: '🇮🇳', nativeName: 'অসমীয়া' },
  ne: { name: 'Nepali', flag: '🇳🇵', nativeName: 'नेपाली' },
  si: { name: 'Sinhala', flag: '🇱🇰', nativeName: 'සිංහල' },
  my: { name: 'Burmese', flag: '🇲🇲', nativeName: 'မြန်မာဘာသာ' },
  km: { name: 'Khmer', flag: '🇰🇭', nativeName: 'ខ្មែរ' },
  lo: { name: 'Lao', flag: '🇱🇦', nativeName: 'ລາວ' },
  th: { name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  id: { name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  ms: { name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
  tl: { name: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino' },
  jv: { name: 'Javanese', flag: '🇮🇩', nativeName: 'Basa Jawa' },
  su: { name: 'Sundanese', flag: '🇮🇩', nativeName: 'Basa Sunda' },
  min: { name: 'Minangkabau', flag: '🇮🇩', nativeName: 'Baso Minangkabau' },
  ace: { name: 'Acehnese', flag: '🇮🇩', nativeName: 'Bahasa Acèh' },
  ban: { name: 'Balinese', flag: '🇮🇩', nativeName: 'Basa Bali' },
  bug: { name: 'Buginese', flag: '🇮🇩', nativeName: 'Basa Ugi' },
  mad: { name: 'Madurese', flag: '🇮🇩', nativeName: 'Basa Madura' },
  sun: { name: 'Sundanese', flag: '🇮🇩', nativeName: 'Basa Sunda' },
  ceb: { name: 'Cebuano', flag: '🇵🇭', nativeName: 'Binisaya' },
  ilo: { name: 'Ilocano', flag: '🇵🇭', nativeName: 'Ilokano' },
  war: { name: 'Waray', flag: '🇵🇭', nativeName: 'Winaray' },
  hil: { name: 'Hiligaynon', flag: '🇵🇭', nativeName: 'Ilonggo' },
  kap: { name: 'Kapampangan', flag: '🇵🇭', nativeName: 'Kapampangan' },
  pam: { name: 'Pampangan', flag: '🇵🇭', nativeName: 'Kapampangan' },
  bcl: { name: 'Bicolano', flag: '🇵🇭', nativeName: 'Bikol' },
  bik: { name: 'Bikol', flag: '🇵🇭', nativeName: 'Bikol' },
  pag: { name: 'Pangasinan', flag: '🇵🇭', nativeName: 'Salitan Pangasinan' },
  iba: { name: 'Iban', flag: '🇲🇾', nativeName: 'Jaku Iban' },
  kac: { name: 'Jingpho', flag: '🇲🇲', nativeName: 'Jinghpaw' },
  shn: { name: 'Shan', flag: '🇲🇲', nativeName: 'လိၵ်ႈတႆး' },
  kha: { name: 'Khasi', flag: '🇮🇳', nativeName: 'Ka Ktien Khasi' },
  mni: { name: 'Manipuri', flag: '🇮🇳', nativeName: 'মৈতৈলোন্' },
  sat: { name: 'Santali', flag: '🇮🇳', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  kok: { name: 'Konkani', flag: '🇮🇳', nativeName: 'कोंकणी' },
  sck: { name: 'Sadri', flag: '🇮🇳', nativeName: 'सादरी' },
  brx: { name: 'Bodo', flag: '🇮🇳', nativeName: 'बड़ो' },
  doi: { name: 'Dogri', flag: '🇮🇳', nativeName: 'डोगरी' }
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

interface TranslationContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string, fallback?: string) => string
  isRTL: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

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
