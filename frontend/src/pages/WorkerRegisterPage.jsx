import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { workersAPI } from '../services/api'
import LocationButton from '../components/LocationButton'

const PROFESSIONS_EN = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mechanic', 'Cleaner', 'Mason', 'Welder', 'AC Technician', 'Other']
const PROFESSIONS_HI = ['इलेक्ट्रीशियन', 'प्लम्बर', 'बढ़ई', 'पेंटर', 'मैकेनिक', 'सफाईकर्मी', 'राजमिस्त्री', 'वेल्डर', 'AC तकनीशियन', 'अन्य']

export default function WorkerRegisterPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  
  const PROFESSIONS = lang === 'hi' ? PROFESSIONS_HI : PROFESSIONS_EN
  
  const [form, setForm] = useState({ 
    name: '', phone: '', profession: PROFESSIONS[0], experience: '' 
  })
  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.experience) { 
      setMsg({ type: 'error', text: t('workerRegister.errorFill') }); 
      return 
    }
    setLoading(true)
    try {
      await workersAPI.register({ ...form, lat: coords?.lat, lng: coords?.lng })
      setMsg({ type: 'success', text: t('workerRegister.success') })
      setTimeout(() => navigate('/worker-dashboard'), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message ?? t('workerRegister.errorFill') })
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '80px 20px', 
      background: 'var(--gradient-page)' 
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ marginBottom: 20 }}>
          <Link to="/workers" style={{ 
            fontSize: 13, 
            color: 'var(--muted)', 
            textDecoration: 'none' 
          }}>
            ← {t('back')}
          </Link>
        </div>

        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: 20, 
          padding: 32 
        }}>
          <h1 style={{ 
            fontFamily: 'Syne, sans-serif', 
            fontWeight: 700, 
            fontSize: 26, 
            marginBottom: 4,
            color: 'var(--ink)'
          }}>
            {t('workerRegister.title')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            {t('workerRegister.subtitle')}
          </p>

          {msg.text && (
            <div className={msg.type === 'success' ? 'alert-success' : 'alert-error'}>
              {msg.text}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 6 
              }}>
                {t('workerRegister.fullName')}
              </label>
              <input 
                className="input" 
                name="name" 
                type="text" 
                placeholder={t('workerRegister.namePH')} 
                value={form.name} 
                onChange={handle} 
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 6 
              }}>
                {t('workerRegister.phone')}
              </label>
              <input 
                className="input" 
                name="phone" 
                type="tel" 
                placeholder={t('workerRegister.phonePH')} 
                value={form.phone} 
                onChange={handle} 
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 6 
              }}>
                {t('workerRegister.experience')}
              </label>
              <input 
                className="input" 
                name="experience" 
                type="number" 
                placeholder={t('workerRegister.expPH')} 
                value={form.experience} 
                onChange={handle} 
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 6 
              }}>
                {t('workerRegister.profession')}
              </label>
              <select 
                className="select" 
                name="profession" 
                value={form.profession} 
                onChange={handle}
              >
                {PROFESSIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 8 
              }}>
                {t('workerRegister.location')}
              </label>
              <LocationButton 
                onLocation={setCoords} 
                label={t('workerRegister.captureBtn')} 
              />
            </div>

            <button 
              className="btn-primary" 
              type="submit" 
              disabled={loading} 
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px' }}
            >
              {loading ? t('workerRegister.registering') : t('workerRegister.register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}