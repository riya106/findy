import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { authAPI } from '../services/api'

export default function SignupPage() {
  const { login } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'explorer'
  })

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
  })

  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('asking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])

  useEffect(() => { requestLocation() }, [])

  const requestLocation = () => {
    setLocationStatus('asking')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocationStatus('granted');
        
        // Get FULL ADDRESS from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
          );
          const data = await response.json();
          
          const address = data.display_name || '';
          const addressDetails = data.address || {};
          
          setSavedLocation({
            fullAddress: address,
            pincode: addressDetails.postcode || '',
            city: addressDetails.city || addressDetails.town || addressDetails.village || '',
            district: addressDetails.district || addressDetails.county || '',
            state: addressDetails.state || '',
            area: addressDetails.suburb || addressDetails.neighbourhood || addressDetails.village || '',
            landmark: addressDetails.amenity || addressDetails.road || '',
            lat: lat,
            lng: lng
          });
          
          setAddressInput(address);
        } catch (err) {
          console.error("Error getting address:", err);
        }
      },
      () => setLocationStatus('denied')
    );
  };

  const searchAddress = async () => {
    if (!addressInput.trim()) {
      setError('Please enter an address');
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
        setError('');
      } else {
        setError('No address found. Please try a different search.');
      }
    } catch (err) {
      setError('Failed to search address');
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
    setCoords({ lat: parseFloat(addressData.lat), lng: parseFloat(addressData.lon) });
  };

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const redirectByRole = (role) => {
    if (role === 'seller') navigate('/vendor-dashboard');
    else if (role === 'worker') navigate('/worker-dashboard');
    else navigate('/listings');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill all fields');
      return;
    }
    
    if (!savedLocation.fullAddress) {
      setError('Please enter your address');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...form,
        savedLocation: savedLocation,
        ...(coords && { location: { latitude: coords.lat, longitude: coords.lng } })
      };
      
      const { data } = await authAPI.register(payload);
      
      if (!data.user || !data.token) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }
      
      login(data.user, data.token);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 550 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            gap: 10, marginBottom: 16
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--gradient-hero)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#fff', fontWeight: 800,
              fontFamily: 'Syne, sans-serif'
            }}>F</div>
            <span style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800, fontSize: 28, color: 'var(--mint)'
            }}>
              Findy
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 26, marginBottom: 8,
            color: 'var(--ink)'
          }}>
            Create Account
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Join our community
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          borderRadius: 28, padding: 36,
        }}>
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 20,
              fontSize: 13, fontWeight: 500,
              background: '#fef2f2', color: '#dc2626',
              border: '1px solid #fca5a5'
            }}>
              ❌ {error}
            </div>
          )}

          {/* FULL ADDRESS Section */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              📍 Your Full Address
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Enter your full address (e.g., House No., Street, Area, City)"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={searchAddress}
                className="btn-primary"
                style={{ padding: '11px 20px' }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {/* Address Suggestions */}
            {addressSuggestions.length > 0 && (
              <div style={{
                marginTop: 8,
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--surface)'
              }}>
                {addressSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectAddress(suggestion)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: idx < addressSuggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--mint-soft)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontSize: 13, color: 'var(--ink)' }}>{suggestion.display_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                      📍 Lat: {suggestion.lat}, Lng: {suggestion.lon}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected Address Display */}
            {savedLocation.fullAddress && (
              <div style={{
                marginTop: 12,
                padding: 12,
                background: 'var(--mint-soft)',
                borderRadius: 12,
                fontSize: 13
              }}>
                <div><strong>📍 Full Address:</strong> {savedLocation.fullAddress}</div>
                {savedLocation.area && <div><strong>🏘️ Area:</strong> {savedLocation.area}</div>}
                {savedLocation.city && <div><strong>🏙️ City:</strong> {savedLocation.city}</div>}
                {savedLocation.district && <div><strong>🗺️ District:</strong> {savedLocation.district}</div>}
                {savedLocation.state && <div><strong>📌 State:</strong> {savedLocation.state}</div>}
                {savedLocation.pincode && <div><strong>📮 PIN Code:</strong> {savedLocation.pincode}</div>}
              </div>
            )}
            
            <button
              type="button"
              onClick={requestLocation}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '10px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              📍 Use My Current Location
            </button>
          </div>

          {/* Input Fields */}
          <div style={{ marginBottom: 16 }}>
            <input
              className="input" type="text" name="name"
              placeholder="Full Name"
              value={form.name} onChange={handle}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <input
              className="input" type="email" name="email"
              placeholder="Email"
              value={form.email} onChange={handle}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <input
              className="input" type="tel" name="phone"
              placeholder="Phone Number"
              value={form.phone} onChange={handle}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <input
              className="input" type="password" name="password"
              placeholder="Password"
              value={form.password} onChange={handle}
              style={{ width: '100%' }}
            />
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              I want to join as:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { value: 'explorer', label: '🗺️ Explorer - Browse & Discover', desc: 'Find local services & shops' },
                { value: 'seller', label: '🏪 Vendor - List Your Shop', desc: 'Sell products & go live' },
                { value: 'worker', label: '👷 Worker - Offer Your Skills', desc: 'Get hired for local work' },
              ].map(r => (
                <div
                  key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    padding: '14px 18px', borderRadius: 14,
                    cursor: 'pointer',
                    border: `2px solid ${form.role === r.value ? 'var(--mint)' : 'var(--border)'}`,
                    background: form.role === r.value ? 'var(--gradient-card)' : 'var(--card-bg)',
                  }}
                >
                  <div style={{ fontWeight: 600, color: form.role === r.value ? 'var(--mint)' : 'var(--ink)' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              borderRadius: 100, border: 'none',
              background: 'var(--gradient-hero)',
              color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--mint)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}