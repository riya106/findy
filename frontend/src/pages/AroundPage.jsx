import { useEffect, useState } from "react"
import { aroundAPI } from "../services/api"
import { useGeolocation } from "../hooks/useGeolocation"
import { useAddress } from "../hooks/useAddress"
import { useLang } from '../context/LanguageContext'

const CATEGORIES_EN = ["All", "Park", "Cafe", "Restaurant", "Hospital", "Shop", "Game Zone"]
const CATEGORIES_HI = ["सभी", "पार्क", "कैफे", "रेस्तरां", "अस्पताल", "दुकान", "गेम ज़ोन"]

const PLACE_EMOJI = {
  park: '🌳',
  cafe: '☕',
  restaurant: '🍽️',
  hospital: '🏥',
  shop: '🛍️',
  'game zone': '🎮',
  default: '📍',
}

function PlaceCard({ place }) {
  const { lang } = useLang()
  const lat = place.location?.coordinates?.[1] ?? place.location?.lat
  const lng = place.location?.coordinates?.[0] ?? place.location?.lng
  const address = useAddress(lat, lng)

  const emoji = PLACE_EMOJI[place.type?.toLowerCase()] ?? PLACE_EMOJI.default

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: 'var(--shadow)',
      transition: 'all 0.2s'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'var(--mint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26
      }}>
        {emoji}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 4,
          color: 'var(--ink)'
        }}>
          {place.name}
        </div>

        <div style={{
          fontSize: 12,
          color: 'var(--mint)',
          fontWeight: 600,
          background: 'var(--mint-soft)',
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 100,
          marginBottom: 6
        }}>
          {place.type}
        </div>

        <div style={{
          fontSize: 12,
          color: 'var(--mint)',
          fontWeight: 500
        }}>
          📍 {address}
        </div>
      </div>
    </div>
  )
}

export default function AroundPage() {
  const { t, lang } = useLang()
  const CATEGORIES = lang === 'hi' ? CATEGORIES_HI : CATEGORIES_EN
  const EN_CATEGORIES = CATEGORIES_EN

  const { coords, loading: geoLoading, error: geoError, getLocation } = useGeolocation()
  const userAddress = useAddress(coords?.lat, coords?.lng)

  const [places, setPlaces] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (!coords) return

    setLoading(true)

    aroundAPI.getNearby(coords.lat, coords.lng)
      .then(({ data }) => {
        const items = data?.places ?? data ?? []
        const safeItems = Array.isArray(items) ? items : []
        setPlaces(safeItems)
        setFiltered(safeItems)
      })
      .catch(() => setError(t('around.loadingError') || "Could not load nearby places."))
      .finally(() => setLoading(false))
  }, [coords, t])

  const applyFilter = (category, idx) => {
    setActive(category)
    const filterVal = EN_CATEGORIES[idx]
    if (filterVal === "All" || category === "सभी") {
      setFiltered(places)
    } else {
      setFiltered(
        places.filter(
          p => p.type?.toLowerCase() === filterVal.toLowerCase()
        )
      )
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      {/* HEADER WITH BACKGROUND IMAGE */}
      <div style={{ padding: "0 48px 28px" }}>
        <div
          style={{
            backgroundImage: "url('https://www.ies.edu/architecture/wp-content/uploads/2017/08/541924_473494436012522_1952442337_n.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "50% 70%",
            backgroundRepeat: "no-repeat",
            borderRadius: 24,
            padding: "80px 36px",
            minHeight: "300px",
            color: "#fff",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Dark overlay for better text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))"
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 100,
                padding: "4px 14px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
                backdropFilter: "blur(8px)"
              }}
            >
              📍 {t('around.title')}
            </div>

            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 36,
                margin: "0 0 8px"
              }}
            >
              {t('around.title')}
            </h1>

            <p style={{ fontSize: 15, opacity: 0.95 }}>
              {coords
                ? `📍 ${userAddress}`
                : t('around.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* LOCATION STATUS */}
      {geoLoading && (
        <div style={{
          margin: '0 48px 20px',
          padding: '12px 16px',
          borderRadius: 12,
          background: '#fffbeb',
          border: '1px solid #fde68a',
          fontSize: 13,
          color: '#92400e'
        }}>
          📍 {t('around.detecting')}
        </div>
      )}

      {geoError && (
        <div style={{
          margin: '0 48px 20px',
          padding: '12px 16px',
          borderRadius: 12,
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          fontSize: 13,
          color: '#dc2626'
        }}>
          ❌ {t('around.geoError')}{geoError}
        </div>
      )}

      {/* FILTERS */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '0 48px 28px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {CATEGORIES.map((c, idx) => (
          <button
            key={c}
            onClick={() => applyFilter(c, idx)}
            style={{
              padding: '10px 22px',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: active === c ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: active === c
                ? 'var(--gradient-hero)'
                : 'var(--surface)',
              color: active === c ? '#fff' : 'var(--muted)',
              boxShadow: active === c ? 'var(--shadow)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '0 48px 60px' }}>
        {/* Loading State */}
        {(loading || geoLoading) && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px',
            color: 'var(--muted)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>{geoLoading ? t('around.detecting') : t('around.loading')}</p>
          </div>
        )}

        {/* Error State */}
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
            {error}
          </div>
        )}

        {/* Places Grid */}
        {!loading && !geoLoading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16
          }}>
            {filtered.map((p, i) => (
              <PlaceCard key={p._id || i} place={p} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !geoLoading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'var(--surface)',
            borderRadius: 24,
            border: '1px dashed var(--border)'
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>
              {coords ? '🔍' : '📍'}
            </div>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
              color: 'var(--ink)'
            }}>
              {coords ? t('around.empty') : t('around.noLocation')}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {coords
                ? (lang === 'hi' ? 'कोई जगह नहीं मिली' : 'No places found nearby')
                : (lang === 'hi' ? 'लोकेशन एक्सेस दें' : 'Allow location access to discover places around you')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}