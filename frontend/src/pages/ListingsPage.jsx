import { useEffect, useState } from "react"
import { listingsAPI } from "../services/api"
import ListingCard from "../components/ListingCard"
import { useLang } from '../context/LanguageContext'

const FILTERS_EN = ["All", "Food", "Services", "Shops", "Tourism", "Health"]
const FILTERS_HI = ["सभी", "खाना", "सेवाएं", "दुकानें", "पर्यटन", "स्वास्थ्य"]

export default function ListingsPage() {
  const { t, lang } = useLang()
  const FILTERS = lang === 'hi' ? FILTERS_HI : FILTERS_EN
  const EN_FILTERS = FILTERS_EN

  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    listingsAPI.getAll()
      .then((res) => {
        const items = res.data?.data || []
        setListings(items)
        setFiltered(items)
      })
      .catch(() => setError(t('listings.loadingError') || "Could not load listings."))
      .finally(() => setLoading(false))
  }, [t])

  const applyFilter = (f, idx) => {
    setActive(f)
    const filterVal = EN_FILTERS[idx]
    if (filterVal === "All" || f === "सभी") {
      setFiltered(listings)
      return
    }
    setFiltered(
      listings.filter(
        (l) => l.category?.toLowerCase() === filterVal.toLowerCase()
      )
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-page)",
      paddingTop: 88
    }}>
      
      {/* ==================== BEAUTIFUL INDIAN-THEMED HEADER FOR LISTINGS ==================== */}
      <div style={{ padding: "0 48px 28px" }}>
        <div style={{
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 360,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Background Image - Indian Street Food / Market */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/1598663/pexels-photo-1598663.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }} />
          
          {/* Gradient Overlay - Food/Culture theme */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(210, 80, 40, 0.85) 0%, rgba(230, 100, 30, 0.75) 50%, rgba(15,184,146,0.4) 100%)',
          }} />
          
          {/* Decorative Indian Pattern Elements */}
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 70%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)',
          }} />
          
          {/* Decorative dots - Food inspired */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,215,0,0.4)',
            boxShadow: '0 0 0 12px rgba(255,215,0,0.1), 0 0 0 24px rgba(255,215,0,0.05)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '25%',
            left: '10%',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            boxShadow: '0 0 0 10px rgba(255,255,255,0.08), 0 0 0 20px rgba(255,255,255,0.04)',
          }} />
          
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '50px 40px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              borderRadius: 100,
              padding: '6px 20px',
              marginBottom: 24,
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <span style={{ fontSize: 20 }}>🍜</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                LOCAL EXPERIENCES
              </span>
            </div>
            
            {/* Main Title */}
            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(40px, 7vw, 64px)',
              margin: "0 0 12px",
              color: "#fff",
              textShadow: '0 2px 15px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
            }}>
              Discover Local<br />
              <span style={{ 
                color: '#FFD700', 
                borderBottom: '4px solid #FFD700', 
                display: 'inline-block',
                paddingBottom: '4px'
              }}>
                Shops & Services
              </span>
            </h1>
            
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 500,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Explore street food, local shops, and authentic services in your neighborhood
            </p>
            
            {/* Stats Row */}
            <div style={{
              display: 'flex',
              gap: 30,
              marginTop: 20,
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  backdropFilter: 'blur(8px)',
                }}>
                  🍽️
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{listings.filter(l => l.category === 'Food').length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Food Stalls</div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  backdropFilter: 'blur(8px)',
                }}>
                  🛍️
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{listings.length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Total Listings</div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  backdropFilter: 'blur(8px)',
                }}>
                  ⭐
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>4.5+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "8px 48px 24px",
        scrollbarWidth: "none"
      }}>
        {FILTERS.map((f, idx) => (
          <button
            key={f}
            onClick={() => applyFilter(f, idx)}
            style={{
              padding: "10px 22px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: active === f ? 600 : 500,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: active === f ? "var(--mint)" : "var(--surface)",
              color: active === f ? "#fff" : "var(--muted)",
              boxShadow: active === f ? "var(--shadow)" : "none",
              transition: "all 0.2s"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {!loading && filtered.length > 0 && (
        <div style={{
          padding: "0 48px 16px",
          fontSize: 13,
          color: "var(--muted)"
        }}>
          {lang === 'hi' 
            ? <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> लिस्टिंग मिलीं</>
            : <>Showing <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> listing{filtered.length !== 1 ? 's' : ''}</>
          }
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>{t('listings.loading')}</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div style={{
          margin: "0 48px 20px",
          padding: "16px",
          borderRadius: 12,
          background: "#fef2f2",
          border: "1px solid #fca5a5",
          color: "#dc2626",
          fontSize: 13
        }}>
          ❌ {error}
        </div>
      )}

      {/* LISTINGS GRID */}
      {!loading && filtered.length > 0 && (
        <div style={{
          padding: "8px 48px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24
        }}>
          {Array.isArray(filtered) && filtered.map((l, i) => (
            <ListingCard
              key={l._id || i}
              listing={l}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "80px 48px",
          margin: "0 48px 60px",
          background: "var(--surface)",
          borderRadius: 24,
          border: "1px dashed var(--border)"
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h3 style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            marginBottom: 8,
            color: "var(--ink)"
          }}>
            {t('listings.noListings')}
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            {lang === 'hi'
              ? 'कोई लिस्टिंग नहीं मिली। कृपया बाद में जांचें।'
              : 'No listings found. Please check back later.'}
          </p>
        </div>
      )}
    </div>
  )
}