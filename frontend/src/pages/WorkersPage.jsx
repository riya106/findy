import { useEffect, useState } from 'react'
import { workersAPI } from '../services/api'
import WorkerCard from '../components/WorkerCard'
import { useLang } from '../context/LanguageContext'
import { Link } from 'react-router-dom'

const PROFESSIONS_EN = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mechanic', 'Cleaner']
const PROFESSIONS_HI = ['सभी', 'इलेक्ट्रीशियन', 'प्लम्बर', 'बढ़ई', 'पेंटर', 'मैकेनिक', 'सफाईकर्मी']

export default function WorkersPage() {
  const { t, lang } = useLang()

  const [workers, setWorkers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const PROFESSIONS = lang === 'hi' ? PROFESSIONS_HI : PROFESSIONS_EN
  const EN_PROFESSIONS = PROFESSIONS_EN

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      const response = await workersAPI.getAll()
      const workersData = response.data?.data || response.data || []
      setWorkers(workersData)
      setFiltered(workersData)
    } catch (err) {
      console.error('Error fetching workers:', err)
      setError(lang === 'hi' ? 'कामगार लोड नहीं हो सके' : 'Could not load workers.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = (f, idx) => {
    setActive(f)
    const filterVal = EN_PROFESSIONS[idx]
    if (filterVal === 'All' || f === 'सभी') {
      setFiltered(workers)
    } else {
      setFiltered(workers.filter(
        w => w.profession?.toLowerCase() === filterVal.toLowerCase()
      ))
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      
      {/* ==================== BEAUTIFUL INDIAN-THEMED HEADER FOR WORKERS ==================== */}
      <div style={{ padding: '0 48px 32px' }}>
        <div style={{
          borderRadius: 28,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 360,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Background Image - Indian skilled workers / craftsmanship */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }} />
          
          {/* Gradient Overlay - Warm earthy tones for workers */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(210, 120, 40, 0.85) 0%, rgba(230, 100, 30, 0.75) 50%, rgba(15,184,146,0.4) 100%)',
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
          
          {/* Tool/Work inspired decorative elements */}
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
              <span style={{ fontSize: 20 }}>👷</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                SKILLED PROFESSIONALS
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
              Find Local<br />
              <span style={{ 
                color: '#FFD700', 
                borderBottom: '4px solid #FFD700', 
                display: 'inline-block',
                paddingBottom: '4px'
              }}>
                Skilled Workers
              </span>
            </h1>
            
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 500,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              Hire trusted electricians, plumbers, carpenters and more from your neighborhood
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
                  👷
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{workers.length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Workers Available</div>
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
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>10+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Professions</div>
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
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>4.8+</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 48px 28px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {PROFESSIONS.map((p, idx) => (
          <button
            key={p}
            onClick={() => applyFilter(p, idx)}
            style={{
              padding: '10px 22px',
              borderRadius: 100,
              fontSize: 14,
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

      {/* Results Count & Register Button */}
      {!loading && workers.length > 0 && (
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
              ? <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> कर्मचारी मिले</>
              : <>Showing <strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> worker{filtered.length !== 1 ? 's' : ''}</>
            }
          </p>
          <Link to="/worker-register" style={{
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 100,
            background: 'rgba(16,185,129,0.1)',
            color: 'var(--mint)',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            + {lang === 'hi' ? 'कर्मचारी रजिस्टर करें' : 'Register as Worker'}
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Loading workers...</p>
        </div>
      )}

      {/* Error State */}
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

      {/* Workers Grid */}
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

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          margin: '0 48px 60px',
          background: 'var(--surface)',
          borderRadius: 24,
          border: '1px dashed var(--border)'
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔧</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>
            {lang === 'hi' ? 'कोई कर्मचारी नहीं मिला' : 'No workers found'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            {lang === 'hi'
              ? 'अभी कोई कर्मचारी पंजीकृत नहीं है'
              : 'No workers registered yet'}
          </p>
          <Link to="/worker-register" className="btn-primary" style={{ display: 'inline-block' }}>
            {lang === 'hi' ? 'पहले कर्मचारी बनें' : 'Be the first worker'}
          </Link>
        </div>
      )}
    </div>
  )
}