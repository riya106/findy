import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workersAPI } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/authcontext';

export default function WorkerDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const { user } = useAuth();
  
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [showContact, setShowContact] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', jobTitle: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorker();
    }
  }, [id]);

  const fetchWorker = async () => {
    try {
      const response = await workersAPI.getById(id);
      const workerData = response.data?.data || response.data;
      setWorker(workerData);
    } catch (err) {
      console.error('Error fetching worker:', err);
      setError('Failed to load worker details');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    
    setSubmitting(true);
    try {
      await workersAPI.addReview(id, {
        rating: newReview.rating,
        comment: newReview.comment,
        jobTitle: newReview.jobTitle
      });
      setNewReview({ rating: 5, comment: '', jobTitle: '' });
      fetchWorker();
      alert('Review submitted successfully!');
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p>Loading worker details...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div style={{ minHeight: '100vh', padding: '100px 20px', textAlign: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😞</div>
        <h2>{error || 'Worker not found'}</h2>
        <Link to="/workers" style={{ color: 'var(--mint)' }}>← Back to Workers</Link>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'W';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-page)', paddingTop: 88 }}>
      
      {/* Hero Section with Cover Image */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img
          src={worker.coverImage || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200'}
          alt={worker.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
        }} />
        
        <Link to="/workers" style={{
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
          gap: 6,
          zIndex: 2
        }}>
          ← Back to Workers
        </Link>
      </div>

      {/* Profile Card - Floating */}
      <div style={{ maxWidth: 1000, margin: '-80px auto 0', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '30px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {/* Profile Image */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'var(--gradient-hero)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                color: '#fff',
                boxShadow: '0 8px 25px rgba(15,184,146,0.3)',
                border: '4px solid var(--mint)',
              }}>
                {getInitials(worker.name)}
              </div>
              <div style={{ marginTop: 12 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 16px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  background: worker.isAvailable ? '#dcfce7' : '#fee2e2',
                  color: worker.isAvailable ? '#166534' : '#991b1b'
                }}>
                  {worker.isAvailable ? '🟢 Available Now' : '🔴 Currently Busy'}
                </span>
              </div>
            </div>

            {/* Worker Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 36,
                marginBottom: 8,
                color: 'var(--ink)'
              }}>
                {worker.name}
              </h1>
              
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="badge-mint" style={{ fontSize: 14, padding: '6px 14px' }}>
                  👷 {worker.profession}
                </span>
                <span className="badge-mint" style={{ fontSize: 14, padding: '6px 14px' }}>
                  ⭐ {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'} ({worker.totalReviews || 0} reviews)
                </span>
                <span className="badge-mint" style={{ fontSize: 14, padding: '6px 14px' }}>
                  📅 {worker.experience || worker.experienceYears} years experience
                </span>
                {worker.hourlyRate > 0 && (
                  <span className="badge-mint" style={{ fontSize: 14, padding: '6px 14px', background: 'var(--mint)', color: '#fff' }}>
                    💰 ₹{worker.hourlyRate}/hour
                  </span>
                )}
              </div>
              
              {worker.address && (
                <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>📍</span> {worker.address}
                </div>
              )}
              
              {worker.totalJobsCompleted > 0 && (
                <div style={{ fontSize: 14, color: 'var(--mint)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✅</span> {worker.totalJobsCompleted} jobs completed • {worker.hireCount} happy clients
                </div>
              )}
            </div>

            {/* Contact Button */}
            <div>
              <button
                onClick={() => setShowContact(!showContact)}
                className="btn-primary"
                style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                📞 Contact Now
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          {showContact && (
            <div style={{
              marginTop: 24,
              padding: 20,
              background: 'var(--mint-soft)',
              borderRadius: 16,
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ marginBottom: 16, color: 'var(--ink)' }}>Contact Details</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {worker.phone && (
                  <a href={`tel:${worker.phone}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    📞 Call {worker.phone}
                  </a>
                )}
                {worker.phone && (
                  <a href={`https://wa.me/${worker.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    💬 WhatsApp
                  </a>
                )}
                {worker.email && (
                  <a href={`mailto:${worker.email}`} className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    ✉️ Email
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Description */}
          {worker.description && (
            <p style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              fontSize: 15,
              color: 'var(--muted)',
              lineHeight: 1.7
            }}>
              {worker.description}
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
          marginBottom: 24,
          overflowX: 'auto'
        }}>
          {[
            { id: 'about', label: 'About & Skills', icon: '👤' },
            { id: 'portfolio', label: 'Portfolio', icon: '📷' },
            { id: 'availability', label: 'Availability', icon: '🕐' },
            { id: 'reviews', label: 'Reviews', icon: '⭐' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? 'var(--mint)' : 'var(--muted)',
                borderBottom: activeTab === tab.id ? `2px solid var(--mint)` : 'none',
                marginBottom: -2,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>{tab.icon}</span> {tab.label} {tab.id === 'reviews' && `(${worker.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Service Areas */}
            {worker.serviceArea && worker.serviceArea.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📍</span> Service Areas
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {worker.serviceArea.map((area, idx) => (
                    <span key={idx} className="badge-mint" style={{ padding: '6px 14px' }}>{area}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {worker.languages && worker.languages.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🗣️</span> Languages
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {worker.languages.map((lang, idx) => (
                    <span key={idx} className="badge-mint" style={{ padding: '6px 14px' }}>{lang}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {worker.certifications && worker.certifications.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📜</span> Certifications
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {worker.certifications.map((cert, idx) => (
                    <li key={idx} style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            {worker.portfolio && worker.portfolio.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {worker.portfolio.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    transition: 'transform 0.2s'
                  }}>
                    <div style={{
                      height: 180,
                      background: 'var(--gradient-hero)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48
                    }}>
                      🛠️
                    </div>
                    <div style={{ padding: 16 }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>{item.title}</h4>
                      {item.description && (
                        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{item.description}</p>
                      )}
                      {item.completedDate && (
                        <p style={{ fontSize: 11, color: 'var(--mint)' }}>
                          Completed: {new Date(item.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface)', borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
                <p>No portfolio items yet</p>
              </div>
            )}
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div style={{
            background: 'var(--surface)',
            borderRadius: 20,
            padding: 24,
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--ink)' }}>Weekly Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {worker.availability?.map((slot, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < worker.availability.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{slot.day}</span>
                  {slot.isAvailable ? (
                    <span style={{ color: 'var(--mint)' }}>⏰ {slot.startTime} - {slot.endTime}</span>
                  ) : (
                    <span style={{ color: '#dc2626' }}>❌ Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {/* Add Review Form */}
            {user && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                marginBottom: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>Write a Review</h3>
                <form onSubmit={submitReview}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="select"
                      style={{ width: 'auto' }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ Good</option>
                      <option value={3}>⭐⭐⭐ Average</option>
                      <option value={2}>⭐⭐ Poor</option>
                      <option value={1}>⭐ Terrible</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Job Title</label>
                    <input
                      type="text"
                      value={newReview.jobTitle}
                      onChange={(e) => setNewReview({ ...newReview, jobTitle: e.target.value })}
                      className="input"
                      placeholder="e.g., AC Repair, Plumbing Work"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Your Experience</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="input"
                      rows="4"
                      placeholder="Share your experience working with this professional..."
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
            {worker.reviews && worker.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {worker.reviews.map((review, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface)',
                    borderRadius: 16,
                    padding: 20,
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{review.userName || 'Anonymous'}</span>
                        {review.jobTitle && (
                          <span style={{ fontSize: 12, color: 'var(--mint)', marginLeft: 8 }}>• {review.jobTitle}</span>
                        )}
                        <div style={{ fontSize: 14, marginTop: 4 }}>
                          {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
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
                <p>No reviews yet</p>
                {!user && <p><Link to="/login" style={{ color: 'var(--mint)' }}>Login</Link> to be the first reviewer!</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}