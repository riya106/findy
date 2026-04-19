import { useEffect, useState } from "react"
import { listingsAPI } from "../services/api"
import ListingCard from "../components/ListingCard"
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/authcontext'
import { Link } from "react-router-dom"
import { calculateDistance } from "../utils/distance"

const FILTERS_EN = ["All", "Food", "Services", "Shops", "Tourism", "Health"]
const FILTERS_HI = ["सभी", "खाना", "सेवाएं", "दुकानें", "पर्यटन", "स्वास्थ्य"]

export default function ListingsPage() {
  const { t, lang } = useLang()
  const { user } = useAuth()
  
  const [allListings, setAllListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [radius, setRadius] = useState(10)

  const FILTERS = lang === 'hi' ? FILTERS_HI : FILTERS_EN
  const EN_FILTERS = FILTERS_EN

  useEffect(() => {
    fetchListings()
  }, [user?.savedLocation, radius])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const response = await listingsAPI.getAll()
      const items = response.data?.data || []
      
      const filteredByDistance = filterListingsByDistance(items, user?.savedLocation, radius)
      
      setAllListings(filteredByDistance)
      setFiltered(filteredByDistance)
    } catch (err) {
      setError(t('listings.loadingError') || "Could not load listings.")
    } finally {
      setLoading(false)
    }
  }

  const filterListingsByDistance = (listingsList, userLocation, radiusKm) => {
    if (!userLocation?.lat || !userLocation?.lng) {
      return listingsList
    }
    
    return listingsList.filter(listing => {
      // Get coordinates from listing location
      const listingLat = listing.location?.coordinates?.[1]
      const listingLng = listing.location?.coordinates?.[0]
      
      if (listingLat && listingLng) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          listingLat, listingLng
        )
        return distance <= radiusKm
      }
      return true
    }).map(listing => {
      const listingLat = listing.location?.coordinates?.[1]
      const listingLng = listing.location?.coordinates?.[0]
      if (listingLat && listingLng) {
        listing.distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          listingLat, listingLng
        )
      }
      return listing
    }).sort((a, b) => (a.distance || 999) - (b.distance || 999))
  }

  const applyFilter = (f, idx) => {
    setActive(f)
    const filterVal = EN_FILTERS[idx]
    if (filterVal === "All" || f === "सभी") {
      setFiltered(allListings)
      return
    }
    setFiltered(
      allListings.filter(
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
      
      {/* Location Badge with Radius Selector */}
      {user?.savedLocation?.city && (
        <div style={{ padding: "0 48px 20px" }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            background: 'var(--mint-soft)',
            padding: '12px 20px',
            borderRadius: 100,
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📍</span>
              Showing listings within <strong>{radius} km</strong> of <strong>{user.savedLocation.area || user.savedLocation.city}</strong>
              <Link to="/profile" style={{ color: 'var(--mint)', textDecoration: 'none', marginLeft: 4 }}>(Change)</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12 }}>Radius:</span>
              <select 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 12
                }}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* HERO HEADER */}
      <div style={{ padding: "0 48px 28px" }}>
        <div style={{
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 320,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/1598663/pexels-photo-1598663.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }} />
          
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(210, 80, 40, 0.85) 0%, rgba(230, 100, 30, 0.75) 50%, rgba(15,184,146,0.4) 100%)',
          }} />
          
          <div style={{ position: 'relative', zIndex: 2, padding: '50px 40px' }}>
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
              Explore street food, local shops, and authentic services within {radius} km of your location
            </p>
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
            : <>Found <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> listing{filtered.length !== 1 ? 's' : ''} within {radius} km</>
          }
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>{t('listings.loading')}</p>
        </div>
      )}

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

      {!loading && filtered.length > 0 && (
        <div style={{
          padding: "8px 48px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24
        }}>
          {Array.isArray(filtered) && filtered.map((l, i) => (
            <ListingCard key={l._id || i} listing={l} delay={i * 0.05} />
          ))}
        </div>
      )}

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
            No listings found within {radius} km
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
            Try increasing the radius or changing your location
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setRadius(20)} className="btn-outline">
              Increase to 20 km
            </button>
            <Link to="/profile" className="btn-primary">
              Change Location
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}