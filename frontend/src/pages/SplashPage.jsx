import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLang } from '../context/LanguageContext'
import Footer from '../components/Footer'
import LanguageToggle from '../components/Languagetoggle'
import ThemeToggle from '../components/ThemeToggle'

// ==================== FIXED HINDI TEXT (Proper Unicode) ====================
const STEPS_EN = [
  { num: '01', icon: '🗺️', heading: 'Open Findy', desc: 'Launch the app and let it sense your location — instantly see what is alive around you.' },
  { num: '02', icon: '🔍', heading: 'Browse & Discover', desc: 'Filter by food, workers, live vendors. Every result is real, local, and near.' },
  { num: '03', icon: '🤝', heading: 'Connect & Go', desc: 'Message directly, read community reviews, get directions. Discovery becomes connection.' },
  { num: '04', icon: '⭐', heading: 'Rate & Share', desc: 'Leave reviews, save favourites, share hidden gems. Together we map authenticity.' },
]

const STEPS_HI = [
  { num: '01', icon: '🗺️', heading: 'फिंडी खोलें', desc: 'ऐप खोलें और अपनी लोकेशन दें — तुरंत देखें आपके आस-पास क्या हो रहा है।' },
  { num: '02', icon: '🔍', heading: 'ब्राउज़ करें और खोजें', desc: 'खाना, कर्मचारी, लाइव विक्रेता — हर परिणाम असली, स्थानीय और नज़दीक है।' },
  { num: '03', icon: '🤝', heading: 'जुड़ें और जाएं', desc: 'सीधे मैसेज करें, समीक्षाएं पढ़ें, रास्ता पाएं। खोज बन जाती है कनेक्शन।' },
  { num: '04', icon: '⭐', heading: 'रेट करें और शेयर करें', desc: 'समीक्षा दें, पसंदीदा सेव करें, छुपे हुए रत्न शेयर करें। साथ मिलकर बनाएं असली नक्शा।' },
]

const FEATURES_EN = [
  { num: '01', title: 'Real-time Location Broadcast', desc: 'Vendors go live with one tap. Geolocation places them on the discovery feed for everyone nearby, instantly.' },
  { num: '02', title: 'Community Reviews', desc: 'Ratings from real neighbours. Not inflated, not anonymous — trusted local opinions.' },
  { num: '03', title: 'Skill Marketplace', desc: 'Electricians, plumbers, painters — find skilled workers by proximity and profession instantly.' },
  { num: '04', title: 'No Algorithms. Pure Discovery.', desc: 'No paid placements, no hidden boosts. Your distance is the only ranking factor. Local wins.' },
]

const FEATURES_HI = [
  { num: '01', title: 'रीयल-टाइम लोकेशन ब्रॉडकास्ट', desc: 'विक्रेता एक टैप में लाइव हो जाते हैं। जियोलोकेशन उन्हें तुरंत पास के सभी लोगों के फीड में दिखाता है।' },
  { num: '02', title: 'समुदाय की समीक्षाएं', desc: 'असली पड़ोसियों की रेटिंग। न बढ़ा-चढ़ाकर, न गुमनाम — भरोसेमंद स्थानीय राय।' },
  { num: '03', title: 'स्किल मार्केटप्लेस', desc: 'इलेक्ट्रीशियन, प्लम्बर, पेंटर — नज़दीकी कुशल कर्मचारी तुरंत खोजें।' },
  { num: '04', title: 'कोई एल्गोरिदम नहीं। शुद्ध खोज।', desc: 'कोई पेड प्लेसमेंट नहीं, कोई छुपा बूस्ट नहीं। दूरी ही एकमात्र रैंकिंग फैक्टर है। लोकल जीतता है।' },
]

const CARDS_EN = [
  { title: 'Food Stalls', desc: 'Authentic street food, local dhabas, and neighbourhood cafes you won\'t find on delivery apps.', tag: 'Eat local', icon: '🍜' },
  { title: 'Electricians', desc: 'Verified, rated, available. Hire skilled electricians within minutes of your location.', tag: 'Hire now', icon: '⚡' },
  { title: 'Parks & Places', desc: 'Discover parks, hidden courtyards, game zones, and cultural spots no map app highlights.', tag: 'Explore', icon: '🌳' },
  { title: 'Plumbers', desc: 'Community-vetted plumbers with real reviews from your actual neighbours.', tag: 'Hire now', icon: '🔧' },
  { title: 'Local Shops', desc: 'Boutique stores, family-run businesses, and specialty shops — all going live on Findy.', tag: 'Shop local', icon: '🛍️' },
  { title: 'Health & Care', desc: 'Clinics, pharmacies, and wellness centres within walking distance, mapped in real time.', tag: 'Stay safe', icon: '🏥' },
]

