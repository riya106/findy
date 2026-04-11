import { useAddress } from '../hooks/useAddress'
import { useLang } from '../context/LanguageContext'

export default function VendorCard({ vendor, delay = 0 }) {
  const address = useAddress(vendor.location?.lat, vendor.location?.lng)
  const { t } = useLang()

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transitionDelay: `${delay}s`,
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
        transition: 'all 0.2s',
        marginBottom: 12,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'var(--mint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
        background: 'var(--gradient-hero)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
      }}>
        🏪
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700, fontSize: 15, marginBottom: 4,
          color: 'var(--ink)',
        }}>
          {vendor.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
          {vendor.shopType}
        </div>
        <div style={{ fontSize: 12, color: 'var(--mint)', fontWeight: 500 }}>
          📍 {address}
        </div>
      </div>

      {/* Live / Offline badge */}
      <div style={{ flexShrink: 0 }}>
        {vendor.isLive ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--mint-soft)',
            color: 'var(--mint-dark)',
            padding: '6px 14px', borderRadius: 100,
            fontSize: 12, fontWeight: 600,
            border: '1px solid var(--border)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--mint)', display: 'inline-block',
            }} />
            {t('live')}
          </span>
        ) : (
          <span style={{
            fontSize: 12, color: 'var(--muted)',
            background: 'var(--surface-2)',
            padding: '6px 14px', borderRadius: 100,
            border: '1px solid var(--border)',
          }}>
            {t('offline')}
          </span>
        )}
      </div>
    </div>
  )
}