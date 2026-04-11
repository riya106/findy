import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { vendorsAPI } from '../services/api'

export default function VendorDashboardPage() {
  const { user } = useAuth()
  const { t, lang } = useLang()

  const [isLive, setIsLive] = useState(false)
  const [liveMin, setLiveMin] = useState(0)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveMsg, setLiveMsg] = useState({ type: '', text: '' })

  const timerRef = useRef(null)

  const [shopForm, setShopForm] = useState({
    name: '',
    phone: '',
    shopType: 'Food & Beverages',
    description: '',
    address: ''
  })

  const SHOP_TYPES = lang === 'hi' 
    ? ['खाना-पीना', 'कपड़े और एक्सेसरी', 'इलेक्ट्रॉनिक्स', 'किराना', 'सेवाएं', 'हस्तशिल्प', 'अन्य']
    : ['Food & Beverages', 'Clothing & Accessories', 'Electronics', 'Grocery', 'Services', 'Handicrafts', 'Other']

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  const goLive = () => {
    setLiveLoading(true)
    setLiveMsg({ type: '', text: '' })

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await vendorsAPI.goLive({
            vendorId: user?.id || user?._id,
            lat: coords.latitude,
            lng: coords.longitude
          })
          setIsLive(true)
          setLiveMin(0)
          setLiveMsg({ type: 'success', text: t('vendorDash.liveSuccess') })
          timerRef.current = setInterval(() => {
            setLiveMin(m => m + 1)
          }, 60000)
        } catch {
          setLiveMsg({ type: 'error', text: t('vendorDash.goLiveFailed') })
        }
        setLiveLoading(false)
      },
      () => {
        setLiveMsg({ type: 'error', text: t('vendorDash.locationDenied') })
        setLiveLoading(false)
      }
    )
  }

  const stopLive = () => {
    clearInterval(timerRef.current)
    setIsLive(false)
    setLiveMsg({ type: '', text: '' })
  }

  const handleShop = (e) => {
    setShopForm({ ...shopForm, [e.target.name]: e.target.value })
  }

  const saveShop = async () => {
    try {
      await vendorsAPI.register(shopForm)
      alert(lang === 'hi' ? 'दुकान प्रोफ़ाइल सहेजी गई!' : 'Shop profile saved!')
    } catch {
      alert(lang === 'hi' ? 'सहेजने में विफल' : 'Failed to save')
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-page)",
      paddingTop: 72
    }}>
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <div
        style={{
          backgroundImage: "url('https://media.istockphoto.com/id/583829624/photo/indian-street-vendor-selling-sweets-near-jaipur-india.jpg?s=612x612&w=0&k=20&c=Og1fHfmHCTuMqR3XejkmSTAERLg1N4FXWKuO8BqZ4zE=')",
          backgroundSize: "cover",
          backgroundPosition: "30% 20%",
          backgroundRepeat: "no-repeat",
          padding: "70px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.35))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 42,
                color: "#fff",
                marginBottom: 10,
              }}
            >
              {lang === 'hi' ? 'वापस स्वागत है,' : 'Welcome back,'}
              <br />
              <span style={{ color: "#6ee7b7" }}>
                {user?.name?.split(" ")[0] || (lang === 'hi' ? 'विक्रेता' : 'Vendor')}
              </span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                maxWidth: 420,
                fontSize: 15
              }}
            >
              {t('vendorDash.subtitle')}
            </p>
          </div>

          {/* Live Status Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "18px 26px",
              backdropFilter: "blur(8px)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 30 }}>{isLive ? "🟢" : "⚫"}</div>
            <div style={{ fontWeight: 700, color: "#fff" }}>
              {isLive ? t('vendorDash.youAreLive') : (lang === 'hi' ? 'ऑफलाइन' : 'OFFLINE')}
            </div>
            {isLive && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                {liveMin} {lang === 'hi' ? 'मिनट लाइव' : 'min broadcasting'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 60px"
      }}>
        {/* Live Message */}
        {liveMsg.text && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 500,
            background: liveMsg.type === 'success' ? 'var(--mint-soft)' : '#fef2f2',
            color: liveMsg.type === 'success' ? 'var(--mint-dark)' : '#dc2626',
            border: `1px solid ${liveMsg.type === 'success' ? 'var(--border)' : '#fca5a5'}`
          }}>
            {liveMsg.type === 'success' ? '✅ ' : '❌ '}{liveMsg.text}
          </div>
        )}

        {/* GRID - Shop Profile + Go Live */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 28,
          marginBottom: 40
        }}>
          {/* SHOP PROFILE CARD */}
          <div style={{
            background: "var(--card-bg)",
            borderRadius: 26,
            padding: 34,
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)"
          }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              marginBottom: 20,
              color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'दुकान प्रोफ़ाइल' : 'Shop Profile'}
            </h2>

            <input
              name="name"
              placeholder={lang === 'hi' ? 'दुकान का नाम' : 'Shop name'}
              value={shopForm.name}
              onChange={handleShop}
              className="input"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
              }}
            />

            <input
              name="address"
              placeholder={lang === 'hi' ? 'पता' : 'Address'}
              value={shopForm.address}
              onChange={handleShop}
              className="input"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
              }}
            />

            <input
              name="phone"
              placeholder={lang === 'hi' ? 'फ़ोन नंबर' : 'Phone'}
              value={shopForm.phone}
              onChange={handleShop}
              className="input"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
              }}
            />

            <select
              name="shopType"
              value={shopForm.shopType}
              onChange={handleShop}
              className="select"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 10,
              }}
            >
              {SHOP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            <textarea
              name="description"
              placeholder={lang === 'hi' ? 'आप क्या बेचते हैं?' : 'What do you sell?'}
              value={shopForm.description}
              onChange={handleShop}
              rows={3}
              className="input"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                resize: 'vertical'
              }}
            />

            <button
              onClick={saveShop}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 14,
                borderRadius: 100,
                border: "none",
                background: "var(--gradient-hero)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              {lang === 'hi' ? 'दुकान प्रोफ़ाइल सहेजें' : 'Save Shop Profile'}
            </button>
          </div>

          {/* GO LIVE CARD */}
          <div style={{
            background: isLive 
              ? 'linear-gradient(135deg, var(--mint-dark), var(--mint))'
              : "var(--card-bg)",
            borderRadius: 26,
            padding: 34,
            textAlign: "center",
            boxShadow: "var(--shadow)",
            border: isLive ? 'none' : '1px solid var(--border)',
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: 60 }}>
              {isLive ? '🟢' : '📍'}
            </div>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              marginTop: 10,
              color: isLive ? '#fff' : 'var(--ink)'
            }}>
              {isLive ? t('vendorDash.youAreLive') : t('vendorDash.goLive')}
            </h2>
            <p style={{
              color: isLive ? 'rgba(255,255,255,0.8)' : 'var(--muted)',
              marginBottom: 30
            }}>
              {isLive ? t('vendorDash.broadcasting') : t('vendorDash.goLiveDesc')}
            </p>

            {isLive ? (
              <button
                onClick={stopLive}
                style={{
                  padding: "14px 32px",
                  borderRadius: 100,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#dc2626"}
                onMouseLeave={e => e.target.style.background = "#ef4444"}
              >
                {lang === 'hi' ? 'लाइव बंद करें' : 'Stop Broadcasting'}
              </button>
            ) : (
              <button
                onClick={goLive}
                disabled={liveLoading}
                style={{
                  padding: "14px 32px",
                  borderRadius: 100,
                  border: "none",
                  background: "var(--gradient-hero)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: liveLoading ? 'wait' : 'pointer',
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  if (!liveLoading) e.target.style.transform = "scale(1.05)"
                }}
                onMouseLeave={e => {
                  if (!liveLoading) e.target.style.transform = "scale(1)"
                }}
              >
                {liveLoading 
                  ? (lang === 'hi' ? 'लोकेशन मिल रही...' : 'Getting location...')
                  : (lang === 'hi' ? 'अभी लाइव जाएं' : 'Go Live Now')}
              </button>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <h2 style={{
          fontFamily: "Syne, sans-serif",
          marginBottom: 16,
          color: 'var(--ink)'
        }}>
          {lang === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20
        }}>
          {[
            { 
              icon: "⭐", 
              title: lang === 'hi' ? 'मेरी समीक्षाएं' : 'My Reviews', 
              link: "/vendor-reviews" 
            },
            { 
              icon: "🗺️", 
              title: lang === 'hi' ? 'लिस्टिंग देखें' : 'Explore Listings', 
              link: "/listings" 
            },
            { 
              icon: "👤", 
              title: lang === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile', 
              link: "/profile" 
            },
          ].map(card => (
            <a
              key={card.title}
              href={card.link}
              style={{
                background: "var(--card-bg)",
                padding: 28,
                borderRadius: 22,
                textDecoration: "none",
                color: "var(--ink)",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
                transition: "all 0.2s",
                cursor: "pointer",
                display: "block"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.borderColor = "var(--mint)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "var(--border)"
              }}
            >
              <div style={{ fontSize: 34 }}>
                {card.icon}
              </div>
              <div style={{
                fontWeight: 700,
                marginTop: 10,
                fontFamily: "Syne, sans-serif"
              }}>
                {card.title}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}