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
      {/* HERO HEADER WITH INDIAN STREET VENDOR IMAGE */}
      <div style={{ padding: "0 48px 0" }}>
        <div style={{
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          height: 280,
          marginBottom: 28
        }}>
          {/* Indian street vendor image */}
          <img
            src="https://images.unsplash.com/photo-1598514983318-2f64f8f4796c"
            alt="Indian street vendor"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* Dark overlay for text readability */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))"
          }} />

          {/* Hero Text */}
          <div style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "#fff"
          }}>
            <div style={{
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
            }}>
              🇮🇳 {lang === 'hi' ? 'स्थानीय विक्रेता खोजें' : 'Discover Local Vendors'}
            </div>
            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 36,
              margin: "0 0 8px"
            }}>
              {t('listings.title')}
            </h1>
            <p style={{ fontSize: 15, opacity: 0.95 }}>
              {lang === 'hi' 
                ? 'अपने आस-पास स्ट्रीट फूड, दुकानें और सेवाएं खोजें'
                : 'Explore street food, shops & services near you'}
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