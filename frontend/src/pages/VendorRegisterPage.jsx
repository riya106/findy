import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { vendorsAPI } from '../services/api'

const SHOP_TYPES_EN = ['Food & Beverages', 'Clothing & Accessories', 'Electronics', 'Grocery', 'Services', 'Handicrafts', 'Other']
const SHOP_TYPES_HI = ['खाना-पीना', 'कपड़े और एक्सेसरी', 'इलेक्ट्रॉनिक्स', 'किराना', 'सेवाएं', 'हस्तशिल्प', 'अन्य']

export default function VendorRegisterPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  
  const SHOP_TYPES = lang === 'hi' ? SHOP_TYPES_HI : SHOP_TYPES_EN
  
  const [form, setForm] = useState({ 
    name: '', phone: '', shopType: SHOP_TYPES[0] 
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { 
      setMsg({ type: 'error', text: t('vendorRegister.errorFill') }); 
      return 
    }
    setLoading(true)
    try {
      await vendorsAPI.register(form)
      setMsg({ type: 'success', text: t('vendorRegister.success') })
      setTimeout(() => navigate('/vendor-dashboard'), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message ?? t('vendorRegister.errorFill') })
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
          <Link to="/vendors" style={{ 
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
            {t('vendorRegister.title')}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            {t('vendorRegister.subtitle')}
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
                {t('vendorRegister.shopName')}
              </label>
              <input 
                className="input" 
                name="name" 
                placeholder={t('vendorRegister.shopNamePH')} 
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
                {t('vendorRegister.phone')}
              </label>
              <input 
                className="input" 
                name="phone" 
                type="tel" 
                placeholder={t('vendorRegister.phonePH')} 
                value={form.phone} 
                onChange={handle} 
              />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 13, 
                fontWeight: 500, 
                color: 'var(--muted)', 
                marginBottom: 6 
              }}>
                {t('vendorRegister.shopType')}
              </label>
              <select 
                className="select" 
                name="shopType" 
                value={form.shopType} 
                onChange={handle}
              >
                {SHOP_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            
            <button 
              className="btn-primary" 
              type="submit" 
              disabled={loading} 
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px' }}
            >
              {loading ? t('vendorRegister.registering') : t('vendorRegister.register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}