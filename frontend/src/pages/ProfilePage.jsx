import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { useEffect, useState } from "react"
import { listingsAPI } from "../services/api"
import ThemeToggle from '../components/ThemeToggle'
import LanguageToggle from '../components/Languagetoggle'

const ROLE_BADGE_EN = {
  explorer: { bg: '#e0f2fe', color: '#0369a1', label: 'Explorer' },
  vendor:   { bg: '#fef3c7', color: '#92400e', label: 'Vendor' },
  worker:   { bg: '#ccfbec', color: '#065f46', label: 'Worker' },
}

const ROLE_BADGE_HI = {
  explorer: { bg: '#e0f2fe', color: '#0369a1', label: 'खोजकर्ता' },
  vendor:   { bg: '#fef3c7', color: '#92400e', label: 'विक्रेता' },
  worker:   { bg: '#ccfbec', color: '#065f46', label: 'कर्मचारी' },
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [listingsCount, setListingsCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  const ROLE_BADGE = lang === 'hi' ? ROLE_BADGE_HI : ROLE_BADGE_EN

  useEffect(() => {
    listingsAPI.getAll().then((res) => {
      const items = res.data?.data || []
      setListingsCount(items.length)
    })
  }, [])

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)'
      }}>
        <Link to="/login" className="btn-primary">{t('profile.signIn')}</Link>
      </div>
    )
  }

  const badge = ROLE_BADGE[user.role] ?? ROLE_BADGE.explorer

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { label: t('profile.myListings'), value: `${listingsCount} ${t('profile.listings')}`, to: '/listings', icon: '📋' },
    { label: t('profile.savedPlaces'), value: `${savedCount} ${t('profile.saved')}`, to: '/around', icon: '❤️' },
    ...(user.role === "vendor"
      ? [{ label: t('profile.vendorDash'), value: t('profile.manageShop'), to: '/vendor-dashboard', icon: '🏪' }]
      : []),
    ...(user.role === "worker"
      ? [{ label: t('profile.vendorDash'), value: t('profile.manageShop'), to: '/worker-dashboard', icon: '👷' }]
      : []),
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--gradient-hero)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800, margin: '0 auto 20px',
            boxShadow: 'var(--shadow)'
          }}>
            {user.name?.[0]?.toUpperCase()}
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 28,
            marginBottom: 8, color: 'var(--ink)'
          }}>
            {user.name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
            {user.email}
          </p>

          <span style={{
            background: badge.bg,
            color: badge.color,
            padding: '6px 18px',
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-block'
          }}>
            {badge.label}
          </span>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '0 20px 20px' }}>
          {menuItems.map(({ icon, label, value, to }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{
                padding: '18px 20px',
                marginBottom: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{label}</span>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{value || '→'}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Settings Section */}
        <div style={{ padding: '0 20px 20px' }}>
          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600, fontSize: 16,
            marginBottom: 16, color: 'var(--ink)'
          }}>
            {t('profile.settings')}
          </h3>
          
          <div className="card" style={{
            padding: '18px 20px',
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🎨</span>
              <span style={{ color: 'var(--ink)' }}>{t('profile.appearance')}</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="card" style={{
            padding: '18px 20px',
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🌐</span>
              <span style={{ color: 'var(--ink)' }}>{t('profile.language')}</span>
            </div>
            <LanguageToggle />
          </div>

          <button 
            onClick={handleLogout} 
            className="btn-danger"
            style={{ width: '100%', marginTop: 20 }}
          >
            {t('profile.signOut')}
          </button>
        </div>
      </div>
    </div>
  )
}