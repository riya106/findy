import { useState, useEffect } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { listingsAPI, reviewsAPI } from '../services/api'

function ReviewCard({ review }) {
  const { t } = useLang()
  const stars = Math.min(5, Math.max(1, Math.round(review.rating ?? 5)))
  
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ marginBottom: 10 }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{
            fontSize: 18,
            color: i < stars ? '#f59e0b' : 'var(--border)'
          }}>★</span>
        ))}
        <span style={{
          marginLeft: 8, fontSize: 12,
          color: 'var(--muted)', fontWeight: 600
        }}>
          {stars}/5
        </span>
      </div>

      <p style={{
        fontSize: 14,
        color: 'var(--ink)',
        lineHeight: 1.6,
        marginBottom: 14,
        fontStyle: 'italic'
      }}>
        "{review.comment}"
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--mint)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13
          }}>
            {(review.user?.name || review.name || 'A')[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
            {review.user?.name || review.name || 'Anonymous'}
          </span>
        </div>

        {review.listingTitle && (
          <span style={{
            fontSize: 11,
            background: 'var(--mint-soft)',
            color: 'var(--mint)',
            padding: '3px 10px',
            borderRadius: 100,
            fontWeight: 500
          }}>
            {review.listingTitle}
          </span>
        )}
      </div>
    </div>
  )
}

export default function VendorReviewsPage() {
  const { user } = useAuth()
  const { t, lang } = useLang()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchAllReviews()
  }, [])

  const fetchAllReviews = async () => {
    try {
      const res = await listingsAPI.getAll()
      const all = res.data?.data || []
      const userId = user?.id || user?._id
      const mine = all.filter(l => String(l.sellerId) === String(userId))

      const allReviews = []
      for (const listing of mine) {
        const r = await reviewsAPI.getForListing(listing._id)
        const listingReviews = (r.data?.data || []).map(rev => ({
          ...rev,
          listingTitle: listing.title
        }))
        allReviews.push(...listingReviews)
      }
      setReviews(allReviews)
    } catch (e) {
      console.log('Error fetching reviews', e)
    } finally {
      setLoading(false)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const FILTERS = lang === 'hi' ? ['सभी', '5★', '4★', '3★', '2★', '1★'] : ['All', '5★', '4★', '3★', '2★', '1★']

  const filtered = filter === 'All' || filter === 'सभी'
    ? reviews
    : reviews.filter(r => Math.round(r.rating) === parseInt(filter))

  return (
    <div style={{
      background: 'var(--gradient-page)',
      minHeight: '100vh',
      padding: '88px 24px 60px',
      maxWidth: 720,
      margin: '0 auto'
    }}>
      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700, fontSize: 28, marginBottom: 4,
        color: 'var(--ink)'
      }}>
        ⭐ {lang === 'hi' ? 'मेरी समीक्षाएं' : 'My Reviews'}
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
        {lang === 'hi' ? 'खोजकर्ता आपकी दुकान के बारे में क्या कह रहे हैं' : 'What explorers are saying about your shop'}
      </p>

      {reviews.length > 0 && (
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '24px 28px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800, fontSize: 56,
              color: 'var(--mint)', lineHeight: 1
            }}>
              {avgRating}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              out of 5
            </div>
          </div>

          <div style={{
            width: 1, height: 60,
            background: 'var(--border)'
          }} />

          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{
                  color: i < Math.round(avgRating) ? '#f59e0b' : 'var(--border)'
                }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {lang === 'hi' ? 'आधारित' : 'Based on'} <strong>{reviews.length}</strong> {reviews.length === 1 ? (lang === 'hi' ? 'समीक्षा' : 'review') : (lang === 'hi' ? 'समीक्षाएं' : 'reviews')}
            </div>

            <div style={{ marginTop: 10 }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => Math.round(r.rating) === star).length
                const pct = reviews.length ? (count / reviews.length) * 100 : 0
                return (
                  <div key={star} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 8, marginBottom: 3
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)', width: 16 }}>{star}★</span>
                    <div style={{
                      flex: 1, height: 6, borderRadius: 100,
                      background: 'var(--border)', overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: 'var(--mint)',
                        borderRadius: 100,
                        transition: 'width 0.5s'
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', width: 16 }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div style={{
          display: 'flex', gap: 8,
          marginBottom: 20, flexWrap: 'wrap'
        }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 100,
              fontSize: 12, cursor: 'pointer',
              border: `1px solid ${filter === f ? 'var(--mint)' : 'var(--border)'}`,
              background: filter === f ? 'var(--mint)' : 'var(--surface)',
              color: filter === f ? '#fff' : 'var(--muted)',
              fontWeight: filter === f ? 600 : 400,
              transition: 'all 0.2s'
            }}>
              {f}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>{t('loading')}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          textAlign: 'center',
          padding: '60px 24px'
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⭐</div>
          <h3 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 18, marginBottom: 8,
            color: 'var(--ink)'
          }}>
            {lang === 'hi' ? 'अभी तक कोई समीक्षा नहीं' : 'No reviews yet'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {lang === 'hi' ? 'समीक्षाएं यहां दिखेंगी' : 'Reviews will appear here once explorers rate your listings'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px',
          color: 'var(--muted)', fontSize: 14
        }}>
          {lang === 'hi' ? 'कोई समीक्षा नहीं मिली' : 'No reviews found'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((r, i) => (
            <ReviewCard key={r._id || i} review={r} />
          ))}
        </div>
      )}
    </div>
  )
}