import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/Languagetoggle';

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState({
    fullAddress: '',
    pincode: '',
    city: '',
    district: '',
    state: '',
    area: '',
    landmark: '',
    lat: null,
    lng: null
  });
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.savedLocation) {
      setSavedLocation(user.savedLocation);
      setAddressInput(user.savedLocation.fullAddress || '');
    }
  }, [user]);

  const searchAddress = async () => {
    if (!addressInput.trim()) {
      setMessage('Please enter your full address');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setAddressSuggestions(data);
        setMessage('');
      } else {
        setMessage('No address found. Please try a different search.');
      }
    } catch (err) {
      setMessage('Failed to search address');
    }
    setLoading(false);
  };

  const selectAddress = (addressData) => {
    const addressDetails = addressData.address || {};
    
    setSavedLocation({
      fullAddress: addressData.display_name,
      pincode: addressDetails.postcode || '',
      city: addressDetails.city || addressDetails.town || addressDetails.village || '',
      district: addressDetails.district || addressDetails.county || '',
      state: addressDetails.state || '',
      area: addressDetails.suburb || addressDetails.neighbourhood || addressDetails.village || '',
      landmark: addressDetails.amenity || addressDetails.road || '',
      lat: parseFloat(addressData.lat),
      lng: parseFloat(addressData.lon)
    });
    
    setAddressInput(addressData.display_name);
    setAddressSuggestions([]);
    setMessage('✓ Address selected! Click Save to update.');
  };

  const useCurrentLocation = () => {
    setLoading(true);
    setMessage('Getting your exact location using GPS...');
    
    // Use high accuracy GPS for exact location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        
        console.log("📍 EXACT GPS LOCATION:", { lat, lng, accuracy });
        
        if (accuracy > 100) {
          setMessage(`📍 Location accuracy: ~${Math.round(accuracy)}m. Try moving to an open area for better accuracy.`);
        } else {
          setMessage(`📍 Location found with ${Math.round(accuracy)}m accuracy!`);
        }
        
        try {
          // Reverse geocoding to get address from exact coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`
          );
          const data = await response.json();
          const addressDetails = data.address || {};
          
          // Build full address from components
          const houseNumber = addressDetails.house_number || '';
          const road = addressDetails.road || addressDetails.street || '';
          const suburb = addressDetails.suburb || addressDetails.neighbourhood || '';
          const city = addressDetails.city || addressDetails.town || addressDetails.village || '';
          const district = addressDetails.district || addressDetails.county || '';
          const state = addressDetails.state || '';
          const pincode = addressDetails.postcode || '';
          
          let fullAddress = '';
          if (houseNumber) fullAddress += houseNumber + ', ';
          if (road) fullAddress += road + ', ';
          if (suburb) fullAddress += suburb + ', ';
          if (city) fullAddress += city + ', ';
          if (district) fullAddress += district + ', ';
          if (state) fullAddress += state;
          if (pincode) fullAddress += ' - ' + pincode;
          
          setSavedLocation({
            fullAddress: fullAddress || data.display_name || '',
            pincode: pincode,
            city: city,
            district: district,
            state: state,
            area: suburb || road,
            landmark: houseNumber,
            lat: lat,
            lng: lng
          });
          
          setAddressInput(fullAddress || data.display_name || '');
          setMessage(`✅ Exact location detected! Accuracy: ${Math.round(accuracy)}m. Click Save to update.`);
        } catch (err) {
          console.error("Error getting address:", err);
          // If reverse geocoding fails, use coordinates as address
          setSavedLocation({
            ...savedLocation,
            fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat: lat,
            lng: lng
          });
          setAddressInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          setMessage(`✅ Location saved! (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        let errorMsg = "Unable to get your exact location. ";
        if (err.code === 1) errorMsg += "Please allow location access.";
        else if (err.code === 2) errorMsg += "Location unavailable. Try again.";
        else if (err.code === 3) errorMsg += "Request timed out. Check your connection.";
        setMessage(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,  // Use GPS for exact location
        timeout: 15000,
        maximumAge: 0  // Don't use cached location
      }
    );
  };

  const saveLocation = async () => {
    if (!savedLocation.fullAddress) {
      setMessage('Please select or enter your full address first');
      return;
    }
    
    setLoading(true);
    setMessage('Saving...');
    
    try {
      const response = await api.put('/user/location', savedLocation);
      
      if (response.data.success) {
        const updatedUser = { ...user, savedLocation: response.data.savedLocation };
        login(updatedUser, localStorage.getItem('findy_token'));
        setMessage('✅ Location updated successfully!');
        setTimeout(() => {
          setShowLocationModal(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage('Failed to update location: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error("Save location error:", err);
      setMessage(err.response?.data?.message || 'Failed to update location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Link to="/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-page)', paddingTop: 88 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        
        {/* Profile Header */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 28,
          padding: '40px',
          marginBottom: 24,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'var(--gradient-hero)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: '#fff',
            boxShadow: '0 8px 25px rgba(15,184,146,0.3)',
            border: '4px solid var(--mint)'
          }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
            {user.name}
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: 12 }}>{user.email}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{
              background: user.role === 'seller' ? '#fef3c7' : user.role === 'worker' ? '#ccfbec' : '#e0f2fe',
              color: user.role === 'seller' ? '#92400e' : user.role === 'worker' ? '#065f46' : '#0369a1',
              padding: '6px 18px',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              {user.role === 'seller' ? '🏪 Vendor' : user.role === 'worker' ? '👷 Worker' : '🗺️ Explorer'}
            </span>
          </div>
        </div>

        {/* Location Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '28px',
          marginBottom: 24,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--mint-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>📍</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>Your Saved Location</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>This helps us show you relevant places nearby</p>
              </div>
            </div>
            <button
              onClick={() => setShowLocationModal(true)}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: 14 }}
            >
              ✏️ Change Location
            </button>
          </div>
          
          {user.savedLocation?.fullAddress ? (
            <div style={{
              background: 'var(--mint-soft)',
              borderRadius: 16,
              padding: '20px',
              marginTop: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🏠</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--ink)', fontWeight: 500, marginBottom: 8, lineHeight: 1.5 }}>
                    {user.savedLocation.fullAddress}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
                    {user.savedLocation.lat && user.savedLocation.lng && (
                      <span style={{ fontSize: 11, fontFamily: 'monospace', background: 'var(--surface)', padding: '4px 10px', borderRadius: 20 }}>
                        🎯 {user.savedLocation.lat.toFixed(6)}, {user.savedLocation.lng.toFixed(6)}
                      </span>
                    )}
                    {user.savedLocation.area && (
                      <span style={{ fontSize: 12, color: 'var(--mint)' }}>📍 {user.savedLocation.area}</span>
                    )}
                    {user.savedLocation.city && (
                      <span style={{ fontSize: 12, color: 'var(--mint)' }}>🏙️ {user.savedLocation.city}</span>
                    )}
                    {user.savedLocation.pincode && (
                      <span style={{ fontSize: 12, color: 'var(--mint)' }}>📮 {user.savedLocation.pincode}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--surface-2)',
              borderRadius: 16,
              padding: '20px',
              textAlign: 'center',
              marginTop: 8
            }}>
              <p style={{ color: 'var(--muted)' }}>No location set yet</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Click "Change Location" to set your address</p>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '28px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚙️</span> Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🎨</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Appearance</span>
              </div>
              <ThemeToggle />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🌐</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Language</span>
              </div>
              <LanguageToggle />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🚪</span>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Sign Out</span>
              </div>
              <button 
                onClick={logout} 
                className="btn-danger" 
                style={{ padding: '8px 24px', fontSize: 13 }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Change Modal */}
      {showLocationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowLocationModal(false)}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: 28,
            padding: '32px',
            maxWidth: 550,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>📍 Change Your Location</h2>
              <button 
                onClick={() => setShowLocationModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--muted)'
                }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>
              Enter your full address to see relevant places, vendors, and services near you.
            </p>
            
            {message && (
              <div className={message.includes('✅') || message.includes('✓') ? 'alert-success' : 'alert-error'} style={{ marginBottom: 16 }}>
                {message}
              </div>
            )}
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--ink)' }}>
                Full Address
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="input"
                  placeholder="House No., Street, Area, City, PIN Code"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={searchAddress}
                  className="btn-primary"
                  style={{ padding: '11px 22px' }}
                  disabled={loading}
                >
                  {loading ? '...' : '🔍 Search'}
                </button>
              </div>
            </div>
            
            {addressSuggestions.length > 0 && (
              <div style={{
                marginBottom: 20,
                border: '1px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
                maxHeight: '250px',
                overflowY: 'auto'
              }}>
                {addressSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectAddress(suggestion)}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderBottom: idx < addressSuggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.2s',
                      background: 'var(--surface)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--mint-soft)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
                  >
                    <div style={{ fontSize: 13, color: 'var(--ink)' }}>{suggestion.display_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--mint)', marginTop: 4 }}>
                      📍 {parseFloat(suggestion.lat).toFixed(4)}, {parseFloat(suggestion.lon).toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {savedLocation.fullAddress && (
              <div style={{
                marginBottom: 20,
                padding: 16,
                background: 'var(--mint-soft)',
                borderRadius: 16,
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: 'var(--ink)' }}>📌 Selected Address:</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 10 }}>
                  {savedLocation.fullAddress}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {savedLocation.lat && savedLocation.lng && (
                    <span style={{ fontSize: 11, fontFamily: 'monospace', background: 'var(--surface)', padding: '4px 10px', borderRadius: 20 }}>
                      🎯 {savedLocation.lat.toFixed(6)}, {savedLocation.lng.toFixed(6)}
                    </span>
                  )}
                  {savedLocation.area && <span style={{ fontSize: 11, background: 'var(--surface)', padding: '4px 10px', borderRadius: 20 }}>📍 {savedLocation.area}</span>}
                  {savedLocation.city && <span style={{ fontSize: 11, background: 'var(--surface)', padding: '4px 10px', borderRadius: 20 }}>🏙️ {savedLocation.city}</span>}
                  {savedLocation.pincode && <span style={{ fontSize: 11, background: 'var(--surface)', padding: '4px 10px', borderRadius: 20 }}>📮 {savedLocation.pincode}</span>}
                </div>
              </div>
            )}
            
            <button
              onClick={useCurrentLocation}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 100,
                border: '2px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 20,
                color: 'var(--ink)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--mint)';
                e.currentTarget.style.background = 'var(--mint-soft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              📍 Use My Current Location (GPS)
            </button>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={saveLocation} 
                className="btn-primary" 
                disabled={loading} 
                style={{ flex: 1, padding: '14px' }}
              >
                {loading ? 'Saving...' : '💾 Save Location'}
              </button>
              <button 
                onClick={() => setShowLocationModal(false)} 
                className="btn-outline" 
                style={{ flex: 1, padding: '14px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}