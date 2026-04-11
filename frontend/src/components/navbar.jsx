import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import LanguageToggle from './Languagetoggle'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Role-based nav links — labels from translation
  const explorerLinks = [
    { to: '/listings', labelKey: 'nav.listings' },
    { to: '/vendors',  labelKey: 'nav.vendors'  },
    { to: '/workers',  labelKey: 'nav.workers'  },
    { to: '/around',   labelKey: 'nav.around'   },
  ]

  const vendorLinks = [
    { to: '/vendor-dashboard', labelKey: 'nav.dashboard'    },
    { to: '/vendors',          labelKey: 'nav.liveVendors'  },
    { to: '/vendor-reviews',   labelKey: 'nav.reviews'      },
  ]

  const workerLinks = [
    { to: '/worker-dashboard', labelKey: 'nav.dashboard'    },
    { to: '/worker-register',  labelKey: 'nav.myProfile'    },
    { to: '/workers',          labelKey: 'nav.browseWorkers'},
  ]

  const getLinks = () => {
    if (!user) return []
    if (user.role === 'seller') return vendorLinks
    if (user.role === 'worker') return workerLinks
    return explorerLinks
  }

  const getRoleBadge = () => {
    if (user?.role === 'seller') return { label: t('profile.roles.vendor'),   color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' }
    if (user?.role === 'worker') return { label: t('profile.roles.worker'),   color: '#0369a1', bg: '#f0f9ff', border: '#7dd3fc' }
    return                              { label: t('profile.roles.explorer'), color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' }
  }

  const getHome = () => {
    if (user?.role === 'seller') return '/vendor-dashboard'
    if (user?.role === 'worker') return '/worker-dashboard'
    if (user) return '/listings'
    return '/'
  }

  const badge = getRoleBadge()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 32px', height: '68px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(var(--nav-bg-rgb, 255,255,255), 0.92)' : 'var(--nav-bg-transparent, rgba(255,255,255,0.7))',
      backdropFilter: 'blur(24px)',
      borderBottom: scrolled
        ? '1px solid rgba(16,185,129,0.15)'
        : '1px solid rgba(16,185,129,0.08)',
      boxShadow: scrolled ? '0 4px 24px rgba(16,185,129,0.08)' : 'none',
      transition: 'all 0.3s ease',
      gap: 12,
    }}>

      {/* ── Logo ── */}
      <Link to={getHome()} style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800, fontSize: 24,
        color: 'var(--mint)', textDecoration: 'none',
        letterSpacing: '-0.03em',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <span style={{
          width: 30, height: 30,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, color: '#fff', fontWeight: 800,
          boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
        }}>
          F
        </span>
        {t('appName')}
      </Link>

      {/* ── Nav Links ── */}
      <div style={{
        display: 'flex', gap: 2, alignItems: 'center',
        background: 'rgba(16,185,129,0.06)',
        padding: '4px', borderRadius: 100,
        border: '1px solid rgba(16,185,129,0.12)',
        overflow: 'auto', scrollbarWidth: 'none',
      }}>
        {getLinks().map(({ to, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              padding: '7px 18px',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'DM Sans, sans-serif',
              textDecoration: 'none',
              color: isActive ? '#fff' : 'var(--muted)',
              background: isActive
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'transparent',
              boxShadow: isActive ? '0 4px 12px rgba(16,185,129,0.35)' : 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            })}
          >
            {t(labelKey)}
          </NavLink>
        ))}
      </div>

      {/* ── Right: Theme + Language + User ── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Toggle */}
        <LanguageToggle />

        {user ? (
          <>
            {/* Role badge */}
            <span style={{
              fontSize: 11, fontWeight: 600,
              padding: '4px 12px', borderRadius: 100,
              background: badge.bg, color: badge.color,
              border: `1px solid ${badge.border}`,
              letterSpacing: '0.02em',
              fontFamily: 'DM Sans, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              {badge.label}
            </span>

            {/* Avatar */}
            <Link to="/profile" style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
              border: '2px solid var(--surface)',
              flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </Link>

            {/* Logout */}
            <button onClick={handleLogout} style={{
              fontSize: 13, fontWeight: 500,
              padding: '7px 16px', borderRadius: 100,
              border: '1.5px solid rgba(16,185,129,0.25)',
              background: 'transparent', color: 'var(--muted)',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {t('profile.signOut')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 20px', borderRadius: 100,
              fontSize: 14, fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              textDecoration: 'none', color: 'var(--mint)',
              border: '1.5px solid rgba(16,185,129,0.3)',
              background: 'transparent', transition: 'all 0.2s',
            }}>
              {t('nav.login')}
            </Link>
            <Link to="/signup" style={{
              padding: '8px 20px', borderRadius: 100,
              fontSize: 14, fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif',
              textDecoration: 'none', color: '#fff',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
              transition: 'all 0.2s',
            }}>
              {t('nav.signup')}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
