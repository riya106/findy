import { useAddress } from '../hooks/useAddress'
import { useLang } from '../context/LanguageContext'

const PROFESSION_EMOJI = {
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Carpenter': '🪚',
  'Painter': '🎨',
  'Mechanic': '🔩',
  'Cleaner': '🧹',
  'Mason': '🧱',
  'Welder': '🔥',
  'AC Technician': '❄️',
  'Other': '👷',
  // Hindi mappings
  'इलेक्ट्रीशियन': '⚡',
  'प्लम्बर': '🔧',
  'बढ़ई': '🪚',
  'पेंटर': '🎨',
  'मैकेनिक': '🔩',
  'सफाईकर्मी': '🧹',
  'राजमिस्त्री': '🧱',
  'वेल्डर': '🔥',
  'AC तकनीशियन': '❄️',
  'अन्य': '👷',
}

export default function WorkerCard({ worker, delay = 0 }) {
  const emoji = PROFESSION_EMOJI[worker.profession] || '👷'
  const address = useAddress(worker.location?.lat, worker.location?.lng)
  const { t, lang } = useLang()

  // Format experience text based on language
  const experienceText = lang === 'hi' 
    ? `${worker.experience} साल`
    : `${worker.experience} yrs`

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
        marginBottom: 14,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'var(--mint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--gradient-hero)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, color: '#fff', flexShrink: 0,
      }}>
        {emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 700, fontSize: 16, marginBottom: 3, 
          color: 'var(--ink)' 
        }}>
          {worker.name}
        </div>
        <div style={{ 
          fontSize: 13, color: 'var(--muted)', marginBottom: 5 
        }}>
          {worker.profession} • {experienceText}
        </div>
        <div style={{ 
          fontSize: 12, color: 'var(--mint)', fontWeight: 500 
        }}>
          📍 {address}
        </div>
      </div>

      {/* Rating + Hire */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {worker.rating && (
          <div style={{ 
            fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 8 
          }}>
            ⭐ {worker.rating}
          </div>
        )}
        <button style={{
          padding: '8px 18px', borderRadius: 999,
          border: 'none', background: 'var(--mint)',
          color: '#fff', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
        }}
          onMouseEnter={e => { 
            e.target.style.background = 'var(--mint-dark)'; 
            e.target.style.transform = 'scale(1.05)' 
          }}
          onMouseLeave={e => { 
            e.target.style.background = 'var(--mint)'; 
            e.target.style.transform = 'scale(1)' 
          }}
        >
          {t('hire')}
        </button>
      </div>
    </div>
  )
}