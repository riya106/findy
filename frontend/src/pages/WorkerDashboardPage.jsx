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
    hourlyRate: ''
  })
  
  const [message, setMessage] = useState({ type: '', text: '' })

  const t = {
    en: {
      dashboard: 'Worker Dashboard',
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
      profession: 'Profession',
      experience: 'Experience (years)',
      hourlyRate: 'Hourly Rate (₹)',
      address: 'Service Address',
      addressPlaceholder: 'e.g., Sector 18, Noida',
      aboutPlaceholder: 'Tell clients about your experience, skills, and services...',
      selectProfession: 'Select Profession',
      electrician: '⚡ Electrician',
      plumber: '🔧 Plumber',
      carpenter: '🪚 Carpenter',
      painter: '🎨 Painter',
      mechanic: '🔩 Mechanic',
      cleaner: '🧹 Cleaner',
      acTechnician: '❄️ AC Technician',
      other: '👷 Other',
      notProvided: 'Not provided',
      notSet: 'Not set',
      profileCreated: 'Profile created successfully!',
      profileUpdated: 'Profile updated successfully!',
      errorName: 'Please enter your name',
      errorPhone: 'Please enter a valid 10-digit phone number',
      errorProfession: 'Please select a profession',
      loading: 'Loading...',
      noProfile: 'You haven\'t created your worker profile yet.'
    },
    hi: {
      dashboard: 'कर्मचारी डैशबोर्ड',
      completeProfile: 'अपनी प्रोफ़ाइल पूरी करें',
      manageProfile: 'अपनी पेशेवर प्रोफ़ाइल प्रबंधित करें',
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
      profession: 'पेशा',
      experience: 'अनुभव (साल)',
      hourlyRate: 'प्रति घंटा दर (₹)',
      address: 'सेवा का पता',
      addressPlaceholder: 'जैसे, सेक्टर 18, नोएडा',
      aboutPlaceholder: 'ग्राहकों को अपने अनुभव, कौशल और सेवाओं के बारे में बताएं...',
      selectProfession: 'पेशा चुनें',
      electrician: '⚡ इलेक्ट्रीशियन',
      plumber: '🔧 प्लम्बर',
      carpenter: '🪚 बढ़ई',
      painter: '🎨 पेंटर',
      mechanic: '🔩 मैकेनिक',
      cleaner: '🧹 सफाईकर्मी',
      acTechnician: '❄️ एसी तकनीशियन',
      other: '👷 अन्य',
      notProvided: 'प्रदान नहीं किया',
      notSet: 'सेट नहीं',
      profileCreated: 'प्रोफ़ाइल सफलतापूर्वक बन गई!',
      profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
      errorName: 'कृपया अपना नाम दर्ज करें',
      errorPhone: 'कृपया 10 अंकों का वैध फ़ोन नंबर दर्ज करें',
      errorProfession: 'कृपया एक पेशा चुनें',
      loading: 'लोड हो रहा है...',
      noProfile: 'आपने अभी तक अपनी कर्मचारी प्रोफ़ाइल नहीं बनाई है।'
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
          hourlyRate: workerData.hourlyRate || ''
        })
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
        address: formData.address,
        description: formData.description
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
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 60px' }}>
        
        {/* Header */}
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
            👷
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, color: 'var(--ink)' }}>
            {worker ? text.dashboard : text.completeProfile}
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {worker ? text.manageProfile : text.setupProfile}
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={message.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          
          {/* No Profile - Show Create Button */}
          {!worker && !editing && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p style={{ marginBottom: 24, color: 'var(--muted)' }}>
                {text.noProfile}
              </p>
              <button onClick={() => setEditing(true)} className="btn-primary">
                {text.createProfile} →
              </button>
            </div>
          )}

          {/* Edit Form */}
          {(editing || !worker) && (
            <div>
              <h2 style={{ fontSize: 20, marginBottom: 24, color: 'var(--ink)' }}>
                {worker ? text.editProfile : text.createProfile}
              </h2>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.name} *</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input" 
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.phone} *</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="input" 
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.email}</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input" 
                  placeholder="you@example.com"
                />
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.profession} *</label>
                <select name="profession" value={formData.profession} onChange={handleChange} className="select">
                  <option value="">{text.selectProfession}</option>
                  <option value="Electrician">{text.electrician}</option>
                  <option value="Plumber">{text.plumber}</option>
                  <option value="Carpenter">{text.carpenter}</option>
                  <option value="Painter">{text.painter}</option>
                  <option value="Mechanic">{text.mechanic}</option>
                  <option value="Cleaner">{text.cleaner}</option>
                  <option value="AC Technician">{text.acTechnician}</option>
                  <option value="Other">{text.other}</option>
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.experience}</label>
                  <input 
                    type="number" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange} 
                    className="input" 
                    placeholder="5"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.hourlyRate}</label>
                  <input 
                    type="number" 
                    name="hourlyRate" 
                    value={formData.hourlyRate} 
                    onChange={handleChange} 
                    className="input" 
                    placeholder="500"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.address}</label>
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="input" 
                  placeholder={text.addressPlaceholder}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>{text.about}</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="4" 
                  className="input" 
                  placeholder={text.aboutPlaceholder}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                {worker && (
                  <button 
                    onClick={() => setEditing(false)} 
                    className="btn-outline"
                  >
                    {text.cancel}
                  </button>
                )}
                <button 
                  onClick={saveProfile} 
                  className="btn-primary" 
                  disabled={saving}
                >
                  {saving ? text.saving : (worker ? text.updateProfile : text.createProfile)}
                </button>
              </div>
            </div>
          )}

          {/* View Profile Mode */}
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
                <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--ink)' }}>{text.basicInfo}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <p><strong>{text.name}:</strong> {worker.name}</p>
                  <p><strong>{text.phone}:</strong> {worker.phone}</p>
                  <p><strong>{text.email}:</strong> {worker.email || text.notProvided}</p>
                  <p><strong>{text.profession}:</strong> {worker.profession}</p>
                  <p><strong>{text.experience}:</strong> {worker.experience} years</p>
                  <p><strong>{text.hourlyRate}:</strong> ₹{worker.hourlyRate}/hour</p>
                  <p><strong>{text.address}:</strong> {worker.address || text.notSet}</p>
                </div>
              </div>

              {worker.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--ink)' }}>{text.about}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{worker.description}</p>
                </div>
              )}

              <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
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