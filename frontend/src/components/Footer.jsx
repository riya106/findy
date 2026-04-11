import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  const links = [
    { to: '/listings', labelKey: 'nav.listings' },
    { to: '/vendors',  labelKey: 'nav.vendors'  },
    { to: '/workers',  labelKey: 'nav.workers'  },
    { to: '/around',   labelKey: 'nav.around'   },
  ]

  return (
    <footer style={{
      padding: '48px 40px',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginTop: 'auto',
      background: 'var(--surface)',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800, fontSize: 20,
        color: 'var(--mint)',
      }}>
        {t('appName')}
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {links.map(({ to, labelKey }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontSize: 13,
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--mint)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            {t(labelKey)}
          </Link>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
        {t('footer.copy')}
      </div>
    </footer>
  )
}