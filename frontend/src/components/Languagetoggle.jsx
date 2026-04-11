import { useLang } from '../context/LanguageContext'

export default function LanguageToggle({ style = {} }) {
  const { lang, setLang } = useLang()

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 100,
        padding: 3,
        gap: 2,
        transition: 'background 0.3s, border-color 0.3s',
        ...style,
      }}
      role="group"
      aria-label="Language selector"
    >
      {[
        { code: 'en', label: 'EN'    },
        { code: 'hi', label: 'हिंदी' },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          style={{
            background:   lang === code ? 'var(--mint)' : 'transparent',
            color:        lang === code ? '#fff' : 'var(--muted)',
            border:       'none',
            borderRadius: 100,
            padding:      '5px 13px',
            fontSize:     13,
            fontFamily:   code === 'hi'
              ? '"Noto Sans Devanagari", "DM Sans", sans-serif'
              : '"DM Sans", sans-serif',
            fontWeight:   lang === code ? 600 : 400,
            cursor:       'pointer',
            transition:   'background 0.2s, color 0.2s',
            lineHeight:   1.4,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
