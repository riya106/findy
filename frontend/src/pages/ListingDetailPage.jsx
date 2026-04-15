import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsAPI, reviewsAPI } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/authcontext';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0); // Add this

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  // Separate useEffect for fetching reviews that triggers on refresh
  useEffect(() => {
    fetchReviews();
  }, [id, reviewRefreshTrigger]);

  const fetchListingDetails = async () => {
    try {
      const response = await listingsAPI.getById(id);
      setListing(response.data?.data || response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for listing:', id);
      const response = await reviewsAPI.getForListing(id);
      console.log('Reviews response:', response);
      const reviewsData = response.data?.data || response.data || [];
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    
    if (!newReview.comment.trim()) {
      alert('Please write a comment');
      return;
    }
    
    setSubmitting(true);
    try {
      console.log('Submitting review:', {
        rating: newReview.rating,
        comment: newReview.comment,
        listingId: id
      });
      
      await reviewsAPI.add({
        rating: newReview.rating,
        comment: newReview.comment,
        listingId: id
      });
      
      setNewReview({ rating: 5, comment: '' });
      
      // Trigger refresh by incrementing the counter
      setReviewRefreshTrigger(prev => prev + 1);
      
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getOperatingStatus = () => {
    if (!listing?.operatingHours?.length) {
      return { isOpen: true, message: lang === 'hi' ? 'समय निर्धारित नहीं' : 'Hours not set' };
    }
    
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    
    const todayHours = listing.operatingHours.find(h => h.day === today);
    
    if (!todayHours || todayHours.isClosed) {
      return { isOpen: false, message: lang === 'hi' ? 'आज बंद है' : 'Closed today' };
    }
    
    if (!todayHours.open || !todayHours.close) {
      return { isOpen: true, message: lang === 'hi' ? 'खुला है' : 'Open' };
    }
    
    const [openHour, openMinute] = todayHours.open.split(':');
    const [closeHour, closeMinute] = todayHours.close.split(':');
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(openHour) * 60 + parseInt(openMinute || '0');
    const closeTime = parseInt(closeHour) * 60 + parseInt(closeMinute || '0');
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      isOpen,
      message: isOpen 
        ? `${lang === 'hi' ? 'खुला है' : 'Open'} • ${todayHours.open} - ${todayHours.close}`
        : `${lang === 'hi' ? 'बंद है' : 'Closed'} • ${todayHours.open} - ${todayHours.close}`
    };
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ minHeight: '100vh', padding: '100px 20px', textAlign: 'center', background: 'var(--bg)' }}>
        <h2>{error || 'Listing not found'}</h2>
        <Link to="/listings" style={{ color: 'var(--mint)' }}>← Back to Listings</Link>
      </div>
    );
  }

  const status = getOperatingStatus();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-page)', paddingTop: 88 }}>
      {/* Cover Image */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img
          src={listing.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, var(--bg))'
        }} />
        
        <Link to="/listings" style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          padding: '8px 16px',
          borderRadius: 100,
          color: '#fff',
          textDecoration: 'none',
          fontSize: 14
        }}>
          ← {t('back')}
        </Link>
      </div>
      
      {/* Listing Info Card */}
      <div style={{ maxWidth: 1000, margin: '-60px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '28px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 32,
                marginBottom: 12,
                color: 'var(--ink)'
              }}>
                {listing.title}
              </h1>
              
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="badge-mint">{listing.category}</span>
                
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 500,
                  background: status.isOpen ? '#dcfce7' : '#fee2e2',
                  color: status.isOpen ? '#166534' : '#991b1b'
                }}>
                  {status.isOpen ? '🟢' : '🔴'} {status.message}
                </span>
              </div>
              
              {listing.address && (
                <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📍</span> {listing.address}
                </div>
              )}
              
              {listing.phone && (
                <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📞</span> {listing.phone}
                </div>
              )}
            </div>
            
            {/* Rating */}
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--mint)', fontFamily: 'Syne, sans-serif' }}>
                {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : 'NEW'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {listing.totalReviews} {lang === 'hi' ? 'समीक्षाएं' : 'reviews'}
              </div>
              {listing.averageRating > 0 && (
                <div style={{ fontSize: 16, marginTop: 4 }}>
                  {'★'.repeat(Math.round(listing.averageRating))}
                  {'☆'.repeat(5 - Math.round(listing.averageRating))}
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          <p style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            fontSize: 15,
            color: 'var(--muted)',
            lineHeight: 1.7
          }}>
            {listing.description}
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '2px solid var(--border)',
          marginBottom: 24,
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={tabStyle(activeTab === 'menu')}
          >
            🍽️ {lang === 'hi' ? 'मेनू' : 'Menu'}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            style={tabStyle(activeTab === 'info')}
          >
            ℹ️ {lang === 'hi' ? 'जानकारी' : 'Info'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={tabStyle(activeTab === 'reviews')}
          >
            ⭐ {lang === 'hi' ? 'समीक्षाएं' : 'Reviews'} ({reviews.length})
          </button>
        </div>
        
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            {listing.menu && listing.menu.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {listing.menu.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{item.name}</h4>
                        {item.isVegetarian && <span style={{ fontSize: 12 }}>🥬</span>}
                        {!item.isAvailable && <span style={{ fontSize: 11, color: '#dc2626' }}>Sold Out</span>}
                      </div>
                      {item.description && (
                        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{item.description}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--mint)' }}>₹{item.price}</div>
                      {item.isAvailable && (
                        <button className="btn-primary" style={{ padding: '4px 12px', fontSize: 11, marginTop: 6 }}>
                          {lang === 'hi' ? 'ऑर्डर करें' : 'Order'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
                <p>{lang === 'hi' ? 'कोई मेनू उपलब्ध नहीं' : 'No menu available'}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Operating Hours */}
            {listing.operatingHours && listing.operatingHours.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)' }}>🕐 {lang === 'hi' ? 'खुलने का समय' : 'Operating Hours'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {listing.operatingHours.map((hours, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontWeight: 600 }}>{hours.day}</span>
                      <span>{hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)' }}>✨ {lang === 'hi' ? 'सुविधाएं' : 'Features'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {listing.features.map((feature, idx) => (
                    <span key={idx} className="badge-mint">{feature}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Payment Methods */}
            {listing.paymentMethods && listing.paymentMethods.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)' }}>💳 {lang === 'hi' ? 'भुगतान के तरीके' : 'Payment Methods'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {listing.paymentMethods.map((method, idx) => (
                    <span key={idx} className="badge-mint">{method}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)' }}>📞 {lang === 'hi' ? 'संपर्क करें' : 'Contact'}</h3>
              {listing.phone && (
                <>
                  <a href={`tel:${listing.phone}`} className="btn-primary" style={{ display: 'inline-block', marginRight: 12 }}>
                    📞 Call Now
                  </a>
                  <a href={`https://wa.me/${listing.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-block' }}>
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {/* Add Review Form */}
            {user && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>✍️ {lang === 'hi' ? 'अपनी समीक्षा लिखें' : 'Write a Review'}</h3>
                <form onSubmit={submitReview}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="select"
                      style={{ width: 'auto' }}
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Terrible</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="input"
                      rows="3"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
            
            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map((review, idx) => (
                  <div key={review._id || idx} style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{review.user?.name || 'Anonymous'}</span>
                        <div style={{ fontSize: 14, marginTop: 4 }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                <p>{lang === 'hi' ? 'अभी तक कोई समीक्षा नहीं' : 'No reviews yet'}</p>
                {!user && (
                  <p>
                    <Link to="/login" style={{ color: 'var(--mint)' }}>Login</Link> to be the first reviewer!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const tabStyle = (isActive) => ({
  padding: '10px 24px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? 'var(--mint)' : 'var(--muted)',
  borderBottom: isActive ? `2px solid var(--mint)` : 'none',
  marginBottom: -2,
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: 8
});