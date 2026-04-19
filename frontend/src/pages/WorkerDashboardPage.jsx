import { useState, useEffect } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { workersAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function WorkerDashboardPage() {
  const { user } = useAuth()
  const { lang } = useLang()
  
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    profession: '',
    experience: '',
    description: '',
    address: '',
    hourlyRate: '',
    monthlyRate: '',
    rateType: 'hourly', // 'hourly' or 'monthly'
    lat: null,
    lng: null
  })
  
  const [message, setMessage] = useState({ type: '', text: '' })
  const [addressInput, setAddressInput] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)

  const [portfolioItems, setPortfolioItems] = useState([])
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '' })
  const [showPortfolio, setShowPortfolio] = useState(false)

  const [availability, setAvailability] = useState([
    { day: "Monday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
    { day: "Tuesday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
    { day: "Wednesday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
    { day: "Thursday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
    { day: "Friday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
    { day: "Saturday", isAvailable: true, startTime: "10:00 AM", endTime: "04:00 PM" },
    { day: "Sunday", isAvailable: false, startTime: "10:00 AM", endTime: "04:00 PM" }
  ])

  const t = {
    en: {
      dashboard: 'Professional Dashboard',
      completeProfile: 'Complete Your Profile',
      manageProfile: 'Manage your professional profile',
      setupProfile: 'Set up your profile to get hired',
      createProfile: 'Create Profile',
      editProfile: 'Edit Profile',
      updateProfile: 'Update Profile',
      saving: 'Saving...',
      cancel: 'Cancel',
      viewPublic: 'View Public Profile',
      available: 'Available for work',
      unavailable: 'Currently unavailable',
      basicInfo: 'Basic Information',
      about: 'About',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email',
      profession: 'Profession / Service',
      experience: 'Experience (years)',
      rateType: 'Rate Type',
      hourly: 'Hourly Rate',
      monthly: 'Monthly Rate',
      hourlyRate: 'Hourly Rate (₹ per hour)',
      monthlyRate: 'Monthly Rate (₹ per month)',
      address: 'Service Address',
      addressPlaceholder: 'Enter your service address',
      aboutPlaceholder: 'Tell clients about your experience, skills, and services...',
      selectProfession: 'Select Profession / Service',
      electrician: '⚡ Electrician',
      plumber: '🔧 Plumber',
      carpenter: '🪚 Carpenter',
      painter: '🎨 Painter',
      mechanic: '🔩 Mechanic',
      cleaner: '🧹 Cleaner',
      acTechnician: '❄️ AC Technician',
      teacher: '📚 Teacher / Tutor',
      coach: '🏋️ Coach / Trainer',
      driver: '🚗 Driver',
      cook: '🍳 Cook / Chef',
      other: '👤 Other',
      notProvided: 'Not provided',
      notSet: 'Not set',
      profileCreated: 'Profile created successfully!',
      profileUpdated: 'Profile updated successfully!',
      errorName: 'Please enter your name',
      errorPhone: 'Please enter a valid 10-digit phone number',
      errorProfession: 'Please select a profession',
      loading: 'Loading...',
      noProfile: 'You haven\'t created your profile yet.',
      portfolio: 'Portfolio (Optional)',
      portfolioTitle: 'Project / Work Title',
      portfolioDesc: 'Description',
      addPortfolio: 'Add to Portfolio',
      availability: 'Weekly Availability',
      location: 'Service Location',
      useCurrentLocation: '📍 Use My Current Location',
      searchAddress: '🔍 Search',
      locationUpdated: 'Location updated successfully!',
      add: 'Add',
      optional: '(Optional)',
      getStarted: 'Get Started →'
    },
    hi: {
      dashboard: 'प्रोफेशनल डैशबोर्ड',
      completeProfile: 'अपनी प्रोफ़ाइल पूरी करें',
      manageProfile: 'अपनी प्रोफ़ाइल प्रबंधित करें',
      setupProfile: 'काम पाने के लिए अपनी प्रोफ़ाइल सेट करें',
      createProfile: 'प्रोफ़ाइल बनाएं',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      updateProfile: 'प्रोफ़ाइल अपडेट करें',
      saving: 'सहेजा जा रहा है...',
      cancel: 'रद्द करें',
      viewPublic: 'सार्वजनिक प्रोफ़ाइल देखें',
      available: 'काम के लिए उपलब्ध',
      unavailable: 'अभी अनुपलब्ध',
      basicInfo: 'मूल जानकारी',
      about: 'परिचय',
      name: 'पूरा नाम',
      phone: 'फ़ोन नंबर',
      email: 'ईमेल',
      profession: 'पेशा / सेवा',
      experience: 'अनुभव (साल)',
      rateType: 'दर का प्रकार',
      hourly: 'प्रति घंटा दर',
      monthly: 'मासिक दर',
      hourlyRate: 'प्रति घंटा दर (₹ प्रति घंटा)',
      monthlyRate: 'मासिक दर (₹ प्रति महीना)',
      address: 'सेवा का पता',
      addressPlaceholder: 'अपना सेवा पता दर्ज करें',
      aboutPlaceholder: 'ग्राहकों को अपने अनुभव, कौशल और सेवाओं के बारे में बताएं...',
      selectProfession: 'पेशा / सेवा चुनें',
      electrician: '⚡ इलेक्ट्रीशियन',
      plumber: '🔧 प्लम्बर',
      carpenter: '🪚 बढ़ई',
      painter: '🎨 पेंटर',
      mechanic: '🔩 मैकेनिक',
      cleaner: '🧹 सफाईकर्मी',
      acTechnician: '❄️ एसी तकनीशियन',
      teacher: '📚 शिक्षक / ट्यूटर',
      coach: '🏋️ कोच / ट्रेनर',
      driver: '🚗 ड्राइवर',
      cook: '🍳 रसोइया / शेफ',
      other: '👤 अन्य',
      notProvided: 'प्रदान नहीं किया',
      notSet: 'सेट नहीं',
      profileCreated: 'प्रोफ़ाइल सफलतापूर्वक बन गई!',
      profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
      errorName: 'कृपया अपना नाम दर्ज करें',
      errorPhone: 'कृपया 10 अंकों का वैध फ़ोन नंबर दर्ज करें',
      errorProfession: 'कृपया एक पेशा चुनें',
      loading: 'लोड हो रहा है...',
      noProfile: 'आपने अभी तक अपनी प्रोफ़ाइल नहीं बनाई है।',
      portfolio: 'पोर्टफोलियो (वैकल्पिक)',
      portfolioTitle: 'प्रोजेक्ट / कार्य का नाम',
      portfolioDesc: 'विवरण',
      addPortfolio: 'पोर्टफोलियो में जोड़ें',
      availability: 'साप्ताहिक उपलब्धता',
      location: 'सेवा स्थान',
      useCurrentLocation: '📍 मेरा वर्तमान स्थान उपयोग करें',
      searchAddress: '🔍 खोजें',
      locationUpdated: 'स्थान सफलतापूर्वक अपडेट हो गया!',
      add: 'जोड़ें',
      optional: '(वैकल्पिक)',
      getStarted: 'शुरू करें →'
    }
  }

  const text = t[lang] || t.en

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    fetchWorkerProfile()
  }, [user])

  const fetchWorkerProfile = async () => {
    try {
      const response = await workersAPI.getMyWorker()
      const workerData = response.data?.data || response.data
      if (workerData) {
        setWorker(workerData)
        setFormData({
          name: workerData.name || '',
          phone: workerData.phone || '',
          email: workerData.email || '',
          profession: workerData.profession || '',
          experience: workerData.experience || '',
          description: workerData.description || '',
          address: workerData.address || '',
          hourlyRate: workerData.hourlyRate || '',
          monthlyRate: workerData.monthlyRate || '',
          rateType: workerData.rateType || 'hourly',
          lat: workerData.location?.lat || null,
          lng: workerData.location?.lng || null
        })
        setAddressInput(workerData.address || '')
        setPortfolioItems(workerData.portfolio || [])
        if (workerData.availability) setAvailability(workerData.availability)
      }
    } catch (err) {
      console.log("No existing profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const searchAddress = async () => {
    if (!addressInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter an address' })
      return
    }
    
    setLocationLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&addressdetails=1&limit=5`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        setAddressSuggestions(data)
        setMessage({ type: '', text: '' })
      } else {
        setMessage({ type: 'error', text: 'No address found' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to search address' })
    }
    setLocationLoading(false)
  }

  const selectAddress = (addressData) => {
    setFormData({
      ...formData,
      address: addressData.display_name,
      lat: parseFloat(addressData.lat),
      lng: parseFloat(addressData.lon)
    })
    setAddressInput(addressData.display_name)
    setAddressSuggestions([])
    setMessage({ type: 'success', text: '✓ Address selected!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
  }

  const useCurrentLocation = () => {
    setLocationLoading(true)
    setMessage({ type: '', text: '' })
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
          )
          const data = await response.json()
          
          setFormData({
            ...formData,
            address: data.display_name || '',
            lat: lat,
            lng: lng
          })
          setAddressInput(data.display_name || '')
          setMessage({ type: 'success', text: '✓ Current location detected!' })
          setTimeout(() => setMessage({ type: '', text: '' }), 2000)
        } catch (err) {
          setMessage({ type: 'error', text: 'Error getting address' })
        }
        setLocationLoading(false)
      },
      () => {
        setMessage({ type: 'error', text: 'Location permission denied' })
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const addPortfolioItem = async () => {
    if (!newPortfolio.title) {
      setMessage({ type: 'error', text: 'Please enter a project title' })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      return
    }
    
    if (!worker) {
      setMessage({ type: 'error', text: 'Please save your profile first' })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      return
    }
    
    try {
      const response = await workersAPI.addPortfolio(worker._id, newPortfolio)
      setPortfolioItems([...portfolioItems, response.data.data])
      setNewPortfolio({ title: '', description: '' })
      setMessage({ type: 'success', text: 'Portfolio item added!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add portfolio item' })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    }
  }

  const deletePortfolioItem = async (itemId) => {
    if (window.confirm('Delete this portfolio item?')) {
      try {
        await workersAPI.deletePortfolioItem(worker._id, itemId)
        setPortfolioItems(portfolioItems.filter(item => item._id !== itemId))
        setMessage({ type: 'success', text: 'Portfolio item deleted!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete' })
      }
    }
  }

  const updateAvailability = (index, field, value) => {
    const updated = [...availability]
    updated[index][field] = value
    setAvailability(updated)
  }

  const saveProfile = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: text.errorName })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setMessage({ type: 'error', text: text.errorPhone })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    if (!formData.profession) {
      setMessage({ type: 'error', text: text.errorProfession })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    setSaving(true)
    try {
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || `${formData.name.replace(/\s/g, '')}@example.com`,
        profession: formData.profession,
        experience: parseInt(formData.experience) || 0,
        hourlyRate: parseInt(formData.hourlyRate) || 0,
        monthlyRate: parseInt(formData.monthlyRate) || 0,
        rateType: formData.rateType,
        address: formData.address,
        description: formData.description,
        location: { lat: formData.lat, lng: formData.lng },
        availability: availability,
        portfolio: portfolioItems
      }
      
      if (worker) {
        await workersAPI.update(worker._id, profileData)
        setMessage({ type: 'success', text: text.profileUpdated })
      } else {
        await workersAPI.register(profileData)
        setMessage({ type: 'success', text: text.profileCreated })
      }
      
      setEditing(false)
      fetchWorkerProfile()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <p>{text.loading}</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-page)',
      paddingTop: 88
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80,
            background: 'var(--gradient-hero)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, color: 'var(--ink)' }}>
            {worker ? text.dashboard : text.completeProfile}
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {worker ? text.manageProfile : text.setupProfile}
          </p>
        </div>

        {message.text && (
          <div className={message.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          
          {!worker && !editing && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>👤</div>
              <h2>{text.createProfile}</h2>
              <p style={{ marginBottom: 24 }}>{text.setupProfile}</p>
              <button onClick={() => setEditing(true)} className="btn-primary">
                {text.getStarted}
              </button>
            </div>
          )}

          {(editing || !worker) && (
            <div>
              <h2 style={{ marginBottom: 24 }}>{text.basicInfo}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.name} *</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.phone} *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="input" maxLength="10" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.email}</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.profession} *</label>
                  <select name="profession" value={formData.profession} onChange={handleChange} className="select">
                    <option value="">{text.selectProfession}</option>
                    <option value="Electrician">⚡ {text.electrician}</option>
                    <option value="Plumber">🔧 {text.plumber}</option>
                    <option value="Carpenter">🪚 {text.carpenter}</option>
                    <option value="Painter">🎨 {text.painter}</option>
                    <option value="Mechanic">🔩 {text.mechanic}</option>
                    <option value="Cleaner">🧹 {text.cleaner}</option>
                    <option value="AC Technician">❄️ {text.acTechnician}</option>
                    <option value="Teacher">📚 {text.teacher}</option>
                    <option value="Coach">🏋️ {text.coach}</option>
                    <option value="Driver">🚗 {text.driver}</option>
                    <option value="Cook">🍳 {text.cook}</option>
                    <option value="Other">👤 {text.other}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.experience}</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="input" />
                </div>
              </div>

              {/* Rate Type Selection */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.rateType}</label>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="radio" 
                      name="rateType" 
                      value="hourly" 
                      checked={formData.rateType === 'hourly'} 
                      onChange={(e) => setFormData({ ...formData, rateType: e.target.value })} 
                    />
                    {text.hourly}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="radio" 
                      name="rateType" 
                      value="monthly" 
                      checked={formData.rateType === 'monthly'} 
                      onChange={(e) => setFormData({ ...formData, rateType: e.target.value })} 
                    />
                    {text.monthly}
                  </label>
                </div>
              </div>

              {/* Rate Field based on selection */}
              <div style={{ marginBottom: 24 }}>
                {formData.rateType === 'hourly' ? (
                  <>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.hourlyRate}</label>
                    <input 
                      type="number" 
                      name="hourlyRate" 
                      value={formData.hourlyRate} 
                      onChange={handleChange} 
                      className="input" 
                      placeholder="e.g., 500"
                    />
                  </>
                ) : (
                  <>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.monthlyRate}</label>
                    <input 
                      type="number" 
                      name="monthlyRate" 
                      value={formData.monthlyRate} 
                      onChange={handleChange} 
                      className="input" 
                      placeholder="e.g., 5000"
                    />
                  </>
                )}
              </div>

              {/* Location Section */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>📍 {text.location}</label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="input"
                    placeholder={text.addressPlaceholder}
                    style={{ flex: 1 }}
                  />
                  <button onClick={searchAddress} className="btn-primary" style={{ padding: '11px 20px' }} disabled={locationLoading}>
                    {locationLoading ? '...' : text.searchAddress}
                  </button>
                </div>
                
                {addressSuggestions.length > 0 && (
                  <div style={{
                    marginBottom: 10,
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {addressSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectAddress(suggestion)}
                        style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: idx < addressSuggestions.length - 1 ? '1px solid var(--border)' : 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--mint-soft)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontSize: 13 }}>{suggestion.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <button onClick={useCurrentLocation} style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
                  📍 {text.useCurrentLocation}
                </button>
                
                {formData.address && (
                  <div style={{ marginTop: 10, padding: 10, background: 'var(--mint-soft)', borderRadius: 8, fontSize: 12 }}>
                    📌 {formData.address}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.about}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input" placeholder={text.aboutPlaceholder} />
              </div>

              {/* Portfolio Section - OPTIONAL */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, margin: 0 }}>📷 {text.portfolio}</h3>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{text.optional}</span>
                </div>
                
                {portfolioItems.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    {portfolioItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 8 }}>
                        <div>
                          <strong>{item.title}</strong>
                          {item.description && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>• {item.description}</span>}
                        </div>
                        <button onClick={() => deletePortfolioItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 20 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    className="input"
                    placeholder={text.portfolioTitle}
                    style={{ flex: 2 }}
                  />
                  <input
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    className="input"
                    placeholder={text.portfolioDesc}
                    style={{ flex: 3 }}
                  />
                  <button onClick={addPortfolioItem} className="btn-primary" style={{ padding: '11px 20px' }}>
                    + {text.add}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>💡 {text.portfolio} - {text.optional}</p>
              </div>

              {/* Availability Section */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>🕐 {text.availability}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {availability.map((slot, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ width: 100, fontWeight: 600, color: 'var(--ink)' }}>{slot.day}</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" checked={slot.isAvailable} onChange={(e) => updateAvailability(idx, 'isAvailable', e.target.checked)} />
                        Available
                      </label>
                      {slot.isAvailable && (
                        <>
                          <input type="time" value={slot.startTime} onChange={(e) => updateAvailability(idx, 'startTime', e.target.value)} className="input" style={{ width: 120 }} />
                          <span>to</span>
                          <input type="time" value={slot.endTime} onChange={(e) => updateAvailability(idx, 'endTime', e.target.value)} className="input" style={{ width: 120 }} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                {worker && <button onClick={() => setEditing(false)} className="btn-outline">{text.cancel}</button>}
                <button onClick={saveProfile} className="btn-primary" disabled={saving}>
                  {saving ? text.saving : (worker ? text.updateProfile : text.createProfile)}
                </button>
              </div>
            </div>
          )}

          {worker && !editing && (
            <div>
              <div style={{
                background: worker.isAvailable ? '#dcfce7' : '#fee2e2',
                padding: 16,
                borderRadius: 12,
                textAlign: 'center',
                marginBottom: 24
              }}>
                <strong style={{ color: worker.isAvailable ? '#166534' : '#991b1b' }}>
                  {worker.isAvailable ? `🟢 ${text.available}` : `🔴 ${text.unavailable}`}
                </strong>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{text.basicInfo}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <p><strong>{text.name}:</strong> {worker.name}</p>
                  <p><strong>{text.phone}:</strong> {worker.phone}</p>
                  <p><strong>{text.email}:</strong> {worker.email || text.notProvided}</p>
                  <p><strong>{text.profession}:</strong> {worker.profession}</p>
                  <p><strong>{text.experience}:</strong> {worker.experience} years</p>
                  <p><strong>Rate:</strong> {worker.rateType === 'hourly' 
                    ? `₹${worker.hourlyRate}/hour` 
                    : `₹${worker.monthlyRate}/month`}
                  </p>
                  <p><strong>{text.address}:</strong> {worker.address || text.notSet}</p>
                </div>
              </div>

              {worker.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{text.about}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{worker.description}</p>
                </div>
              )}

              {portfolioItems.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>📷 {text.portfolio}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {portfolioItems.map((item, idx) => (
                      <div key={idx} style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 8 }}>
                        <strong>{item.title}</strong> - {item.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setEditing(true)} className="btn-primary">
                  ✏️ {text.editProfile}
                </button>
                <Link to={`/workers/${worker._id}`} className="btn-outline">
                  {text.viewPublic} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}