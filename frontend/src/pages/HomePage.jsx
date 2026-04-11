import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authcontext"
import { useLang } from "../context/LanguageContext"
import { listingsAPI, vendorsAPI } from "../services/api"

const NAV_CARDS_EN = [
  { to: "/listings", title: "Listings", desc: "Browse local services & shops", icon: "📋" },
  { to: "/vendors", title: "Vendors", desc: "Find live vendors near you", icon: "🏪" },
  { to: "/workers", title: "Workers", desc: "Hire skilled professionals", icon: "👷" },
  { to: "/around", title: "Around", desc: "Explore places near you", icon: "📍" }
]

const NAV_CARDS_HI = [
  { to: "/listings", title: "लिस्टिंग", desc: "स्थानीय सेवाएं और दुकानें देखें", icon: "📋" },
  { to: "/vendors", title: "विक्रेता", desc: "पास के लाइव विक्रेता खोजें", icon: "🏪" },
  { to: "/workers", title: "कर्मचारी", desc: "कुशल पेशेवरों को काम पर रखें", icon: "👷" },
  { to: "/around", title: "आस-पास", desc: "अपने आस-पास की जगहें खोजें", icon: "📍" }
]

export default function HomePage() {
  const { user } = useAuth()
  const { t, lang } = useLang()

  const NAV_CARDS = lang === 'hi' ? NAV_CARDS_HI : NAV_CARDS_EN

  const [listings, setListings] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listingsAPI.getAll(),
      vendorsAPI.getLive()
    ])
    .then(([l, v]) => {
      const listingsData = Array.isArray(l.data?.data) ? l.data.data : []
      const vendorsData = Array.isArray(v.data?.data) ? v.data.data : []
      setListings(listingsData.slice(0, 5)) // Show only first 5 listings
      setVendors(vendorsData.slice(0, 5)) // Show only first 5 vendors
    })
    .catch((err) => {
      console.error("API Error:", err)
    })
    .finally(() => setLoading(false))
  }, [])

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return lang === 'hi' ? 'सुप्रभात' : 'Good Morning'
    if (hour < 18) return lang === 'hi' ? 'शुभ अपराह्न' : 'Good Afternoon'
    return lang === 'hi' ? 'शुभ संध्या' : 'Good Evening'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      <div style={{ padding: "0 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Welcome Header */}
        <div style={{
          background: 'var(--gradient-hero)',
          borderRadius: 24,
          padding: "40px",
          marginBottom: 32,
          color: "#fff",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)"
          }} />
          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)"
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 42px)",
              marginBottom: 8
            }}>
              {getGreeting()}, {user?.name?.split(' ')[0] || (lang === 'hi' ? 'खोजकर्ता' : 'Explorer')}! 👋
            </h1>
            <p style={{
              fontSize: 16,
              opacity: 0.9,
              maxWidth: 500
            }}>
              {lang === 'hi' 
                ? 'आज आप क्या ढूंढ रहे हैं?'
                : 'What are you looking for today?'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px',
            color: 'var(--muted)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>{t('loading')}</p>
          </div>
        )}

        {/* Navigation Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "48px"
        }}>
          {NAV_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="card"
              style={{
                padding: "28px 24px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div style={{
                fontSize: 42,
                background: 'var(--mint-soft)',
                width: 70,
                height: 70,
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </div>
              <div>
                <h3 style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 4,
                  color: 'var(--ink)'
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'var(--muted)',
                  margin: 0
                }}>
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Listings Section */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'ट्रेंडिंग लिस्टिंग' : 'Trending Listings'} 🔥
            </h2>
            <Link to="/listings" style={{
              fontSize: 13,
              color: 'var(--mint)',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              {t('seeAll')} →
            </Link>
          </div>

          {listings.length === 0 && !loading && (
            <div className="card" style={{
              padding: "40px",
              textAlign: "center",
              color: 'var(--muted)'
            }}>
              {lang === 'hi' ? 'कोई लिस्टिंग नहीं मिली' : 'No listings found'}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {listings.map((l) => (
              <Link
                key={l._id}
                to={`/listings/${l._id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <div className="card" style={{
                  padding: "18px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.borderColor = "var(--mint)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.borderColor = "var(--border)"
                }}>
                  <div>
                    <h4 style={{
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 4,
                      color: 'var(--ink)'
                    }}>
                      {l.title || (lang === 'hi' ? 'शीर्षकहीन' : 'Untitled')}
                    </h4>
                    <p style={{
                      fontSize: 12,
                      color: 'var(--muted)'
                    }}>
                      {l.category || l.type || (lang === 'hi' ? 'स्थानीय' : 'Local')}
                    </p>
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--mint)',
                    fontWeight: 600
                  }}>
                    {lang === 'hi' ? 'देखें →' : 'View →'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Vendors Section */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'लाइव विक्रेता' : 'Live Vendors'} 🟢
            </h2>
            <Link to="/vendors" style={{
              fontSize: 13,
              color: 'var(--mint)',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              {t('seeAll')} →
            </Link>
          </div>

          {vendors.length === 0 && !loading && (
            <div className="card" style={{
              padding: "40px",
              textAlign: "center",
              color: 'var(--muted)'
            }}>
              {lang === 'hi' ? 'कोई लाइव विक्रेता नहीं' : 'No live vendors found'}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {vendors.map((v) => (
              <Link
                key={v._id}
                to="/vendors"
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <div className="card" style={{
                  padding: "18px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.borderColor = "var(--mint)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.borderColor = "var(--border)"
                }}>
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4
                    }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--mint)",
                        display: "inline-block"
                      }} />
                      <h4 style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: 'var(--ink)'
                      }}>
                        {v.name}
                      </h4>
                    </div>
                    <p style={{
                      fontSize: 12,
                      color: 'var(--muted)'
                    }}>
                      {v.shopType || (lang === 'hi' ? 'दुकान' : 'Shop')}
                    </p>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--mint)',
                    background: 'var(--mint-soft)',
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontWeight: 600
                  }}>
                    {t('live')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Vendor CTA for non-vendors */}
        {user?.role !== 'seller' && user?.role !== 'worker' && (
          <div className="card" style={{
            background: 'var(--gradient-card)',
            padding: "32px",
            textAlign: "center",
            border: "2px solid var(--mint)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
              color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'क्या आप एक विक्रेता हैं?' : 'Are you a vendor?'}
            </h3>
            <p style={{
              fontSize: 14,
              color: 'var(--muted)',
              marginBottom: 20
            }}>
              {lang === 'hi' 
                ? 'अपनी दुकान रजिस्टर करें और पास के खोजकर्ताओं तक पहुंचें'
                : 'Register your shop and reach nearby explorers'}
            </p>
            <Link to="/vendor-register" className="btn-primary">
              {lang === 'hi' ? 'दुकान रजिस्टर करें' : 'Register Your Shop'} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}