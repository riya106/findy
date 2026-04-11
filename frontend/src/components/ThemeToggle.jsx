import { useTheme } from '../context/ThemeContext'

/**
 * Animated sun / moon theme toggle pill.
 * Drop it anywhere — Navbar, Profile, Settings.
 */
export default function ThemeToggle({ style = {} }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: isDark ? '#1a2e25' : '#f0fdf8',
        border: `1px solid ${isDark ? 'rgba(45,212,170,0.25)' : 'rgba(15,184,146,0.2)'}`,
        borderRadius: 100,
        padding: '5px 14px 5px 8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      {/* Animated icon track */}
      <div style={{
        width: 32,
        height: 18,
        borderRadius: 100,
        background: isDark
          ? 'linear-gradient(135deg, #1e3a5f, #0f2940)'
          : 'linear-gradient(135deg, #fed7aa, #fbbf24)',
        position: 'relative',
        transition: 'background 0.4s ease',
        flexShrink: 0,
        border: `1px solid ${isDark ? 'rgba(99,179,237,0.2)' : 'rgba(245,158,11,0.3)'}`,
      }}>
        {/* sliding dot */}
        <div style={{
          position: 'absolute',
          top: 2,
          left: isDark ? 14 : 2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: isDark ? '#60a5fa' : '#f59e0b',
          transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
          boxShadow: isDark
            ? '0 0 6px rgba(96,165,250,0.6)'
            : '0 0 6px rgba(245,158,11,0.5)',
        }} />

        {/* Stars (dark) / rays (light) */}
        {isDark ? (
          <>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} />
            <div style={{ position: 'absolute', top: 7, left: 6, width: 1.5, height: 1.5, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          </>
        ) : null}
      </div>

      {/* Label */}
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: isDark ? '#60a5fa' : '#d97706',
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '0.02em',
        transition: 'color 0.3s',
        whiteSpace: 'nowrap',
      }}>
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </span>
    </button>
  )
}
