import { useEffect, useState } from "react"
import { aroundAPI } from "../services/api"
import { useGeolocation } from "../hooks/useGeolocation"
import { useAddress } from "../hooks/useAddress"
import { useLang } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import IndianMap from '../components/IndianMap';
import { calculateDistance } from "../utils/distance"

const CATEGORIES_EN = ["All", "Cafe", "Restaurant", "Park", "Hospital", "Shop", "Metro", "ATM", "Pharmacy"]
const CATEGORIES_HI = ["सभी", "कैफे", "रेस्तरां", "पार्क", "अस्पताल", "दुकान", "मेट्रो", "एटीएम", "फार्मेसी"]

function PlaceCard({ place, onClick }) {
  const getIcon = () => {
    switch(place.type?.toLowerCase()) {
      case 'cafe': return '☕'
      case 'restaurant': return '🍽️'
      case 'fast food': return '🍔'
      case 'park': return '🌳'
      case 'hospital': return '🏥'
      case 'shop': return '🛍️'
      case 'metro': return '🚇'
      case 'atm': return '💰'
      case 'pharmacy': return '💊'
      case 'bar': return '🍺'
      default: return '📍'
    }
  }

  const getTypeColor = () => {
    switch(place.type?.toLowerCase()) {
      case 'cafe': return '#8B4513'
      case 'restaurant': return '#FF6347'
      case 'park': return '#228B22'
      case 'hospital': return '#e74c3c'
      case 'metro': return '#3498db'
      default: return 'var(--mint)'
    }
  }

  return (
    <div
      onClick={() => onClick(place)}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: 16,
        boxShadow: 'var(--shadow)',
        minHeight: '100px'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateX(8px)'
        e.currentTarget.style.borderColor = 'var(--mint)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(15,184,146,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateX(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'var(--shadow)'
      }}
    >
      <div style={{
        width: 60,
        height: 60,
        borderRadius: 18,
        background: `linear-gradient(135deg, ${getTypeColor()}, ${getTypeColor()}80)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 700, 
          fontSize: 17, 
          color: 'var(--ink)', 
          marginBottom: 6,
          lineHeight: 1.3
        }}>
          {place.name}
        </div>
        <div style={{ 
          fontSize: 13, 
          color: 'var(--muted)', 
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <span style={{
            background: getTypeColor() + '20',
            padding: '2px 10px',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 500,
            color: getTypeColor()
          }}>
            {place.type}
          </span>
          {place.distance && (
            <span style={{ fontSize: 12, color: 'var(--mint)', fontWeight: 500 }}>
              📏 {place.distance < 1 ? `${Math.round(place.distance * 1000)}m` : `${place.distance.toFixed(1)}km`} away
            </span>
          )}
        </div>
        {place.address && (
          <div style={{ 
            fontSize: 12, 
            color: 'var(--muted)', 
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <span>📍</span> {place.address.length > 60 ? place.address.substring(0, 60) + '...' : place.address}
          </div>
        )}
      </div>
      <div style={{ 
        fontSize: 28, 
        color: 'var(--mint)',
        opacity: 0.8,
        transition: 'transform 0.3s ease',
        flexShrink: 0
      }}>→</div>
    </div>
  )
}

function PlaceDetailModal({ place, onClose }) {
  const getIcon = () => {
    switch(place.type?.toLowerCase()) {
      case 'cafe': return '☕'
      case 'restaurant': return '🍽️'
      case 'park': return '🌳'
      case 'hospital': return '🏥'
      case 'shop': return '🛍️'
      case 'metro': return '🚇'
      case 'atm': return '💰'
      case 'pharmacy': return '💊'
      default: return '📍'
    }
  }

  const getDirections = () => {
    if (place.location?.lat && place.location?.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`, '_blank')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 32,
        maxWidth: 480,
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        border: '1px solid var(--border)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          background: `linear-gradient(135deg, var(--mint), var(--mint-dark))`,
          padding: '32px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 18,
            cursor: 'pointer',
            color: '#fff',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >✕</button>
          <div style={{
            width: 80,
            height: 80,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            margin: '0 auto 16px'
          }}>
            {getIcon()}
          </div>
          <h2 style={{ color: '#fff', marginBottom: 8, fontSize: 24 }}>{place.name}</h2>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 16px',
            borderRadius: 100,
            fontSize: 13,
            color: '#fff',
            display: 'inline-block'
          }}>{place.type}</span>
        </div>
        
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>📍 Address</div>
            <div style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.5 }}>{place.address || 'Address not available'}</div>
          </div>
          
          {place.distance && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>📏 Distance</div>
              <div style={{ fontSize: 15, color: 'var(--mint)', fontWeight: 600 }}>
                {place.distance < 1 ? `${Math.round(place.distance * 1000)} meters` : `${place.distance.toFixed(1)} kilometers`} away
              </div>
            </div>
          )}
          
          {place.rating > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>⭐ Rating</div>
              <div style={{ fontSize: 15, color: 'var(--ink)' }}>
                {'★'.repeat(Math.floor(place.rating))}{'☆'.repeat(5 - Math.floor(place.rating))}
                <span style={{ marginLeft: 8, color: 'var(--muted)' }}>({place.rating})</span>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={getDirections} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: 15 }}>
              🗺️ Get Directions
            </button>
            <button onClick={onClose} className="btn-outline" style={{ flex: 1, padding: '14px', fontSize: 15 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AroundPage() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const CATEGORIES = lang === 'hi' ? CATEGORIES_HI : CATEGORIES_EN

  const { coords, loading: geoLoading, error: geoError, getLocation } = useGeolocation()
  const userAddress = useAddress(coords?.lat, coords?.lng)

  const [places, setPlaces] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState('map')
  const [radius, setRadius] = useState(2)
  const [selectedPlace, setSelectedPlace] = useState(null)

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 2, label: '2 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' }
  ]

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (!coords) return

    console.log("📍 Location detected:", coords)
    setLoading(true)
    setError("")
    
    aroundAPI.getNearby(coords.lat, coords.lng, radius * 1000)
      .then((response) => {
        const placesData = response.data?.data || response.data || []
        
        const placesWithDistance = placesData.map(place => {
          const lat = place.location?.lat
          const lng = place.location?.lng
          if (lat && lng && coords) {
            const distance = calculateDistance(coords.lat, coords.lng, lat, lng)
            return { ...place, distance, lat, lng }
          }
          return place
        }).sort((a, b) => (a.distance || 999) - (b.distance || 999))
        
        console.log(`📊 Found ${placesWithDistance.length} places near you`)
        setPlaces(placesWithDistance)
        setFiltered(placesWithDistance)
      })
      .catch(err => {
        console.error("❌ Error fetching places:", err)
        setError("Could not load nearby places. Please try again.")
      })
      .finally(() => setLoading(false))
  }, [coords, radius])

  const applyFilter = (category) => {
    setActive(category)
    if (category === "All" || category === "सभी") {
      setFiltered(places)
    } else {
      setFiltered(places.filter(p => p.type?.toLowerCase() === category.toLowerCase()))
    }
  }

  const handlePlaceClick = (place) => {
    setSelectedPlace(place)
  }

  if (geoLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
          <h3>Getting your location...</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Please allow location access</p>
        </div>
      </div>
    )
  }

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
      
      {/* Location and Radius Bar */}
      {coords && (
        <div style={{ padding: "0 48px 20px" }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            background: 'var(--surface)',
            padding: '12px 20px',
            borderRadius: 100,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <span style={{ fontSize: 13, color: 'var(--ink)' }}>
                <strong>{userAddress?.split(',')[0] || 'Your Location'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13 }}>Radius:</span>
              <select 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{
                  padding: '6px 14px',
                  borderRadius: 100,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {radiusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Header */}
      <div style={{ padding: "0 48px 28px" }}>
        <div style={{
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 280,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }} />
          
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,184,146,0.85) 0%, rgba(5,146,114,0.75) 100%)',
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
              marginBottom: 20,
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <span style={{ fontSize: 18 }}>🗺️</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                EXPLORE YOUR NEIGHBORHOOD
              </span>
            </div>
            
            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 6vw, 52px)',
              margin: "0 0 12px",
              color: "#fff",
              textShadow: '0 2px 15px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
            }}>
              Discover What's<br />
              <span style={{ 
                color: '#FFD700', 
                borderBottom: '3px solid #FFD700', 
                display: 'inline-block',
                paddingBottom: '4px'
              }}>
                Around You
              </span>
            </h1>
            
            <p style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 450,
              lineHeight: 1.5
            }}>
              Find cafes, restaurants, parks, and more in your neighborhood
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ padding: "0 48px 20px", display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: "8px 20px",
            borderRadius: 100,
            border: `1px solid ${viewMode === 'list' ? 'var(--mint)' : 'var(--border)'}`,
            background: viewMode === 'list' ? 'var(--mint)' : 'var(--surface)',
            color: viewMode === 'list' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            transition: 'all 0.2s'
          }}
        >
          📋 List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          style={{
            padding: "8px 20px",
            borderRadius: 100,
            border: `1px solid ${viewMode === 'map' ? 'var(--mint)' : 'var(--border)'}`,
            background: viewMode === 'map' ? 'var(--mint)' : 'var(--surface)',
            color: viewMode === 'map' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            transition: 'all 0.2s'
          }}
        >
          🗺️ Map View
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 48px 20px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        marginBottom: 8
      }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => applyFilter(c)}
            style={{
              padding: '8px 18px',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: active === c ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: 'none',
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
          Found <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> places within {radius} km
        </div>
      )}

      {/* List View Content */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  No places found within {radius} km
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
                  Try increasing the radius or check back later
                </p>
                <button onClick={() => setRadius(5)} className="btn-outline">
                  Increase to 5 km
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetailModal 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
        />
      )}
    </div>
  )
}