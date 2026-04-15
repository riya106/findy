import { useEffect, useState } from "react"
import { aroundAPI } from "../services/api"
import { vendorsAPI } from "../services/api"
import { listingsAPI } from "../services/api"
import { useGeolocation } from "../hooks/useGeolocation"
import { useAddress } from "../hooks/useAddress"
import { useLang } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import IndianMap from '../components/IndianMap';

const CATEGORIES_EN = ["All", "Park", "Cafe", "Restaurant", "Hospital", "Shop", "Game Zone", "Vendors", "Listings"]
const CATEGORIES_HI = ["सभी", "पार्क", "कैफे", "रेस्तरां", "अस्पताल", "दुकान", "गेम ज़ोन", "विक्रेता", "लिस्टिंग"]

function PlaceCard({ place, onClick }) {
  const getIcon = () => {
    if (place.isVendor) return '🏪'
    if (place.isListing) return '📋'
    switch(place.type?.toLowerCase()) {
      case 'park': return '🌳'
      case 'cafe': return '☕'
      case 'restaurant': return '🍽️'
      case 'hospital': return '🏥'
      case 'shop': return '🛍️'
      default: return '📍'
    }
  }

  return (
    <div
      onClick={() => onClick(place)}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(4px)'
        e.currentTarget.style.borderColor = 'var(--mint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--gradient-hero)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24
      }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{place.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {place.isVendor ? place.shopType : place.type}
          {place.isLive && <span style={{ color: '#10b981', marginLeft: 8 }}>🟢 Live</span>}
        </div>
        {place.distance && (
          <div style={{ fontSize: 11, color: 'var(--mint)' }}>{place.distance.toFixed(1)} km away</div>
        )}
      </div>
      <div style={{ fontSize: 20, color: 'var(--mint)' }}>→</div>
    </div>
  )
}

