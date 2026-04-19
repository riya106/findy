import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorsAPI, reviewsAPI } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/authcontext';

export default function VendorDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { user } = useAuth();
  
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
      fetchVendorReviews();
    }
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      const response = await vendorsAPI.getById(id);
      setVendor(response.data.data);
    } catch (err) {
      console.error('Error fetching vendor:', err);
      setError(err.response?.data?.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorReviews = async () => {
    try {
      const response = await reviewsAPI.getForVendor(id);
      setReviews(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMessage({ type: '', text: '' });
    
    if (!user) {
      setReviewMessage({ 
        type: 'error', 
        text: lang === 'hi' ? 'कृपया समीक्षा लिखने के लिए लॉगिन करें' : 'Please login to leave a review' 
      });
      setTimeout(() => setReviewMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    if (!newReview.comment.trim()) {
      setReviewMessage({ 
        type: 'error', 
        text: lang === 'hi' ? 'कृपया एक टिप्पणी लिखें' : 'Please write a comment' 
      });
      setTimeout(() => setReviewMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    setSubmitting(true);
    try {
      const reviewData = {
        rating: parseInt(newReview.rating),
        comment: newReview.comment.trim(),
        vendorId: id
      };
      
      console.log('Submitting review:', reviewData);
      console.log('User:', user);
      
      const response = await reviewsAPI.addForVendor(reviewData);
      console.log('Review submitted successfully:', response.data);
      
      setNewReview({ rating: 5, comment: '' });
      setReviewMessage({ 
        type: 'success', 
        text: lang === 'hi' ? '✅ समीक्षा सफलतापूर्वक सबमिट हुई!' : '✅ Review submitted successfully!' 
      });
      
      // Refresh reviews and vendor data
      await fetchVendorReviews();
      await fetchVendorDetails();
      
      setTimeout(() => setReviewMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = lang === 'hi' ? '❌ समीक्षा सबमिट करने में विफल' : '❌ Failed to submit review';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setReviewMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setReviewMessage({ type: '', text: '' }), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const getOperatingStatus = () => {
    if (!vendor?.operatingHours?.length) {
      return { isOpen: false, message: lang === 'hi' ? 'समय निर्धारित नहीं' : 'Hours not set' };
    }
    
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    
    const todayHours = vendor.operatingHours.find(h => h.day === today);
    
    if (!todayHours || todayHours.isClosed) {
      return { isOpen: false, message: lang === 'hi' ? 'आज बंद है' : 'Closed today' };
    }
    
    if (!todayHours.open || !todayHours.close) {
      return { isOpen: false, message: lang === 'hi' ? 'समय उपलब्ध नहीं' : 'Hours not available' };
    }
    
    const [openHour, openMinute] = todayHours.open.split(':');
    const [closeHour, closeMinute] = todayHours.close.split(':');
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(openHour) * 60 + parseInt(openMinute);
    const closeTime = parseInt(closeHour) * 60 + parseInt(closeMinute);
    
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
          <p style={{ color: 'var(--muted)' }}>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div style={{ minHeight: '100vh', padding: '100px 40px', textAlign: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😞</div>
        <h2 style={{ color: 'var(--ink)' }}>{error || 'Vendor not found'}</h2>
        <Link to="/vendors" className="btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
          ← Back to Vendors
        </Link>
      </div>
    );
  }

  const status = getOperatingStatus();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-page)', paddingTop: 88 }}>
      {/* Cover Image Section */}
      <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
        <img
          src={vendor.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
          alt={vendor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, var(--bg))'
        }} />
        
        <Link to="/vendors" style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          padding: '8px 16px',
          borderRadius: 100,
          color: '#fff',
          textDecoration: 'none',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          ← {t('back')}
        </Link>
      </div>
      
      {/* Vendor Info Card */}
      <div style={{ maxWidth: 1000, margin: '-50px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '24px 28px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 28,
                marginBottom: 8,
                color: 'var(--ink)'
              }}>
                {vendor.name}
              </h1>
              
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="badge-mint">{vendor.shopType}</span>
                
                {vendor.isLive && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 10px',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 500,
                    background: '#dcfce7',
                    color: '#166534'
                  }}>
                    🟢 {t('live')}
                  </span>
                )}
                
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
              
              {vendor.address && (
                <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>📍</span> {vendor.address}
                </div>
              )}
              
              <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📞</span> {vendor.phone}
              </div>
            </div>
            
            {vendor.averageRating > 0 && (
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--mint)' }}>
                  {vendor.averageRating.toFixed(1)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {vendor.totalReviews} {lang === 'hi' ? 'समीक्षाएं' : 'reviews'}
                </div>
                <div style={{ fontSize: 20, marginTop: 4 }}>
                  {'★'.repeat(Math.round(vendor.averageRating))}
                  {'☆'.repeat(5 - Math.round(vendor.averageRating))}
                </div>
              </div>
            )}
          </div>
          
          {vendor.description && (
            <p style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              fontSize: 14,
              color: 'var(--muted)',
              lineHeight: 1.6
            }}>
              {vendor.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Tabs Section */}
      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '2px solid var(--border)',
          marginBottom: 24
        }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={tabStyle(activeTab === 'menu')}
          >
            <span>🍽️</span> {lang === 'hi' ? 'मेनू' : 'Menu'}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            style={tabStyle(activeTab === 'info')}
          >
            <span>ℹ️</span> {lang === 'hi' ? 'जानकारी' : 'Info'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={tabStyle(activeTab === 'reviews')}
          >
            <span>⭐</span> {lang === 'hi' ? 'समीक्षाएं' : 'Reviews'} ({reviews.length})
          </button>
        </div>
        
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            {vendor.menu && vendor.menu.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vendor.menu.map((item, idx) => (
                  <div key={item._id || idx} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h4 style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: 0 }}>
                          {item.name}
                        </h4>
                        {item.isAvailable === false && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#fee2e2', color: '#dc2626' }}>
                            {lang === 'hi' ? 'उपलब्ध नहीं' : 'Not Available'}
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#dcfce7', color: '#166534' }}>
                            🥬 Veg
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 16 }}>
                      <div style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: 'var(--mint)'
                      }}>
                        ₹{item.price}
                      </div>
                      {item.isAvailable !== false && (
                        <button
                          className="btn-primary"
                          style={{ padding: '4px 14px', fontSize: 11, marginTop: 8 }}
                          onClick={() => alert(`Added ${item.name} to cart!`)}
                        >
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
                <h3>{lang === 'hi' ? 'कोई मेनू आइटम नहीं' : 'No Menu Items'}</h3>
                <p>{lang === 'hi' ? 'इस विक्रेता ने अभी तक कोई मेनू नहीं जोड़ा है' : 'This vendor hasn\'t added any menu items yet'}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {vendor.operatingHours && vendor.operatingHours.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3>🕐 {lang === 'hi' ? 'खुलने का समय' : 'Operating Hours'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {vendor.operatingHours.map((hours, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ fontWeight: 600 }}>{hours.day}</span>
                      <span>{hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {vendor.features && vendor.features.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3>✨ {lang === 'hi' ? 'सुविधाएं' : 'Features'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {vendor.features.map((feature, idx) => (
                    <span key={idx} className="badge-mint">{feature}</span>
                  ))}
                </div>
              </div>
            )}
            
            {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)' }}>
                <h3>💳 {lang === 'hi' ? 'भुगतान के तरीके' : 'Payment Methods'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {vendor.paymentMethods.map((method, idx) => (
                    <span key={idx} className="badge-mint">{method}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, border: '1px solid var(--border)', textAlign: 'center' }}>
              <h3>📞 {lang === 'hi' ? 'संपर्क करें' : 'Contact Shop'}</h3>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={`tel:${vendor.phone}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                  📞 {lang === 'hi' ? 'कॉल करें' : 'Call Now'}
                </a>
                <a href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none' }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Reviews Tab - EXPLORER CAN SUBMIT REVIEWS HERE */}
        {activeTab === 'reviews' && (
          <div>
            {/* Review Message */}
            {reviewMessage.text && (
              <div style={{
                marginBottom: 20,
                padding: '12px 16px',
                borderRadius: 12,
                background: reviewMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: reviewMessage.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${reviewMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {reviewMessage.text}
              </div>
            )}

            {/* Review Submission Form - Only for logged-in explorers (not vendors) */}
            {user && user.role !== 'seller' && user.role !== 'vendor' && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                  ✍️ {lang === 'hi' ? 'अपनी समीक्षा लिखें' : 'Write a Review'}
                </h3>
                <form onSubmit={submitReview}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      {lang === 'hi' ? 'रेटिंग' : 'Rating'}
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="select"
                      style={{ width: 'auto', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)' }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ {lang === 'hi' ? 'बहुत अच्छा' : 'Excellent'}</option>
                      <option value={4}>⭐⭐⭐⭐ {lang === 'hi' ? 'अच्छा' : 'Good'}</option>
                      <option value={3}>⭐⭐⭐ {lang === 'hi' ? 'औसत' : 'Average'}</option>
                      <option value={2}>⭐⭐ {lang === 'hi' ? 'खराब' : 'Poor'}</option>
                      <option value={1}>⭐ {lang === 'hi' ? 'बहुत खराब' : 'Terrible'}</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      {lang === 'hi' ? 'टिप्पणी' : 'Comment'}
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="input"
                      rows="4"
                      placeholder={lang === 'hi' ? 'अपना अनुभव साझा करें...' : 'Share your experience...'}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submitting}
                    style={{ padding: '12px 24px', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}
                  >
                    {submitting ? (lang === 'hi' ? 'सबमिट हो रहा...' : 'Submitting...') : (lang === 'hi' ? 'समीक्षा सबमिट करें' : 'Submit Review')}
                  </button>
                </form>
              </div>
            )}
            
            {/* Show login prompt for non-logged in users */}
            {!user && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
                <p style={{ marginBottom: 16 }}>{lang === 'hi' ? 'समीक्षा लिखने के लिए लॉगिन करें' : 'Login to write a review'}</p>
                <Link to="/login" className="btn-primary" style={{ display: 'inline-block' }}>
                  {lang === 'hi' ? 'लॉगिन करें' : 'Login'}
                </Link>
              </div>
            )}
            
            {/* Show message for vendors (they can't review their own shop) */}
            {user && (user.role === 'seller' || user.role === 'vendor') && (
              <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
                <p style={{ marginBottom: 16 }}>{lang === 'hi' ? 'आप अपनी खुद की दुकान की समीक्षा नहीं कर सकते' : 'You cannot review your own shop'}</p>
              </div>
            )}
            
            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map((review, idx) => (
                  <div key={review._id || idx} style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{review.user?.name || review.userName || 'Anonymous'}</span>
                        <div style={{ fontSize: 14, marginTop: 4 }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US') : 'Recently'}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                <h3 style={{ marginBottom: 8 }}>{lang === 'hi' ? 'अभी तक कोई समीक्षा नहीं' : 'No reviews yet'}</h3>
                <p style={{ color: 'var(--muted)' }}>
                  {lang === 'hi' ? 'बनें पहले समीक्षक!' : 'Be the first to review!'}
                </p>
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