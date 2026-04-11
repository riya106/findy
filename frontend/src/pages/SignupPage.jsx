import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { authAPI } from '../services/api'

const ROLES_EN = [
  { value: 'explorer', label: '🗺️ Explorer — browse & discover', desc: 'Find local services & shops' },
  { value: 'seller',   label: '🏪 Vendor — list your shop',      desc: 'Sell products & go live' },
  { value: 'worker',   label: '👷 Worker — offer your skills',   desc: 'Get hired for local work' },
]

const ROLES_HI = [
  { value: 'explorer', label: '🗺️ खोजकर्ता — ब्राउज़ करें', desc: 'स्थानीय सेवाएं खोजें' },
  { value: 'seller',   label: '🏪 विक्रेता — दुकान लिस्ट करें', desc: 'उत्पाद बेचें' },
  { value: 'worker',   label: '👷 कर्मचारी — कौशल दिखाएं', desc: 'काम पाएं' },
]

export default function SignupPage() {
  const { login } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const ROLES = lang === 'hi' ? ROLES_HI : ROLES_EN

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'explorer'
  })

  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('asking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { requestLocation() }, [])

  const requestLocation = () => {
    setLocationStatus('asking')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('granted')
      },
      () => setLocationStatus('denied')
    )
  }

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const redirectByRole = (role) => {
    if (role === 'seller') navigate('/vendor-dashboard')
    else if (role === 'worker') navigate('/worker-dashboard')
    else navigate('/listings')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError(t('auth.errorFill'))
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        ...(coords && { location: { latitude: coords.lat, longitude: coords.lng } })
      }
      const { data } = await authAPI.register(payload)
      if (!data.user || !data.token) {
        setError(data.message || t('auth.registerFailed'))
        setLoading(false)
        return
      }
      login(data.user, data.token)
      redirectByRole(data.user.role)
    } catch (err) {
      setError(err.response?.data?.message ?? t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: t('auth.fullName'), type: 'text', placeholder: t('auth.namePlaceholder') },
    { name: 'email', label: t('auth.email'), type: 'email', placeholder: 'you@email.com' },
    { name: 'phone', label: t('auth.phone'), type: 'tel', placeholder: '9876543210' },
    { name: 'password', label: t('auth.password'), type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            gap: 10, marginBottom: 16
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--gradient-hero)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#fff', fontWeight: 800,
              fontFamily: 'Syne, sans-serif'
            }}>F</div>
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800, fontSize: 28, color: 'var(--mint)'
            }}>
              {t('appName')}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 26, marginBottom: 8,
            color: 'var(--ink)'
          }}>
            {t('auth.createAccount')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {t('auth.joinSub')}
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          borderRadius: 28, padding: 36,
        }}>
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 20,
              fontSize: 13, fontWeight: 500,
              background: '#fef2f2', color: '#dc2626',
              border: '1px solid #fca5a5'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Location Banner */}
          <div style={{
            marginBottom: 24, padding: '12px 16px',
            borderRadius: 12, fontSize: 13,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            background: locationStatus === 'granted' ? 'var(--mint-soft)'
              : locationStatus === 'denied' ? '#fef2f2' : '#fffbeb',
            border: `1px solid ${locationStatus === 'granted' ? 'var(--border)'
              : locationStatus === 'denied' ? '#fca5a5' : '#fde68a'}`
          }}>
            <span style={{
              color: locationStatus === 'granted' ? 'var(--mint)'
                : locationStatus === 'denied' ? '#dc2626' : '#92400e',
              fontWeight: 500
            }}>
              {locationStatus === 'granted' && `✅ ${lang === 'hi' ? 'लोकेशन कैप्चर हुई' : 'Location captured'}`}
              {locationStatus === 'denied' && `❌ ${lang === 'hi' ? 'लोकेशन अस्वीकृत' : 'Location denied'}`}
              {locationStatus === 'asking' && `📍 ${lang === 'hi' ? 'लोकेशन मांग रहे हैं' : 'Requesting location...'}`}
            </span>
            {locationStatus === 'denied' && (
              <button type="button" onClick={requestLocation} style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 8,
                border: '1px solid #fca5a5', background: '#fff',
                color: '#dc2626', cursor: 'pointer'
              }}>
                {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try again'}
              </button>
            )}
          </div>

          {/* Input Fields */}
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 600,
                color: 'var(--ink)', marginBottom: 8
              }}>
                {label}
              </label>
              <input
                className="input" type={type} name={name}
                placeholder={placeholder} value={form[name]}
                onChange={handle}
                style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: 12, fontSize: 14,
                  padding: '12px 16px', width: '100%',
                  boxSizing: 'border-box',
                  background: 'var(--input-bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>
          ))}

          {/* Role Selector */}
          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: 'var(--ink)', marginBottom: 12
            }}>
              {t('auth.role')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROLES.map(r => (
                <div
                  key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    padding: '14px 18px', borderRadius: 14,
                    cursor: 'pointer',
                    border: `2px solid ${form.role === r.value
                      ? 'var(--mint)' : 'var(--border)'}`,
                    background: form.role === r.value
                      ? 'var(--gradient-card)'
                      : 'var(--card-bg)',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: form.role === r.value ? 'var(--mint)' : 'var(--ink)',
                      marginBottom: 2
                    }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {r.desc}
                    </div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${form.role === r.value ? 'var(--mint)' : 'var(--border)'}`,
                    background: form.role === r.value ? 'var(--mint)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {form.role === r.value && (
                      <div style={{
                        width: 8, height: 8,
                        borderRadius: '50%', background: '#fff'
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              borderRadius: 100, border: 'none',
              background: 'var(--gradient-hero)',
              color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? `⏳ ${t('auth.creating')}` : `${t('auth.createAccount')}`}
          </button>

          <p style={{
            textAlign: 'center', fontSize: 13,
            color: 'var(--muted)', marginTop: 20
          }}>
            {t('auth.haveAccount')}{' '}
            <Link to="/login" style={{
              color: 'var(--mint)', fontWeight: 600,
              textDecoration: 'none'
            }}>
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}