export default function AroundPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const CATEGORIES = lang === 'hi' ? CATEGORIES_HI : CATEGORIES_EN

  const { coords, loading: geoLoading, error: geoError, getLocation, address: exactAddress } = useGeolocation()
  const userAddress = useAddress(coords?.lat, coords?.lng)

  const [places, setPlaces] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState('map')

  // Get location on component mount
  useEffect(() => {
    getLocation()
  }, [])

  // Fetch places when coordinates are available
  useEffect(() => {
    if (!coords) return

    console.log("📍 YOUR EXACT LOCATION:", coords)
    setLoading(true)
    setError("")
    
    Promise.all([
      aroundAPI.getNearby(coords.lat, coords.lng),
      vendorsAPI.getLive(),
      listingsAPI.getAll()
    ])
      .then(([aroundRes, vendorsRes, listingsRes]) => {
        let allPlaces = []
        
        const aroundData = aroundRes.data?.data || aroundRes.data
        if (aroundData && typeof aroundData === 'object') {
          Object.keys(aroundData).forEach(category => {
            if (Array.isArray(aroundData[category])) {
              aroundData[category].forEach(place => {
                const angle = Math.random() * 2 * Math.PI
                const distance = 0.5 + Math.random() * 2
                const latOffset = (distance / 111) * Math.cos(angle)
                const lngOffset = (distance / 111) * Math.sin(angle) / Math.cos(coords.lat * Math.PI / 180)
                
                allPlaces.push({
                  ...place,
                  type: category,
                  isPlace: true,
                  name: place.name,
                  location: {
                    lat: coords.lat + latOffset,
                    lng: coords.lng + lngOffset
                  }
                })
              })
            }
          })
        }
        
        const vendorsData = vendorsRes.data?.data || vendorsRes.data
        if (Array.isArray(vendorsData)) {
          vendorsData.forEach(v => {
            if (v.location?.lat && v.location?.lng) {
              allPlaces.push({ 
                ...v, 
                isVendor: true, 
                type: 'Vendor',
                name: v.name,
                location: v.location 
              })
            }
          })
        }
        
        const listingsData = listingsRes.data?.data || listingsRes.data
        if (Array.isArray(listingsData)) {
          listingsData.forEach(l => {
            if (l.location?.coordinates) {
              allPlaces.push({ 
                ...l, 
                isListing: true, 
                name: l.title,
                type: l.category || 'Listing',
                location: { lat: l.location.coordinates[1], lng: l.location.coordinates[0] }
              })
            }
          })
        }
        
        allPlaces = allPlaces
          .map(place => {
            const lat = place.location?.lat
            const lng = place.location?.lng
            if (lat && lng && coords) {
              const distance = calculateDistance(coords.lat, coords.lng, lat, lng)
              return { ...place, distance, lat, lng }
            }
            return place
          })
          .filter(place => place.distance === undefined || place.distance <= 5)
          .sort((a, b) => (a.distance || 999) - (b.distance || 999))
        
        setPlaces(allPlaces)
        setFiltered(allPlaces)
      })
      .catch(err => {
        console.error("Error fetching places:", err)
        setError("Could not load nearby places.")
      })
      .finally(() => setLoading(false))
  }, [coords])

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const applyFilter = (category) => {
    setActive(category)
    if (category === "All" || category === "सभी") {
      setFiltered(places)
    } else if (category === "Vendors" || category === "विक्रेता") {
      setFiltered(places.filter(p => p.isVendor))
    } else if (category === "Listings" || category === "लिस्टिंग") {
      setFiltered(places.filter(p => p.isListing))
    } else {
      setFiltered(places.filter(p => p.type?.toLowerCase() === category.toLowerCase()))
    }
  }

  const handlePlaceClick = (place) => {
    if (place.isVendor) {
      navigate(`/vendors/${place._id}`)
    } else if (place.isListing) {
      navigate(`/listings/${place._id}`)
    }
  }

  // Show loading while getting location
  if (geoLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
          <h3>Getting your exact location...</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Please allow location access</p>
        </div>
      </div>
    )
  }

  // Show error if location permission denied
  if (geoError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
          <h2 style={{ marginBottom: 12 }}>Location Access Required</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Please enable location access to discover places around you.
          </p>
          <button onClick={getLocation} className="btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      
      {/* ==================== BEAUTIFUL INDIAN-THEMED HEADER ==================== */}
      <div style={{ padding: "0 48px 28px" }}>
        <div style={{
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 360,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Background Image - Beautiful India landscape */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }} />
          
          {/* Gradient Overlay - Indian flag inspired with mint */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,184,146,0.88) 0%, rgba(5,146,114,0.8) 50%, rgba(255,153,51,0.3) 100%)',
          }} />
          
          {/* Decorative Mandala-inspired circles */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
          }} />
          
          {/* Decorative dots pattern */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '12%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            boxShadow: '0 0 0 10px rgba(255,255,255,0.1), 0 0 0 20px rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '8%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            boxShadow: '0 0 0 8px rgba(255,255,255,0.08), 0 0 0 16px rgba(255,255,255,0.04)',
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
              <span style={{ fontSize: 20 }}>🇮🇳</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                EXPLORE INDIA
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
              Discover What's<br />
              <span style={{ 
                color: '#FFD700', 
                borderBottom: '4px solid #FFD700', 
                display: 'inline-block',
                paddingBottom: '4px'
              }}>
                Around You
              </span>
            </h1>
            
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 500,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Find local shops, services, and hidden gems in your neighborhood
            </p>
            
            {/* Location Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                borderRadius: 100,
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
                  {coords ? (exactAddress || userAddress || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`) : 'Getting your location...'}
                </span>
              </div>
              
              {coords && (
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 100,
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  <span style={{ fontSize: 14 }}>🎯</span>
                  <span style={{ fontSize: 12, color: '#fff', fontFamily: 'monospace' }}>
                    {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                  </span>
                </div>
              )}
            </div>
            
            {/* Stats Row */}
            <div style={{
              display: 'flex',
              gap: 30,
              marginTop: 35,
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
                  🏪
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{places.filter(p => p.isVendor).length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Vendors</div>
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
                  📋
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{places.filter(p => p.isListing).length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Listings</div>
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
                  📍
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{places.length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Total Places</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div style={{ padding: "0 48px 20px", display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: "10px 24px",
            borderRadius: 100,
            border: `1.5px solid ${viewMode === 'list' ? 'var(--mint)' : 'var(--border)'}`,
            background: viewMode === 'list' ? 'var(--mint)' : 'var(--surface)',
            color: viewMode === 'list' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            transition: 'all 0.2s',
          }}
        >
          📋 List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          style={{
            padding: "10px 24px",
            borderRadius: 100,
            border: `1.5px solid ${viewMode === 'map' ? 'var(--mint)' : 'var(--border)'}`,
            background: viewMode === 'map' ? 'var(--mint)' : 'var(--surface)',
            color: viewMode === 'map' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            transition: 'all 0.2s',
          }}
        >
          🗺️ Map View
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 48px 28px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => applyFilter(c)}
            style={{
              padding: '10px 22px',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: active === c ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: active === c ? 'var(--gradient-hero)' : 'var(--surface)',
              color: active === c ? '#fff' : 'var(--muted)',
              boxShadow: active === c ? 'var(--shadow)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Map View */}
      {viewMode === 'map' && coords && (
        <div style={{ padding: "0 48px 20px", marginBottom: 24 }}>
          <IndianMap 
            places={filtered} 
            userLocation={coords}
          />
        </div>
      )}

      {/* Results Count */}
      {!loading && viewMode === 'list' && filtered.length > 0 && (
        <div style={{ padding: "0 48px 16px", fontSize: 13, color: "var(--muted)" }}>
          Found <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> places near you
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '0 48px 60px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading nearby places...</p>
          </div>
        )}

        {error && (
          <div style={{
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: 13
          }}>
            ❌ {error}
          </div>
        )}

        {!loading && viewMode === 'list' && (
          <>
            {filtered.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((p, i) => (
                  <PlaceCard key={p._id || i} place={p} onClick={handlePlaceClick} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'var(--surface)',
                borderRadius: 24,
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>
                  No places found nearby
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                  Try adjusting your location or check back later
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}