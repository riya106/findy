import { Link } from 'react-router-dom';
import { useAddress } from '../hooks/useAddress';
import { useLang } from '../context/LanguageContext';

export default function VendorCard({ vendor, delay = 0 }) {
  const { t } = useLang();
  
  // SAFE: Check if vendor exists
  if (!vendor) {
    return null;
  }
  
  // SAFE: Extract location with fallbacks
  const lat = vendor.location?.lat || null;
  const lng = vendor.location?.lng || null;
  
  const addressResult = useAddress(lat, lng);
  const address = typeof addressResult === 'string' 
    ? addressResult 
    : (addressResult?.address || addressResult?.placeName || 'Location not available');

  // Get gradient based on vendor name
  const getGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #0fb892 0%, #059669 100%)',
      'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
      'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
      'linear-gradient(135deg, #2dd4bf 0%, #0f766e 100%)',
      'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
    ];
    const index = (name?.length || 0) % gradients.length;
    return gradients[index];
  };

  // SAFE: Rating values
  const rating = vendor.averageRating || 0;
  const reviewCount = vendor.totalReviews || 0;

  return (
    <Link to={`/vendors/${vendor._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: 20,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid var(--border)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = 'var(--mint)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Card Header with Gradient */}
        <div
          style={{
            background: getGradient(vendor.name),
            padding: '24px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                backdropFilter: 'blur(8px)',
              }}
            >
              🏪
            </div>
            
            {vendor.isLive ? (
              <div
                style={{
                  background: '#10b981',
                  padding: '6px 14px',
                  borderRadius: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#fff',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  {t('live')}
                </span>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '6px 14px',
                  borderRadius: 100,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  {t('offline')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '20px', flex: 1 }}>
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 6,
              color: 'var(--ink)',
              lineHeight: 1.3,
            }}
          >
            {vendor.name || 'Unknown Shop'}
          </h3>
          
          <div
            style={{
              display: 'inline-block',
              background: 'var(--mint-soft)',
              color: 'var(--mint-dark)',
              padding: '4px 12px',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {vendor.shopType || 'Local Shop'}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--muted)',
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ flex: 1 }}>{address}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 14, color: '#f59e0b' }}>⭐</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              ({reviewCount})
            </span>
          </div>
          <div
            style={{
              color: 'var(--mint)',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            View Details
            <span style={{ fontSize: 16 }}>→</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </Link>
  );
}