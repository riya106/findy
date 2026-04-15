import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendorsAPI } from '../services/api';
import { useLang } from '../context/LanguageContext';

export default function VendorDetailPage() {
  const { id } = useParams();
   console.log('🔵 VendorDetailPage mounted with ID:', id);  
  const { t, lang } = useLang();
  
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    fetchVendorDetails();
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

  // Check if vendor is open now
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
        
        {/* Back Button */}
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
      
      {/* Vendor Info Card - Floating over the cover image */}
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
                <span className="badge-mint" style={{ background: 'var(--mint-soft)', color: 'var(--mint-dark)' }}>
                  {vendor.shopType}
                </span>
                
                {vendor.isLive && (
                  <span className="badge-live" style={{ background: 'var(--mint-soft)', color: 'var(--mint-dark)' }}>
                    <span className="live-dot" style={{ background: 'var(--mint)' }} />
                    {t('live')}
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
              
              {vendor.email && (
                <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>✉️</span> {vendor.email}
                </div>
              )}
            </div>
            
            {/* Rating Section */}
            {vendor.averageRating > 0 && (
              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--mint)', fontFamily: 'Syne, sans-serif' }}>
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
          
          {/* Description */}
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
        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '2px solid var(--border)',
          marginBottom: 24
        }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: activeTab === 'menu' ? 600 : 400,
              color: activeTab === 'menu' ? 'var(--mint)' : 'var(--muted)',
              borderBottom: activeTab === 'menu' ? `2px solid var(--mint)` : 'none',
              marginBottom: -2,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>🍽️</span> {lang === 'hi' ? 'मेनू' : 'Menu'}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: activeTab === 'info' ? 600 : 400,
              color: activeTab === 'info' ? 'var(--mint)' : 'var(--muted)',
              borderBottom: activeTab === 'info' ? `2px solid var(--mint)` : 'none',
              marginBottom: -2,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>ℹ️</span> {lang === 'hi' ? 'जानकारी' : 'Info'}
          </button>
        </div>
        
        {/* Menu Tab Content */}
        {activeTab === 'menu' && (
          <div>
            {vendor.menu && vendor.menu.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vendor.menu.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
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
                        color: 'var(--mint)',
                        fontFamily: 'Syne, sans-serif'
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
              <div style={{
                textAlign: 'center',
                padding: '60px',
                background: 'var(--surface)',
                borderRadius: 20,
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
                <h3 style={{ color: 'var(--ink)', marginBottom: 8 }}>{lang === 'hi' ? 'कोई मेनू आइटम नहीं' : 'No Menu Items'}</h3>
                <p style={{ color: 'var(--muted)' }}>
                  {lang === 'hi' ? 'इस विक्रेता ने अभी तक कोई मेनू नहीं जोड़ा है' : 'This vendor hasn\'t added any menu items yet'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Info Tab Content */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Operating Hours */}
            {vendor.operatingHours && vendor.operatingHours.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🕐</span> {lang === 'hi' ? 'खुलने का समय' : 'Operating Hours'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {vendor.operatingHours.map((hours, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: idx < vendor.operatingHours.length - 1 ? '1px solid var(--border)' : 'none'
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{hours.day}</span>
                      <span style={{ color: hours.isClosed ? '#dc2626' : 'var(--muted)' }}>
                        {hours.isClosed 
                          ? (lang === 'hi' ? 'बंद' : 'Closed')
                          : `${hours.open || '--'} - ${hours.close || '--'}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features / Amenities */}
            {vendor.features && vendor.features.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✨</span> {lang === 'hi' ? 'सुविधाएं' : 'Features & Amenities'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {vendor.features.map((feature, idx) => (
                    <span key={idx} style={{ padding: '6px 14px', borderRadius: 100, background: 'var(--mint-soft)', color: 'var(--mint-dark)', fontSize: 13 }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Payment Methods */}
            {vendor.paymentMethods && vendor.paymentMethods.length > 0 && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 16, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>💳</span> {lang === 'hi' ? 'भुगतान के तरीके' : 'Payment Methods'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {vendor.paymentMethods.map((method, idx) => (
                    <span key={idx} style={{ padding: '6px 14px', borderRadius: 100, background: 'var(--mint-soft)', color: 'var(--mint-dark)', fontSize: 13 }}>
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact Actions */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 20,
              padding: 24,
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 16, color: 'var(--ink)' }}>
                {lang === 'hi' ? 'संपर्क करें' : 'Contact Shop'}
              </h3>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={`tel:${vendor.phone}`} className="btn-primary" style={{ textDecoration: 'none' }}>
                  📞 {lang === 'hi' ? 'कॉल करें' : 'Call Now'}
                </a>
                <a href={`https://wa.me/${vendor.phone}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none' }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}