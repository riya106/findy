import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { workersAPI } from '../services/api'
import WorkerCard from '../components/WorkerCard'
import { useLang } from '../context/LanguageContext'

const PROFESSIONS_EN = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mechanic', 'Cleaner']
const PROFESSIONS_HI = ['सभी', 'इलेक्ट्रीशियन', 'प्लंबर', 'बढ़ई', 'पेंटर', 'मैकेनिक', 'सफाईकर्मी']

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
    workersAPI.getAll()
      .then(({ data }) => {
        const items = data?.workers ?? data ?? []
        setWorkers(items)
        setFiltered(items)
      })
      .catch(() => setError(lang === 'hi' ? 'कामगार लोड नहीं हो सके।' : 'Could not load workers.'))
      .finally(() => setLoading(false))
  }, [lang])

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
      {/* HEADER WITH BACKGROUND IMAGE */}
      <div style={{ padding: '0 48px 32px' }}>
        <div style={{
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 220,
          boxShadow: 'var(--shadow)',
        }}>
          {/* Background image - Skilled worker/construction theme */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }} />

          {/* Dark gradient overlay - left side darker for text readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)',
          }} />

          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)'
          }} />
          <div style={{
            position: 'absolute', bottom: -30, right: 150,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)'
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, padding: '40px 36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 100, padding: '4px 14px',
              fontSize: 12, fontWeight: 600, marginBottom: 12,
              backdropFilter: 'blur(8px)', color: '#fff'
            }}>
              👷 {lang === 'hi' ? 'कुशल पेशेवर' : 'Skilled Professionals'}
            </div>
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800, fontSize: 36,
              margin: '0 0 8px', color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {lang === 'hi' ? 'स्थानीय कर्मचारी खोजें' : 'Find Local Workers'}
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', margin: 0, maxWidth: 500 }}>
              {lang === 'hi' 
                ? 'अपने आस-पास कुशल पेशेवरों को काम पर रखें'
                : 'Hire skilled professionals near you'}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{
        display: 'flex', gap: 8,
        padding: '0 48px 28px',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {PROFESSIONS.map((p, idx) => (
          <button
            key={p}
            onClick={() => applyFilter(p, idx)}
            style={{
              padding: '10px 22px', borderRadius: 100,
              fontSize: 14, fontWeight: active === p ? 600 : 500,
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
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

      {/* CONTENT */}
      <div style={{ padding: '0 48px 60px' }}>
        {/* Stats bar */}
        {!loading && workers.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 20,
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
              fontSize: 13, fontWeight: 600,
              padding: '8px 18px', borderRadius: 100,
              background: 'rgba(16,185,129,0.1)',
              color: 'var(--mint)',
              textDecoration: 'none',
              border: '1px solid var(--border)',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'var(--mint)'
              e.target.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(16,185,129,0.1)'
              e.target.style.color = 'var(--mint)'
            }}>
              + {lang === 'hi' ? 'कर्मचारी रजिस्टर करें' : 'Register as Worker'}
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ fontSize: 15 }}>
              {lang === 'hi' ? 'कर्मचारी लोड हो रहे हैं…' : 'Loading workers…'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            padding: '16px', borderRadius: 12,
            background: '#fef2f2', color: '#dc2626',
            border: '1px solid #fca5a5', marginBottom: 20
          }}>
            {error}
          </div>
        )}

        {/* Workers Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 16
          }}>
            {filtered.map((w, i) => (
              <WorkerCard key={w._id ?? i} worker={w} delay={i * 0.06} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'var(--surface)',
            borderRadius: 24, 
            border: '1px dashed var(--border)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔧</div>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700, fontSize: 20, marginBottom: 8,
              color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'कोई कर्मचारी नहीं मिला' : 'No workers found'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
              {lang === 'hi'
                ? `${active !== 'सभी' ? active : ''} में अभी कोई कर्मचारी पंजीकृत नहीं है`
                : `No ${active !== 'All' ? active : ''} workers registered yet`
              }
            </p>
            <Link to="/worker-register" style={{
              display: 'inline-block', padding: '13px 32px',
              borderRadius: 100, border: 'none',
              background: 'var(--gradient-hero)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
              boxShadow: 'var(--shadow)',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
              👷 {lang === 'hi' ? 'पहले कर्मचारी बनें' : 'Be the first worker'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}