const CARDS_HI = [
  { title: 'खाने के स्टॉल', desc: 'असली स्ट्रीट फूड, स्थानीय ढाबे और मोहल्ले के कैफे जो डिलीवरी ऐप्स पर नहीं मिलते।', tag: 'लोकल खाएं', icon: '🍜' },
  { title: 'इलेक्ट्रीशियन', desc: 'वेरिफाइड, रेटेड, उपलब्ध। अपनी लोकेशन से मिनटों में कुशल इलेक्ट्रीशियन किराए पर लें।', tag: 'अभी किराए लें', icon: '⚡' },
  { title: 'पार्क और जगहें', desc: 'पार्क, छुपे हुए आंगन, गेम ज़ोन और कल्चरल स्पॉट खोजें जो कोई मैप ऐप नहीं दिखाता।', tag: 'खोजें', icon: '🌳' },
  { title: 'प्लम्बर', desc: 'कम्युनिटी-वेटेड प्लम्बर आपके असली पड़ोसियों की रियल समीक्षाओं के साथ।', tag: 'अभी किराए लें', icon: '🔧' },
  { title: 'लोकल दुकानें', desc: 'बुटीक, परिवार द्वारा चलाए जाने वाले बिजनेस और स्पेशलिटी शॉप्स — सभी फिंडी पर लाइव आ रहे हैं।', tag: 'लोकल खरीदें', icon: '🛍️' },
  { title: 'स्वास्थ्य और देखभाल', desc: 'क्लीनिक, फार्मेसी और वेलनेस सेंटर पैदल दूरी पर, रियल टाइम में मैप किए गए।', tag: 'सुरक्षित रहें', icon: '🏥' },
]

