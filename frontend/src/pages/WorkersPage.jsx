import { useEffect, useState } from 'react'
import { workersAPI } from '../services/api'
import WorkerCard from '../components/WorkerCard'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/authcontext'
import { Link } from 'react-router-dom'
import { calculateDistance } from '../utils/distance'

const PROFESSIONS_EN = [
  'All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 
  'Mechanic', 'Cleaner', 'AC Technician', 'Teacher', 'Coach', 
  'Driver', 'Cook', 'Other'
]
const PROFESSIONS_HI = [
  'सभी', 'इलेक्ट्रीशियन', 'प्लम्बर', 'बढ़ई', 'पेंटर', 
  'मैकेनिक', 'सफाईकर्मी', 'एसी तकनीशियन', 'शिक्षक', 'कोच', 
  'ड्राइवर', 'रसोइया', 'अन्य'
]

export default function WorkersPage() {
  const { t, lang } = useLang()
  const { user } = useAuth()

  const [allWorkers, setAllWorkers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [radius, setRadius] = useState(20)
  const [sortBy, setSortBy] = useState('distance')

  const PROFESSIONS = lang === 'hi' ? PROFESSIONS_HI : PROFESSIONS_EN
  const EN_PROFESSIONS = PROFESSIONS_EN

  const radiusOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 50, label: '50 km' },
    { value: 70, label: '70 km' },
    { value: 100, label: '100 km' }
  ]

  useEffect(() => {
    fetchWorkers()
  }, [user?.savedLocation, radius, sortBy])

  const fetchWorkers = async () => {
    setLoading(true)
    try {
      const response = await workersAPI.getAll()
      const items = response.data?.data || response.data || []
      
      console.log("Total workers fetched:", items.length)
      console.log("User location:", user?.savedLocation)
      console.log("Radius filter:", radius, "km")
      
      const filteredByDistance = filterWorkersByDistance(items, user?.savedLocation, radius)
      const sorted = sortWorkers(filteredByDistance, sortBy)
      
      console.log("Workers after distance filter:", filteredByDistance.length)
      
      setAllWorkers(sorted)
      setFiltered(sorted)
    } catch (err) {
      console.error('Error fetching workers:', err)
      setError(lang === 'hi' ? 'प्रोफेशनल लोड नहीं हो सके' : 'Could not load professionals.')
    } finally {
      setLoading(false)
    }
  }

  const filterWorkersByDistance = (workersList, userLocation, radiusKm) => {
    // If no user location, return all workers
    if (!userLocation?.lat || !userLocation?.lng) {
      console.log("No user location found, showing all workers")
      return workersList
    }
    
    const filtered = workersList.filter(worker => {
      const workerLat = worker.location?.lat
      const workerLng = worker.location?.lng
      
      // If worker has no location, include them (can't filter by distance)
      if (!workerLat || !workerLng) {
        return true
      }
      
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        workerLat, workerLng
      )
      
      return distance <= radiusKm
    })
    
    // Add distance to each worker
    return filtered.map(worker => {
      const workerLat = worker.location?.lat
      const workerLng = worker.location?.lng
      if (workerLat && workerLng && userLocation) {
        worker.distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          workerLat, workerLng
        )
      }
      return worker
    })
  }

  const sortWorkers = (workersList, sortType) => {
    const sorted = [...workersList]
    switch(sortType) {
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 999) - (b.distance || 999))
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'experience':
        return sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0))
      default:
        return sorted
    }
  }

  const applyFilter = (f, idx) => {
    setActive(f)
    const filterVal = EN_PROFESSIONS[idx]
    if (filterVal === 'All' || f === 'सभी') {
      setFiltered(allWorkers)
    } else {
      setFiltered(allWorkers.filter(
        w => w.profession?.toLowerCase() === filterVal.toLowerCase()
      ))
    }
  }

  const handleRadiusChange = (newRadius) => {
    console.log("Radius changed to:", newRadius)
    setRadius(newRadius)
    // fetchWorkers will be called automatically due to useEffect dependency
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const sorted = sortWorkers(filtered, newSort)
    setFiltered(sorted)
  }

  const getStats = () => {
    const total = allWorkers.length
    const avgRating = allWorkers.reduce((sum, w) => sum + (w.rating || 0), 0) / total || 0
    const professions = [...new Set(allWorkers.map(w => w.profession))].length
    return { total, avgRating: avgRating.toFixed(1), professions }
  }

  const stats = getStats()

  // Debug: Log workers with distances
  useEffect(() => {
    if (allWorkers.length > 0) {
      console.log("Workers with distances:", allWorkers.map(w => ({ 
        name: w.name, 
        distance: w.distance,
        profession: w.profession 
      })))
    }
  }, [allWorkers])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      
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
              <span>Showing professionals within <strong>{radius} km</strong> of <strong>{user.savedLocation.area || user.savedLocation.city}</strong></span>
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

      <div style={{ padding: '0 48px 32px' }}>
        <div style={{
          borderRadius: 28,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 320,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }} />
          
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(210, 120, 40, 0.85) 0%, rgba(230, 100, 30, 0.75) 50%, rgba(15,184,146,0.4) 100%)',
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
              <span style={{ fontSize: 20 }}>👥</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                FIND PROFESSIONALS
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
              Find Local<br />
              <span style={{ 
                color: '#FFD700', 
                borderBottom: '4px solid #FFD700', 
                display: 'inline-block',
                paddingBottom: '4px'
              }}>
                Skilled Professionals
              </span>
            </h1>
            
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 500,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Hire trusted electricians, plumbers, teachers, coaches and more from your neighborhood
            </p>
            
            <div style={{
              display: 'flex',
              gap: 40,
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
                }}>👥</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stats.total}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Professionals</div>
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
                }}>⭐</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stats.avgRating}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Avg Rating</div>
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
                }}>📚</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stats.professions}+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Services</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar - REMOVED Register Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        padding: '0 48px 20px',
        marginBottom: 8
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flex: 1
        }}>
          {PROFESSIONS.map((p, idx) => (
            <button
              key={p}
              onClick={() => applyFilter(p, idx)}
              style={{
                padding: '8px 18px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: active === p ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: 'none',
                background: active === p ? 'var(--gradient-hero)' : 'var(--surface)',
                color: active === p ? '#fff' : 'var(--muted)',
                boxShadow: active === p ? 'var(--shadow)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: 100,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontSize: 13,
            cursor: 'pointer',
            color: 'var(--ink)'
          }}
        >
          <option value="distance">Sort by: Nearest First</option>
          <option value="rating">Sort by: Highest Rated</option>
          <option value="experience">Sort by: Most Experienced</option>
        </select>
      </div>

      {/* Results Count - Removed Register Button */}
      {!loading && allWorkers.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 48px 20px',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
            {lang === 'hi'
              ? <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> प्रोफेशनल मिले</>
              : <>Found <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> professional{filtered.length !== 1 ? 's' : ''} within {radius} km</>
            }
          </p>
          {/* Register button removed */}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Loading professionals...</p>
        </div>
      )}

      {error && (
        <div style={{
          margin: '0 48px 20px',
          padding: '16px',
          borderRadius: 12,
          background: '#fef2f2',
          color: '#dc2626',
          fontSize: 13
        }}>
          ❌ {error}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{
          padding: '0 48px 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 16
        }}>
          {filtered.map((w, i) => (
            <WorkerCard key={w._id || i} worker={w} delay={i * 0.06} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          margin: '0 48px 60px',
          background: 'var(--surface)',
          borderRadius: 24,
          border: '1px dashed var(--border)'
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>
            No professionals found within {radius} km
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            Try increasing the radius or changing your location
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleRadiusChange(50)} className="btn-outline">
              Increase to 50 km
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