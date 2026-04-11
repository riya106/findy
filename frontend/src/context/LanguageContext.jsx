import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('findy_lang') || 'en'
  )

  // Apply lang attribute on mount too
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  const setLang = useCallback((l) => {
    setLangState(l)
    localStorage.setItem('findy_lang', l)
    document.documentElement.setAttribute('data-lang', l)
  }, [])

  const t = useCallback((path, key) => {
    const parts = path.split('.')
    let node = translations[lang]
    for (const p of parts) {
      if (node == null) return path
      node = node[p]
    }
    if (key !== undefined) return node?.[key] ?? path
    return node ?? path
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLang must be used within LanguageProvider")
  }
  return context
}
