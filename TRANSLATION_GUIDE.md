# Translation System Guide

## Overview

The CareerMate application now includes a comprehensive translation system that supports over 100 languages, making it accessible to users worldwide. This system is designed to be lightweight, performant, and easy to maintain.

## Features

- **100+ Languages Supported**: Including major world languages, regional languages, and indigenous languages
- **Automatic Language Detection**: Detects user's browser language preference
- **Persistent Language Selection**: Remembers user's language choice
- **RTL Language Support**: Automatic right-to-left text direction for Arabic, Hebrew, Persian, and Urdu
- **Organized Language Groups**: Languages are grouped by region for easy selection
- **Fallback System**: Falls back to English if a translation is missing

## How It Works

### 1. Translation Context

The `TranslationContext` provides:
- Current language state
- Language switching functionality
- RTL text direction support
- Translation function

### 2. Language Selector Component

The `LanguageSelector` component:
- Displays current language with flag and name
- Groups languages by region (Popular, Europe, Asia, etc.)
- Provides searchable dropdown interface
- Automatically closes when clicking outside

### 3. Translation Data

Translations are stored in `translations.ts`:
- Organized by language code
- Includes all UI text elements
- Easy to add new languages
- Type-safe translation keys

## Adding New Languages

### Step 1: Add Language to SUPPORTED_LANGUAGES

```typescript
// In TranslationContext.tsx
export const SUPPORTED_LANGUAGES = {
  // ... existing languages
  'xx': { name: 'Language Name', flag: '🏳️', nativeName: 'Native Name' }
} as const
```

### Step 2: Add Translations

```typescript
// In translations.ts
export const TRANSLATIONS: Partial<Record<LanguageCode, Record<keyof typeof TRANSLATION_KEYS, string>>> = {
  // ... existing languages
  xx: {
    AI_CAREER_STORYTELLER: 'Translated Text',
    HEADER_DESCRIPTION: 'Translated Description',
    // ... add all translation keys
  }
}
```

### Step 3: Add to Language Groups

```typescript
// In LanguageSelector.tsx
const languageGroups = {
  'Popular': ['en', 'es', 'fr', 'de', 'xx'], // Add to appropriate group
  // ... other groups
}
```

## Using Translations in Components

### Basic Usage

```typescript
import { useTranslation } from './TranslationContext'
import { getTranslation } from './translations'

export default function MyComponent() {
  const { currentLanguage } = useTranslation()
  
  return (
    <h1>{getTranslation(currentLanguage, 'COMPONENT_TITLE')}</h1>
  )
}
```

### Adding New Translation Keys

1. Add the key to `TRANSLATION_KEYS`:
```typescript
export const TRANSLATION_KEYS = {
  // ... existing keys
  NEW_KEY: 'New Key Text'
} as const
```

2. Add translations for all supported languages:
```typescript
en: {
  // ... existing translations
  NEW_KEY: 'English Text'
},
es: {
  // ... existing translations
  NEW_KEY: 'Spanish Text'
}
// ... continue for all languages
```

## Language Groups

Languages are organized into logical groups:

- **Popular**: Most commonly used languages (English, Spanish, French, German, etc.)
- **Europe**: European languages (Dutch, Swedish, Polish, etc.)
- **Asia**: Asian languages (Thai, Vietnamese, Indonesian, etc.)
- **Africa & Middle East**: Arabic, Hebrew, Swahili, etc.
- **Americas**: Indigenous American languages
- **Oceania**: Pacific island languages
- **South Asia**: Indian subcontinent languages

## RTL Language Support

The system automatically handles right-to-left languages:
- Arabic (ar)
- Hebrew (he)
- Persian (fa)
- Urdu (ur)

When these languages are selected, the document direction automatically switches to RTL.

## Performance Considerations

- Translations are loaded statically (no API calls)
- Language switching is instant
- No additional bundle size for unused languages
- Efficient fallback system

## Future Enhancements

### 1. Dynamic Translation Loading
```typescript
// Load translations on demand
const loadTranslations = async (lang: LanguageCode) => {
  const translations = await import(`./translations/${lang}.json`)
  return translations
}
```

### 2. Translation API Integration
```typescript
// Integrate with free translation APIs
const translateText = async (text: string, targetLang: LanguageCode) => {
  // Use Google Translate API, LibreTranslate, or similar
}
```

### 3. User-Generated Translations
```typescript
// Allow community contributions
const submitTranslation = async (lang: LanguageCode, key: string, translation: string) => {
  // Submit to translation database
}
```

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Provide meaningful fallbacks** for missing translations
3. **Test with different languages** to ensure UI layout works
4. **Consider text length** - some languages are longer than English
5. **Use semantic keys** that describe the content, not the English text

## Troubleshooting

### Common Issues

1. **Translation not showing**: Check if the key exists in `TRANSLATION_KEYS`
2. **Language not switching**: Verify the language code is in `SUPPORTED_LANGUAGES`
3. **RTL not working**: Check if the language is in `RTL_LANGUAGES` array

### Debug Mode

Enable debug logging:
```typescript
const { currentLanguage, setLanguage } = useTranslation()
console.log('Current language:', currentLanguage)
console.log('Available languages:', Object.keys(SUPPORTED_LANGUAGES))
```

## Contributing

To add translations for a new language:

1. Fork the repository
2. Add the language to `SUPPORTED_LANGUAGES`
3. Add complete translations to `translations.ts`
4. Test the language switching
5. Submit a pull request

## Resources

- [Language Codes (ISO 639-1)](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [RTL Language Support](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [Internationalization Best Practices](https://www.w3.org/International/i18n-checklist/)