export default function SplashPage() {
  const { t, lang } = useLang()
  const revealRef = useScrollReveal()
  const pinnedRef = useRef(null)
  const splitRef = useRef(null)
  const pbarRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [featureVisible, setFeatureVisible] = useState(false)

  const STEPS = lang === 'hi' ? STEPS_HI : STEPS_EN
  const FEATURES = lang === 'hi' ? FEATURES_HI : FEATURES_EN
  const CARDS = lang === 'hi' ? CARDS_HI : CARDS_EN

  // Progress bar
  useEffect(() => {
    const onScroll = () => {
      const st = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      if (pbarRef.current) pbarRef.current.style.width = (st / max * 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Pinned section driver with better step detection
  useEffect(() => {
    const onScroll = () => {
      const el = pinnedRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      const totalScroll = el.offsetHeight - window.innerHeight
      const prog = Math.min(0.99, Math.max(0, scrolled / totalScroll))
      const stepIndex = Math.min(STEPS.length - 1, Math.floor(prog * STEPS.length))
      setActiveStep(stepIndex)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [STEPS.length])

  // Feature visibility on scroll
  useEffect(() => {
    const onScroll = () => {
      const featureSection = document.querySelector('.feature-section')
      if (featureSection) {
        const rect = featureSection.getBoundingClientRect()
        setFeatureVisible(rect.top < window.innerHeight * 0.85)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Split-text word lighter with proper Hindi support
  useEffect(() => {
    const el = splitRef.current
    if (!el) return
    const raw = el.textContent || ''
    const words = raw.split(/\s+/).filter(Boolean)
    el.innerHTML = words.map((w, i) => {
      const isAccent = w === 'bridges' || w === 'पाटता' || w === 'जोड़ता' || w === 'करता'
      return `<span class="split-word${isAccent ? ' accent' : ''}" data-i="${i}">${w}</span>`
    }).join(' ')

    const spans = [...el.querySelectorAll('.split-word')]
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const prog = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)))
      const lit = Math.floor(prog * spans.length * 1.6)
      spans.forEach((s, idx) => s.classList.toggle('lit', idx < lit))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lang])

  // Counter animation
  useEffect(() => {
    let done = false
    const counters = document.querySelectorAll('[data-count]')
    const onScroll = () => {
      if (done) return
      const first = counters[0]
      if (!first) return
      if (first.getBoundingClientRect().top < window.innerHeight * 0.85) {
        done = true
        counters.forEach(el => {
          const target = +el.dataset.count
          const start = performance.now()
          const dur = 1600
          const tick = (now) => {
            const p = Math.min(1, (now - start) / dur)
            const ease = 1 - Math.pow(1 - p, 3)
            el.textContent = Math.round(ease * target).toLocaleString()
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroWords = lang === 'hi' 
    ? [
        { words: ['खोजें'], delay: [0.3] },
        { words: ['जो है', 'पास'], delay: [0.45, 0.55] },
        { words: ['आपके।'], delay: [0.65] },
      ]
    : [
        { words: ['Find'], delay: [0.3] },
        { words: ["what's", 'near'], delay: [0.45, 0.55] },
        { words: ['you.'], delay: [0.65] },
      ]

  const marqueeItems = lang === 'hi'
    ? ['फिंडी', '·', 'विक्रेता', '·', 'कर्मचारी', '·', 'खोजें', '·', 'पास में', '·',
       'फिंडी', '·', 'विक्रेता', '·', 'कर्मचारी', '·', 'खोजें', '·', 'पास में', '·']
    : ['Findy', '·', 'Vendors', '·', 'Workers', '·', 'Discover', '·', 'Near You', '·',
       'Findy', '·', 'Vendors', '·', 'Workers', '·', 'Discover', '·', 'Near You', '·']

  return (
    <div ref={revealRef} style={{ fontFamily: "'DM Sans', 'Noto Sans Devanagari', sans-serif", background: 'var(--bg)' }}>
      <div className="progress-bar" ref={pbarRef} style={{
        position: 'fixed', top: 0, left: 0, height: '3px',
        background: 'var(--mint)', width: '0%', zIndex: 1000,
        transition: 'width 0.1s ease-out'
      }} />

      {/* Floating Theme & Language Toggles */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 100,
        display: 'flex',
        gap: 12,
      }}>
        <ThemeToggle />
        <LanguageToggle />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 40px 80px',
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg)'
      }}>
        <div style={{ 
          position: 'absolute', width: 520, height: 520, borderRadius: '50%', 
          background: 'var(--mint)', opacity: 0.05, top: -180, right: -120, 
          pointerEvents: 'none' 
        }} />
        <div style={{ 
          position: 'absolute', width: 320, height: 320, borderRadius: '50%', 
          background: 'var(--mint)', opacity: 0.06, bottom: -80, left: -80, 
          pointerEvents: 'none' 
        }} />

        <div style={{
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: 0, transform: 'translateY(20px)',
          animation: 'fadeUp 0.8s 0.2s forwards',
        }}>
          <span style={{ display: 'block', width: 32, height: 1, background: 'var(--muted)' }} />
          {t('splash.locationTag')}
          <span style={{ display: 'block', width: 32, height: 1, background: 'var(--muted)' }} />
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(56px, 11vw, 128px)',
          lineHeight: 0.9, letterSpacing: '-0.04em',
          color: 'var(--ink)', marginBottom: 0,
        }}>
          {heroWords.map((line, li) => (
            <span key={li} style={{ display: 'block', overflow: 'hidden' }}>
              {line.words.map((w, wi) => (
                <span key={wi} style={{
                  display: 'inline-block',
                  color: w === "what's" || w === "जो है" ? 'var(--mint)' : 'var(--ink)',
                  marginRight: wi < line.words.length - 1 ? '0.25em' : 0,
                  opacity: 0, transform: 'translateY(110%)',
                  animation: `wordUp 0.9s cubic-bezier(0.16,1,0.3,1) ${line.delay[wi]}s forwards`,
                }}>{w}</span>
              ))}
            </span>
          ))}
        </h1>

        <p style={{
          fontSize: 16, color: 'var(--muted)', maxWidth: 380,
          lineHeight: 1.65, marginTop: 40,
          opacity: 0, animation: 'fadeUp 0.8s 0.9s forwards',
        }}>
          {t('splash.subtext')}
        </p>

        <div style={{
          display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center',
          opacity: 0, animation: 'fadeUp 0.8s 1.1s forwards',
        }}>
          <Link to="/home" className="btn-primary" style={{ fontSize: 15, padding: '14px 30px' }}>
            {t('splash.exploreBtn')}
          </Link>
          <Link to="/signup" className="btn-outline" style={{ fontSize: 15, padding: '14px 30px' }}>
            {t('splash.joinBtn')}
          </Link>
        </div>

        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0, animation: 'fadeUp 0.8s 1.4s forwards',
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {t('splash.scrollHint')}
          </span>
          <div style={{ width: 1, height: 52, background: 'var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div className="scroll-line" style={{
              position: 'absolute', inset: 0,
              animation: 'scrollPulse 2s ease-in-out infinite'
            }} />
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════ */}
      <div style={{
        padding: '28px 0',
        borderTop: '1px solid var(--line)', 
        borderBottom: '1px solid var(--line)',
        background: 'var(--surface)',
        overflow: 'hidden'
      }}>
        <div className="marquee-track" style={{
          display: 'flex', gap: 48, whiteSpace: 'nowrap',
          animation: 'marquee 20s linear infinite'
        }}>
          {marqueeItems.map((item, i) => (
            <span key={i} style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 28,
              color: item === '·' ? 'var(--mint)' : 
                     (item === 'Findy' || item === 'फिंडी' || item === 'Discover' || item === 'खोजें') ? 'var(--ink)' : 'transparent',
              WebkitTextStroke: (item === '·' || item === 'Findy' || item === 'फिंडी' || item === 'Discover' || item === 'खोजें') ? 'none' : '1px var(--border)',
              letterSpacing: '-0.02em', flexShrink: 0,
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ══ REVEAL SECTION 1 ═══════════════════════════════════════ */}
      <section style={{ padding: '120px 40px', background: 'var(--bg)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 60, alignItems: 'center', maxWidth: 960, margin: '0 auto',
        }}>
          <div>
            <div className="section-label sr" style={{ marginBottom: 16, fontSize: 12, letterSpacing: '0.2em', color: 'var(--mint)', textTransform: 'uppercase' }}>
              {t('splash.forExplorers')}
            </div>
            <h2 style={{ 
              fontFamily: 'Syne, sans-serif', fontWeight: 700, 
              fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.03em', 
              lineHeight: 1.05, marginBottom: 20, color: 'var(--ink)'
            }}>
              {lang === 'hi' ? 'आपका शहर।\nपूरी तरह खोजा हुआ।' : 'Your city.\nFully explored.'}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
              {t('splash.cityDesc')}
            </p>
            <Link to="/home" className="btn-primary">
              {t('splash.startExploring')}
            </Link>
          </div>
          <div className="card" style={{
            aspectRatio: '4/3', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 12,
            background: 'var(--mint-soft)', borderRadius: 24,
          }}>
            <div style={{ fontSize: 52 }}>📍</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: 15 }}>
              {lang === 'hi' ? '12 जगहें पास में' : '12 places nearby'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {lang === 'hi' ? '800 मीटर के भीतर' : 'within 800m'}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PINNED SCROLL STEPS (FIXED HINDI RENDERING) ════════════════════ */}
      <section ref={pinnedRef} style={{ minHeight: '400vh', position: 'relative', background: 'var(--surface)' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', 
          borderTop: '1px solid var(--line)', 
          borderBottom: '1px solid var(--line)',
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 700, padding: '0 40px', textAlign: 'center', minHeight: 400 }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 40px',
                  opacity: activeStep === i ? 1 : activeStep > i ? 0 : 0,
                  transform: activeStep === i ? 'scale(1)' : activeStep > i ? 'scale(0.95)' : 'scale(1.05)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: activeStep === i ? 'auto' : 'none'
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 20 }}>{step.icon}</div>
                <div className="section-label" style={{ marginBottom: 14, fontSize: 12, letterSpacing: '0.2em', color: 'var(--mint)' }}>
                  {t('splash.step')} {step.num}
                </div>
                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(36px, 7vw, 76px)',
                  letterSpacing: '-0.04em', lineHeight: 0.95, 
                  marginBottom: 20, color: 'var(--ink)',
                }}>{step.heading}</h2>
                <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 460, lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}

            {/* Step indicators */}
            <div style={{
              position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 12,
            }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const el = pinnedRef.current
                    if (el) {
                      const stepHeight = el.offsetHeight / STEPS.length
                      window.scrollTo({
                        top: el.offsetTop + (i * stepHeight),
                        behavior: 'smooth'
                      })
                    }
                  }}
                  style={{
                    height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
                    background: activeStep === i ? 'var(--mint)' : 'var(--border)',
                    width: activeStep === i ? 32 : 8,
                    transition: 'width 0.3s, background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SPLIT TEXT ════════════════════════════════════════════ */}
      

      {/* ══ HORIZONTAL CARDS ══════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 'clamp(28px, 4vw, 42px)',
          letterSpacing: '-0.02em',
          padding: '0 40px', marginBottom: 36,
          color: 'var(--ink)'
        }}>
         
        </h2>
        <div style={{
          display: 'flex', gap: 20, padding: '0 40px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
        }}>
          {CARDS.map((card, i) => (
            <div key={i} className="card" style={{
              flex: '0 0 288px', scrollSnapAlign: 'start', padding: 28,
              background: 'var(--surface)', borderRadius: 24,
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 36, marginBottom: 18 }}>{card.icon}</div>
              <div style={{ 
                fontFamily: 'Syne, sans-serif', fontWeight: 700, 
                fontSize: 20, letterSpacing: '-0.02em', 
                marginBottom: 10, color: 'var(--ink)'
              }}>
                {card.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
                {card.desc}
              </p>
              <span className="badge-mint" style={{
                display: 'inline-block', padding: '4px 12px',
                background: 'var(--mint-soft)', borderRadius: 20,
                fontSize: 12, color: 'var(--mint)'
              }}>{card.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ REVEAL SECTION 2 — VENDORS ════════════════════════════ */}
      <section style={{ padding: '120px 40px', background: 'var(--bg)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 60, alignItems: 'center', maxWidth: 960, margin: '0 auto',
        }}>
          <div className="card" style={{
            aspectRatio: '4/3', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: 12,
            background: 'var(--mint-soft)', borderRadius: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot" style={{
                display: 'inline-block', width: 10, height: 10,
                borderRadius: '50%', background: '#ff4444',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
                {lang === 'hi' ? 'आप लाइव हैं' : 'You are Live'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {lang === 'hi' ? '38 लोग पास में देख सकते हैं' : '38 people nearby can see you'}
            </div>
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: 16, fontSize: 12, letterSpacing: '0.2em', color: 'var(--mint)', textTransform: 'uppercase' }}>
              {t('splash.forVendors')}
            </div>
            <h2 style={{ 
              fontFamily: 'Syne, sans-serif', fontWeight: 700, 
              fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.03em', 
              lineHeight: 1.05, marginBottom: 20, color: 'var(--ink)'
            }}>
              {t('splash.goLiveHeading')}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
              {t('splash.goLiveDesc')}
            </p>
            <Link to="/vendor-register" className="btn-primary">
              {t('splash.registerShop')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FEATURE LIST (with scroll animation) ═══════════════════════════ */}
      <section className="feature-section" style={{ padding: '60px 40px 100px', maxWidth: 900, margin: '0 auto', background: 'var(--bg)' }}>
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="feat-item"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 32,
              padding: '32px 0',
              borderBottom: i < FEATURES.length - 1 ? '1px solid var(--line)' : 'none',
              opacity: featureVisible ? 1 : 0,
              transform: featureVisible ? 'translateX(0)' : 'translateX(-30px)',
              transition: `opacity 0.7s ${i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
            }}
          >
            <div style={{ 
              fontFamily: 'Syne, sans-serif', fontWeight: 700, 
              fontSize: 13, color: 'var(--mint)', width: 28, 
              flexShrink: 0, paddingTop: 3 
            }}>
              {f.num}
            </div>
            <div>
              <div style={{ 
                fontFamily: 'Syne, sans-serif', fontWeight: 700, 
                fontSize: 22, letterSpacing: '-0.02em', 
                marginBottom: 8, color: 'var(--ink)'
              }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section style={{ 
        padding: '140px 40px', textAlign: 'center', 
        background: 'var(--ink)', position: 'relative', overflow: 'hidden' 
      }}>
        <div style={{ 
          position: 'absolute', width: 600, height: 600, borderRadius: '50%', 
          background: 'var(--mint)', opacity: 0.07, top: -200, left: '50%', 
          transform: 'translateX(-50%)', pointerEvents: 'none' 
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(40px, 8vw, 90px)',
            letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 32,
            color: 'var(--bg)',
          }}>
            {t('splash.ctaHeading')}
          </h2>
          <p style={{ 
            fontSize: 16, color: 'rgba(255,255,255,0.45)', 
            maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.65 
          }}>
            {t('splash.ctaSub')}
          </p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: '16px 36px', background: 'white', color: 'var(--ink)' }}>
            {t('splash.ctaBtn')}
          </Link>
        </div>
      </section>

      <div style={{ background: 'var(--ink)' }}>
        <Footer />
      </div>

      <style>{`
        @keyframes wordUp { 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes fadeUp { 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(30px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .btn-primary {
          display: inline-block;
          background: var(--mint);
          color: white;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        .btn-outline {
          display: inline-block;
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--border);
          border-radius: 40px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-outline:hover {
          border-color: var(--mint);
          color: var(--mint);
        }
        .card {
          background: var(--surface);
          border-radius: 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--border);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--mint);
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}