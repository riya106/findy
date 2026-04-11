import { useState, useEffect } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { workersAPI } from '../services/api'
import { Link } from 'react-router-dom'

const PROFESSION_EMOJI = {
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Carpenter': '🪚',
  'Painter': '🎨',
  'Mechanic': '🔩',
  'Cleaner': '🧹',
  'Mason': '🧱',
  'Welder': '🔥',
  'AC Technician': '❄️',
  'Other': '👷',
  // Hindi mappings
  'इलेक्ट्रीशियन': '⚡',
  'प्लम्बर': '🔧',
  'बढ़ई': '🪚',
  'पेंटर': '🎨',
  'मैकेनिक': '🔩',
  'सफाईकर्मी': '🧹',
  'राजमिस्त्री': '🧱',
  'वेल्डर': '🔥',
  'AC तकनीशियन': '❄️',
  'अन्य': '👷',
}

export default function WorkerDashboardPage() {
  const { user } = useAuth()
  const { t, lang } = useLang()
  const [workerProfile, setWorkerProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await workersAPI.getAll()
      const all = res.data?.workers || []
      const mine = all.find(w =>
        w.phone === user?.phone ||
        w.name?.toLowerCase() === user?.name?.toLowerCase()
      )
      setWorkerProfile(mine || null)
    } catch (e) {
      console.log("Error fetching worker profile", e)
    } finally {
      setLoading(false)
    }
  }

  const emoji = PROFESSION_EMOJI[workerProfile?.profession] || "👷"

  const stats = [
    {
      val: workerProfile?.experience ? `${workerProfile.experience}yrs` : "—",
      label: lang === 'hi' ? 'अनुभव' : 'Experience',
      icon: "📅",
    },
    {
      val: workerProfile?.profession || "—",
      label: lang === 'hi' ? 'पेशा' : 'Profession',
      icon: "🛠️",
    },
    {
      val: workerProfile ? "✅" : "❌",
      label: lang === 'hi' ? 'प्रोफ़ाइल स्थिति' : 'Profile Status',
      icon: "👤",
    },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--gradient-page)",
      paddingTop: 72
    }}>
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <div
        style={{
          backgroundImage: "url('https://russiaspivottoasia.com/wp-content/uploads/2025/07/India-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "25% 30%",
          backgroundRepeat: "no-repeat",
          padding: "60px 60px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.35))"
          }}
        />

        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 24
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 100,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              color: "#a7f3d0",
              marginBottom: 20,
              backdropFilter: "blur(8px)"
            }}>
              👷 {lang === 'hi' ? 'कर्मचारी डैशबोर्ड' : 'WORKER DASHBOARD'}
            </div>

            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 42,
              color: "#fff",
              margin: "0 0 10px",
              lineHeight: 1.1
            }}>
              {lang === 'hi' ? 'वापस स्वागत है' : 'Welcome back'} <br />
              <span style={{ color: "#6ee7b7" }}>
                {user?.name?.split(" ")[0] || (lang === 'hi' ? 'कर्मचारी' : 'Worker')} 👋
              </span>
            </h1>

            <p style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 450
            }}>
              {lang === 'hi' 
                ? 'अपना प्रोफ़ाइल प्रबंधित करें और स्थानीय ग्राहकों द्वारा खोजे जाएं'
                : 'Manage your profile and get discovered by local clients'}
            </p>
          </div>

          {/* Profile Pill */}
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20,
            padding: "20px 28px",
            textAlign: "center",
            minWidth: 160,
            backdropFilter: "blur(8px)"
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {emoji}
            </div>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff"
            }}>
              {workerProfile?.profession || (lang === 'hi' ? 'सेट नहीं' : 'Not set')}
            </div>
            <div style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)"
            }}>
              {workerProfile
                ? `${workerProfile.experience} ${lang === 'hi' ? 'साल का अनुभव' : 'years exp'}`
                : (lang === 'hi' ? 'अपना प्रोफ़ाइल पूरा करें' : 'Complete your profile')}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 60px 80px"
      }}>
        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>{t('loading')}</p>
          </div>
        )}

        {/* STATS CARDS */}
        {!loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 32
          }}>
            {stats.map(({ val, label, icon }) => (
              <div key={label} style={{
                background: "var(--card-bg)",
                borderRadius: 24,
                padding: "28px 20px",
                textAlign: "center",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {icon}
                </div>
                <div style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  color: "var(--mint)",
                  marginBottom: 6
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  fontWeight: 500
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Card (when profile exists) */}
        {!loading && workerProfile && (
          <div style={{
            background: "var(--card-bg)",
            borderRadius: 24,
            padding: 32,
            marginBottom: 32,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 24
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: "var(--gradient-hero)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40
              }}>
                {emoji}
              </div>
              <div>
                <h2 style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 24,
                  marginBottom: 4,
                  color: "var(--ink)"
                }}>
                  {workerProfile.name}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>
                  {workerProfile.profession} • {workerProfile.experience} {lang === 'hi' ? 'साल का अनुभव' : 'years experience'}
                </p>
              </div>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24
            }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>📞 {t('auth.phone')}</div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>{workerProfile.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>📍 {lang === 'hi' ? 'स्थान' : 'Location'}</div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {workerProfile.location?.lat 
                    ? `${workerProfile.location.lat?.toFixed(3)}, ${workerProfile.location.lng?.toFixed(3)}`
                    : (lang === 'hi' ? 'सेट नहीं' : 'Not set')}
                </div>
              </div>
            </div>

            <Link to="/worker-register" style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 100,
              background: "var(--gradient-hero)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}>
              ✏️ {lang === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile'}
            </Link>
          </div>
        )}

        {/* No Profile CTA */}
        {!loading && !workerProfile && (
          <div style={{
            background: "var(--gradient-card)",
            borderRadius: 24,
            padding: 48,
            textAlign: "center",
            marginBottom: 32,
            border: "2px dashed var(--border)"
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👷</div>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 24,
              marginBottom: 8,
              color: "var(--ink)"
            }}>
              {lang === 'hi' ? 'प्रोफ़ाइल सेट नहीं है' : 'Profile not set up yet'}
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>
              {lang === 'hi'
                ? 'स्थानीय ग्राहकों द्वारा खोजे जाने के लिए अपना कर्मचारी प्रोफ़ाइल पूरा करें'
                : 'Complete your worker profile to get discovered by local clients'}
            </p>
            <Link to="/worker-register" style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 100,
              background: "var(--gradient-hero)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}>
              👷 {lang === 'hi' ? 'प्रोफ़ाइल सेट करें' : 'Set Up Profile'}
            </Link>
          </div>
        )}

        {/* How It Works Section */}
        <div style={{
          background: "var(--card-bg)",
          borderRadius: 24,
          padding: 32,
          marginBottom: 32,
          border: "1px solid var(--border)"
        }}>
          <h3 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 20,
            marginBottom: 20,
            color: "var(--ink)"
          }}>
            🚀 {lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20
          }}>
            {[
              { icon: "👤", step: "01", title: lang === 'hi' ? 'प्रोफ़ाइल पूरा करें' : 'Complete Profile', desc: lang === 'hi' ? 'अपना पेशा, अनुभव और स्थान जोड़ें' : 'Add your profession, experience and location' },
              { icon: "🔍", step: "02", title: lang === 'hi' ? 'खोजे जाएं' : 'Get Discovered', desc: lang === 'hi' ? 'आपके आस-पास के खोजकर्ता आपको देख सकते हैं' : 'Explorers near you can see your profile' },
              { icon: "🤝", step: "03", title: lang === 'hi' ? 'काम पाएं' : 'Get Hired', desc: lang === 'hi' ? 'ग्राहक सीधे संपर्क करते हैं' : 'Clients reach out and hire you' },
              { icon: "⭐", step: "04", title: lang === 'hi' ? 'प्रतिष्ठा बनाएं' : 'Build Reputation', desc: lang === 'hi' ? 'काम पूरा करें और रेटिंग प्राप्त करें' : 'Complete jobs and get ratings' },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: "var(--mint-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 12px"
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: 11, color: "var(--mint)", fontWeight: 700, marginBottom: 4 }}>
                  {lang === 'hi' ? 'चरण' : 'STEP'} {item.step}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <h2 style={{
          fontFamily: "Syne, sans-serif",
          marginBottom: 16,
          color: "var(--ink)"
        }}>
          {lang === 'hi' ? 'त्वरित कार्रवाई' : 'Quick Actions'}
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20
        }}>
          {[
            { 
              icon: "🔍", 
              title: lang === 'hi' ? 'कर्मचारी देखें' : 'Browse Workers', 
              desc: lang === 'hi' ? 'अपने आस-पास के अन्य कर्मचारी देखें' : 'See other workers near you',
              link: "/workers" 
            },
            { 
              icon: "✏️", 
              title: lang === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile', 
              desc: lang === 'hi' ? 'अपने कौशल और जानकारी संपादित करें' : 'Edit your skills & info',
              link: "/worker-register" 
            },
            { 
              icon: "👤", 
              title: lang === 'hi' ? 'मेरा खाता' : 'My Account', 
              desc: lang === 'hi' ? 'अपना खाता प्रबंधित करें' : 'Manage your account',
              link: "/profile" 
            },
          ].map(card => (
            <Link
              key={card.title}
              to={card.link}
              style={{
                textDecoration: "none",
                background: "var(--card-bg)",
                borderRadius: 24,
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.borderColor = "var(--mint)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "var(--border)"
              }}
            >
              <div style={{ fontSize: 36 }}>{card.icon}</div>
              <h3 style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                margin: 0,
                color: "var(--ink)"
              }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}