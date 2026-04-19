import { useEffect, useState } from "react"
import { vendorsAPI } from "../services/api"
import VendorCard from "../components/VendorCard"
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/authcontext'
import { Link } from "react-router-dom"
import { calculateDistance } from "../utils/distance"

export default function VendorsPage() {
  const { t, lang } = useLang()
  const { user } = useAuth()
  
  const [vendors, setVendors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [radius, setRadius] = useState(10)

  const radiusOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 50, label: '50 km' },
    { value: 70, label: '70 km' },
    { value: 100, label: '100 km' }
  ]

  useEffect(() => {
    fetchVendors()
  }, [user?.savedLocation, radius])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const response = await vendorsAPI.getLive()
      const items = response.data?.data || []
      
      console.log("Total vendors fetched:", items.length)
      console.log("User location:", user?.savedLocation)
      console.log("Radius filter:", radius, "km")
      
      const filteredByDistance = filterVendorsByDistance(items, user?.savedLocation, radius)
      
      console.log("Vendors after distance filter:", filteredByDistance.length)
      
      setVendors(filteredByDistance)
      setFiltered(filteredByDistance)
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError(lang === 'hi' ? 'विक्रेता लोड नहीं हो सके' : 'Could not load vendors')
    } finally {
      setLoading(false)
    }
  }

  const filterVendorsByDistance = (vendorsList, userLocation, radiusKm) => {
    if (!userLocation?.lat || !userLocation?.lng) {
      console.log("No user location found, showing all vendors")
      return vendorsList
    }
    
    const filtered = vendorsList.filter(vendor => {
      const vendorLat = vendor.location?.lat
      const vendorLng = vendor.location?.lng
      
      if (!vendorLat || !vendorLng) {
        return true
      }
      
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        vendorLat, vendorLng
      )
      
      return distance <= radiusKm
    })
    
    return filtered.map(vendor => {
      const vendorLat = vendor.location?.lat
      const vendorLng = vendor.location?.lng
      if (vendorLat && vendorLng && userLocation) {
        vendor.distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          vendorLat, vendorLng
        )
      }
      return vendor
    }).sort((a, b) => (a.distance || 999) - (b.distance || 999))
  }

  const handleRadiusChange = (newRadius) => {
    console.log("Radius changed to:", newRadius)
    setRadius(newRadius)
  }

  const getStats = () => {
    const total = vendors.length
    const liveCount = vendors.filter(v => v.isLive).length
    return { total, liveCount }
  }

  const stats = getStats()

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-page)",
      paddingTop: 88
    }}>
      
      {/* Location and Radius Badge */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span>📍</span>
              <span>Showing vendors within <strong>{radius} km</strong> of <strong>{user.savedLocation.area || user.savedLocation.city}</strong></span>
              <Link to="/profile" style={{ color: 'var(--mint)', textDecoration: 'none', marginLeft: 4 }}>(Change)</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12 }}>Radius:</span>
              <select 
                value={radius} 
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 12,
                  cursor: 'pointer'
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
            backgroundImage: `url('https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }} />
          
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,184,146,0.85) 0%, rgba(5,146,114,0.75) 50%, rgba(255,153,51,0.4) 100%)',
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
              <span style={{ fontSize: 20 }}>🏪</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                LOCAL VENDORS & SHOPS
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
                Vendors Near You
              </span>
            </h1>
            
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 500,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Find authentic street food, local shops, and services within {radius} km of your location
            </p>
            
            <div style={{
              display: 'flex',
              gap: 30,
              marginTop: 20,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                }}>🏪</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stats.liveCount}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Live Now</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                }}>🛍️</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stats.total}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Total Vendors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count - Register Button REMOVED */}
      {!loading && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 48px 20px",
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {lang === 'hi' 
              ? <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> विक्रेता मिले</>
              : <>Found <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> vendor{filtered.length !== 1 ? 's' : ''} within {radius} km</>
            }
          </div>
          {/* Register button removed */}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Loading vendors...</p>
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
          padding: '8px 48px 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((vendor, i) => (
            <VendorCard key={vendor._id || i} vendor={vendor} delay={i * 0.05} />
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
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏪</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8, color: "var(--ink)" }}>
            No vendors found within {radius} km
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
            Try increasing the radius or changing your location
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleRadiusChange(20)} className="btn-outline">
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