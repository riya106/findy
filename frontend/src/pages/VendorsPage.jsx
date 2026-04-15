import { useEffect, useState } from "react"
import { vendorsAPI } from "../services/api"
import VendorCard from "../components/VendorCard"
import { useLang } from '../context/LanguageContext'
import { Link } from "react-router-dom"

export default function VendorsPage() {
  const { t, lang } = useLang()
  
  const [vendors, setVendors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getLive()
      const items = response.data?.data || []
      setVendors(items)
      setFiltered(items)
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError(lang === 'hi' ? 'विक्रेता लोड नहीं हो सके' : 'Could not load vendors')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-page)",
      paddingTop: 88
    }}>
      
      {/* ==================== BEAUTIFUL INDIAN-THEMED HEADER FOR VENDORS ==================== */}
      <div style={{ padding: "0 48px 28px" }}>
        <div style={{
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          minHeight: 360,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Background Image - Indian Market/Bazaar */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }} />
          
          {/* Gradient Overlay - Market/Commerce theme */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,184,146,0.85) 0%, rgba(5,146,114,0.75) 50%, rgba(255,153,51,0.4) 100%)',
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
          
          {/* Decorative dots */}
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
              <span style={{ fontSize: 20 }}>🏪</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#fff' }}>
                LOCAL VENDORS & SHOPS
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
              Find authentic street food, local shops, and services in your neighborhood
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
                  🏪
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{vendors.filter(v => v.isLive).length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Live Now</div>
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
                  🛍️
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{vendors.length}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Total Vendors</div>
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
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>5km</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Radius</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Register Button */}
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
              ? <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> विक्रेता लाइव हैं</>
              : <><strong style={{ color: 'var(--mint)' }}>{filtered.length}</strong> vendor{filtered.length !== 1 ? 's' : ''} live now</>
            }
          </div>
          
          <Link to="/vendor-register" style={{
            padding: "8px 20px",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 600,
            background: "var(--mint)",
            color: "#fff",
            textDecoration: "none",
            transition: "all 0.2s"
          }}>
            + {lang === 'hi' ? 'विक्रेता रजिस्टर करें' : 'Register as Vendor'}
          </Link>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Loading vendors...</p>
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

      {/* Vendors Grid */}
      {!loading && filtered.length > 0 && (
        <div style={{
          padding: '8px 48px 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((vendor, i) => (
            <VendorCard
              key={vendor._id || i}
              vendor={vendor}
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
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏪</div>
          <h3 style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 20,
            marginBottom: 8,
            color: "var(--ink)"
          }}>
            {lang === 'hi' ? 'कोई लाइव विक्रेता नहीं' : 'No live vendors'}
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
            {lang === 'hi'
              ? 'अभी कोई विक्रेता लाइव नहीं है। बाद में जांचें या विक्रेता बनें!'
              : 'No vendors are live right now. Check back later or become a vendor!'}
          </p>
          <Link to="/vendor-register" className="btn-primary" style={{ display: "inline-block" }}>
            {lang === 'hi' ? 'विक्रेता बनें' : 'Become a Vendor'}
          </Link>
        </div>
      )}
    </div>
  )
}