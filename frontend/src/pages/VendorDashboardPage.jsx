import { useState, useEffect } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { vendorsAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function VendorDashboardPage() {
  const { user, logout } = useAuth()
  const { lang } = useLang()
  
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [liveLoading, setLiveLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    shopType: '',
    description: '',
    address: '',
    coverImage: '',
    offersDelivery: false,
    offersPickup: true,
    minimumOrderAmount: '',
    deliveryFee: ''
  })
  
  const [menuItems, setMenuItems] = useState([])
  const [newMenuItem, setNewMenuItem] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: 'Main Course', 
    isAvailable: true, 
    isVegetarian: false 
  })
  
  const [operatingHours, setOperatingHours] = useState([
    { day: "Monday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Tuesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Wednesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Thursday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Friday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Saturday", open: "10:00 AM", close: "10:00 PM", isClosed: false },
    { day: "Sunday", open: "10:00 AM", close: "08:00 PM", isClosed: false }
  ])
  
  const [features, setFeatures] = useState([])
  const [newFeature, setNewFeature] = useState('')
  
  const [paymentMethods, setPaymentMethods] = useState(['Cash', 'UPI'])
  const [newPaymentMethod, setNewPaymentMethod] = useState('')
  
  const [message, setMessage] = useState({ type: '', text: '' })

  // Translations
  const translations = {
    en: {
      dashboard: 'Vendor Dashboard',
      completeProfile: 'Complete Your Shop Profile',
      manageShop: 'Manage your shop, menu, and availability',
      setupShop: 'Set up your shop to start selling',
      stopLive: 'Stop Live',
      goLive: 'Go Live',
      gettingLocation: 'Getting location...',
      editProfile: 'Edit Profile',
      cancel: 'Cancel',
      shopInformation: 'Shop Information',
      shopName: 'Shop Name',
      phone: 'Phone',
      email: 'Email',
      shopType: 'Shop Type',
      selectShopType: 'Select Shop Type',
      foodBeverages: 'Food & Beverages',
      clothing: 'Clothing & Accessories',
      electronics: 'Electronics',
      grocery: 'Grocery',
      services: 'Services',
      handicrafts: 'Handicrafts',
      other: 'Other',
      shopDescription: 'Shop Description',
      describeShop: 'Describe your shop, products, and services...',
      shopAddress: 'Shop Address',
      addressPlaceholder: 'e.g., Sector 18, Noida',
      coverImage: 'Cover Image URL',
      deliveryOptions: 'Delivery Options',
      offersDelivery: 'Offers Delivery',
      offersPickup: 'Offers Pickup',
      minimumOrder: 'Minimum Order (₹)',
      deliveryFee: 'Delivery Fee (₹)',
      menuItems: 'Menu Items',
      itemName: 'Item name',
      price: 'Price',
      description: 'Description (optional)',
      add: 'Add',
      vegetarian: 'Vegetarian',
      available: 'Available',
      operatingHours: 'Operating Hours',
      closed: 'Closed',
      to: 'to',
      shopFeatures: 'Shop Features',
      featurePlaceholder: 'e.g., Parking, WiFi, AC',
      paymentMethods: 'Payment Methods',
      paymentPlaceholder: 'e.g., Card, Net Banking',
      save: 'Save',
      updating: 'Updating...',
      creating: 'Creating...',
      updateProfile: 'Update Profile',
      createProfile: 'Create Profile',
      getStarted: 'Get Started →',
      createYourShop: 'Create Your Shop Profile',
      fillForm: 'Fill out the form below to start selling',
      viewPublicProfile: 'View Public Profile →',
      liveNow: '🔴 LIVE',
      offline: '⚫ Offline',
      youAreLive: '✅ You are now LIVE! Customers can see you.',
      youAreOffline: 'You are now offline',
      locationDenied: 'Location permission denied',
      profileUpdated: 'Profile updated successfully!',
      profileCreated: 'Profile created successfully!',
      menuAdded: 'Menu item added!',
      menuDeleted: 'Menu item deleted!',
      saveProfileFirst: 'Please save your profile first before adding menu items',
      loading: 'Loading...'
    },
    hi: {
      dashboard: 'विक्रेता डैशबोर्ड',
      completeProfile: 'अपनी दुकान की प्रोफ़ाइल पूरी करें',
      manageShop: 'अपनी दुकान, मेनू और उपलब्धता प्रबंधित करें',
      setupShop: 'बेचना शुरू करने के लिए अपनी दुकान सेट करें',
      stopLive: 'लाइव बंद करें',
      goLive: 'लाइव जाएं',
      gettingLocation: 'लोकेशन मिल रही है...',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      cancel: 'रद्द करें',
      shopInformation: 'दुकान की जानकारी',
      shopName: 'दुकान का नाम',
      phone: 'फ़ोन नंबर',
      email: 'ईमेल',
      shopType: 'दुकान का प्रकार',
      selectShopType: 'दुकान का प्रकार चुनें',
      foodBeverages: 'खाना-पीना',
      clothing: 'कपड़े और एक्सेसरीज़',
      electronics: 'इलेक्ट्रॉनिक्स',
      grocery: 'किराना',
      services: 'सेवाएं',
      handicrafts: 'हस्तशिल्प',
      other: 'अन्य',
      shopDescription: 'दुकान का विवरण',
      describeShop: 'अपनी दुकान, उत्पादों और सेवाओं का वर्णन करें...',
      shopAddress: 'दुकान का पता',
      addressPlaceholder: 'जैसे, सेक्टर 18, नोएडा',
      coverImage: 'कवर इमेज URL',
      deliveryOptions: 'डिलीवरी विकल्प',
      offersDelivery: 'डिलीवरी की सुविधा',
      offersPickup: 'पिकअप की सुविधा',
      minimumOrder: 'न्यूनतम ऑर्डर (₹)',
      deliveryFee: 'डिलीवरी शुल्क (₹)',
      menuItems: 'मेनू आइटम',
      itemName: 'आइटम का नाम',
      price: 'कीमत',
      description: 'विवरण (वैकल्पिक)',
      add: 'जोड़ें',
      vegetarian: 'शाकाहारी',
      available: 'उपलब्ध',
      operatingHours: 'खुलने का समय',
      closed: 'बंद',
      to: 'से',
      shopFeatures: 'दुकान की सुविधाएं',
      featurePlaceholder: 'जैसे, पार्किंग, वाईफाई, एसी',
      paymentMethods: 'भुगतान के तरीके',
      paymentPlaceholder: 'जैसे, कार्ड, नेट बैंकिंग',
      save: 'सहेजें',
      updating: 'अपडेट हो रहा है...',
      creating: 'बन रहा है...',
      updateProfile: 'प्रोफ़ाइल अपडेट करें',
      createProfile: 'प्रोफ़ाइल बनाएं',
      getStarted: 'शुरू करें →',
      createYourShop: 'अपनी दुकान की प्रोफ़ाइल बनाएं',
      fillForm: 'बेचना शुरू करने के लिए नीचे दिया गया फॉर्म भरें',
      viewPublicProfile: 'सार्वजनिक प्रोफ़ाइल देखें →',
      liveNow: '🔴 लाइव',
      offline: '⚫ ऑफलाइन',
      youAreLive: '✅ आप अब लाइव हैं! ग्राहक आपको देख सकते हैं।',
      youAreOffline: 'आप अब ऑफलाइन हैं',
      locationDenied: 'लोकेशन की अनुमति नहीं दी गई',
      profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
      profileCreated: 'प्रोफ़ाइल सफलतापूर्वक बन गई!',
      menuAdded: 'मेनू आइटम जोड़ दिया गया!',
      menuDeleted: 'मेनू आइटम हटा दिया गया!',
      saveProfileFirst: 'मेनू आइटम जोड़ने से पहले कृपया अपनी प्रोफ़ाइल सहेजें',
      loading: 'लोड हो रहा है...'
    }
  }

  const text = translations[lang] || translations.en

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      window.location.href = '/login'
      return
    }
    fetchVendorProfile()
  }, [user])

  const fetchVendorProfile = async () => {
    try {
      const response = await vendorsAPI.getMyVendor()
      const vendorData = response.data?.data || response.data
      if (vendorData) {
        setVendor(vendorData)
        setIsLive(vendorData.isLive || false)
        setFormData({
          name: vendorData.name || '',
          phone: vendorData.phone || '',
          email: vendorData.email || '',
          shopType: vendorData.shopType || '',
          description: vendorData.description || '',
          address: vendorData.address || '',
          coverImage: vendorData.coverImage || '',
          offersDelivery: vendorData.offersDelivery || false,
          offersPickup: vendorData.offersPickup !== false,
          minimumOrderAmount: vendorData.minimumOrderAmount || '',
          deliveryFee: vendorData.deliveryFee || ''
        })
        setMenuItems(vendorData.menu || [])
        if (vendorData.operatingHours) setOperatingHours(vendorData.operatingHours)
        setFeatures(vendorData.features || [])
        setPaymentMethods(vendorData.paymentMethods || ['Cash', 'UPI'])
      }
    } catch (err) {
      console.log("No existing profile, will create new one")
      // If 401, user is not authenticated
      if (err.response?.status === 401) {
        logout()
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const addMenuItem = async () => {
    if (!vendor) {
      setMessage({ type: 'error', text: text.saveProfileFirst })
      return
    }
    if (newMenuItem.name && newMenuItem.price) {
      try {
        const response = await vendorsAPI.addMenuItem(vendor._id, newMenuItem)
        setMenuItems([...menuItems, response.data.data])
        setNewMenuItem({ name: '', price: '', description: '', category: 'Main Course', isAvailable: true, isVegetarian: false })
        setMessage({ type: 'success', text: text.menuAdded })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (err) {
        console.error('Add menu error:', err)
        if (err.response?.status === 401) {
          setMessage({ type: 'error', text: 'Session expired. Please login again.' })
          setTimeout(() => {
            logout()
            window.location.href = '/login'
          }, 2000)
        } else {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add menu item' })
        }
      }
    }
  }

  const deleteMenuItem = async (menuId) => {
    if (window.confirm(lang === 'hi' ? 'इस मेनू आइटम को हटाएं?' : 'Delete this menu item?')) {
      try {
        await vendorsAPI.deleteMenuItem(vendor._id, menuId)
        setMenuItems(menuItems.filter(item => item._id !== menuId))
        setMessage({ type: 'success', text: text.menuDeleted })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete menu item' })
      }
    }
  }

  const updateHours = (index, field, value) => {
    const updated = [...operatingHours]
    updated[index][field] = value
    setOperatingHours(updated)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()])
      setNewPaymentMethod('')
    }
  }

  const removePaymentMethod = (index) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index))
  }

  const goLive = async () => {
    if (!vendor) {
      setMessage({ type: 'error', text: text.saveProfileFirst })
      return
    }
    setLiveLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await vendorsAPI.goLive({
            vendorId: vendor._id,
            lat: coords.latitude,
            lng: coords.longitude
          })
          setIsLive(true)
          setMessage({ type: 'success', text: text.youAreLive })
          setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (err) {
          if (err.response?.status === 401) {
            setMessage({ type: 'error', text: 'Session expired. Please login again.' })
            setTimeout(() => {
              logout()
              window.location.href = '/login'
            }, 2000)
          } else {
            setMessage({ type: 'error', text: 'Failed to go live' })
          }
        }
        setLiveLoading(false)
      },
      () => {
        setMessage({ type: 'error', text: text.locationDenied })
        setLiveLoading(false)
      }
    )
  }

  const stopLive = async () => {
    try {
      await vendorsAPI.goLive({ vendorId: vendor._id })
      setIsLive(false)
      setMessage({ type: 'success', text: text.youAreOffline })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' })
        setTimeout(() => {
          logout()
          window.location.href = '/login'
        }, 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to stop live' })
      }
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const profileData = {
        ...formData,
        minimumOrderAmount: parseInt(formData.minimumOrderAmount) || 0,
        deliveryFee: parseInt(formData.deliveryFee) || 0,
        operatingHours: operatingHours,
        features: features,
        paymentMethods: paymentMethods,
        menu: menuItems
      }
      
      let response
      if (vendor) {
        response = await vendorsAPI.update(vendor._id, profileData)
        setMessage({ type: 'success', text: text.profileUpdated })
      } else {
        response = await vendorsAPI.register(profileData)
        setVendor(response.data.data)
        setMessage({ type: 'success', text: text.profileCreated })
      }
      setEditing(false)
      fetchVendorProfile()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Save error:', err)
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' })
        setTimeout(() => {
          logout()
          window.location.href = '/login'
        }, 2000)
      } else {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save profile' })
      }
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
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Header with Live Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, color: 'var(--ink)' }}>
              🏪 {vendor ? text.dashboard : text.completeProfile}
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              {vendor ? text.manageShop : text.setupShop}
            </p>
          </div>
          {vendor && (
            <div style={{ display: 'flex', gap: 12 }}>
              {/* LIVE BUTTON - Visible to vendors */}
              {isLive ? (
                <button
                  onClick={stopLive}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 100,
                    border: 'none',
                    background: '#dc2626',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  🔴 {text.stopLive}
                </button>
              ) : (
                <button
                  onClick={goLive}
                  disabled={liveLoading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 100,
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontWeight: 600,
                    cursor: liveLoading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  {liveLoading ? `📍 ${text.gettingLocation}` : `🟢 ${text.goLive}`}
                </button>
              )}
              <button
                onClick={() => setEditing(!editing)}
                className="btn-primary"
              >
                {editing ? text.cancel : `✏️ ${text.editProfile}`}
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={message.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 24,
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          {!vendor && !editing && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
              <h2>{text.createYourShop}</h2>
              <p style={{ marginBottom: 24 }}>{text.fillForm}</p>
              <button onClick={() => setEditing(true)} className="btn-primary">
                {text.getStarted}
              </button>
            </div>
          )}

          {(editing || !vendor) && (
            <div>
              <h2 style={{ marginBottom: 24 }}>{text.shopInformation}</h2>
              
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.shopName} *</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.phone} *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.email}</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.shopType} *</label>
                  <select name="shopType" value={formData.shopType} onChange={handleChange} className="select">
                    <option value="">{text.selectShopType}</option>
                    <option value="Food & Beverages">🍔 {text.foodBeverages}</option>
                    <option value="Clothing & Accessories">👕 {text.clothing}</option>
                    <option value="Electronics">📱 {text.electronics}</option>
                    <option value="Grocery">🛒 {text.grocery}</option>
                    <option value="Services">⚡ {text.services}</option>
                    <option value="Handicrafts">🎨 {text.handicrafts}</option>
                    <option value="Other">📦 {text.other}</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.shopDescription}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input" placeholder={text.describeShop} />
              </div>

              {/* Address */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.shopAddress}</label>
                <input name="address" value={formData.address} onChange={handleChange} className="input" placeholder={text.addressPlaceholder} />
              </div>

              {/* Cover Image URL */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{text.coverImage}</label>
                <input name="coverImage" value={formData.coverImage} onChange={handleChange} className="input" placeholder="https://..." />
              </div>

              {/* Delivery Options */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{text.deliveryOptions}</h3>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="offersDelivery" checked={formData.offersDelivery} onChange={handleChange} />
                    {text.offersDelivery}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="offersPickup" checked={formData.offersPickup} onChange={handleChange} />
                    {text.offersPickup}
                  </label>
                </div>
                {formData.offersDelivery && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>{text.minimumOrder}</label>
                      <input type="number" name="minimumOrderAmount" value={formData.minimumOrderAmount} onChange={handleChange} className="input" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>{text.deliveryFee}</label>
                      <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} className="input" />
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{text.menuItems}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {menuItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--surface-2)', borderRadius: 8 }}>
                      <div>
                        <strong>{item.name}</strong> - ₹{item.price}
                        {item.description && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>• {item.description}</span>}
                        {item.isVegetarian && <span style={{ marginLeft: 8 }}>🥬</span>}
                        {!item.isAvailable && <span style={{ marginLeft: 8, color: '#dc2626' }}>{lang === 'hi' ? 'बिक चुका' : 'Sold Out'}</span>}
                      </div>
                      <button onClick={() => deleteMenuItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 20 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                  <input value={newMenuItem.name} onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })} className="input" placeholder={text.itemName} />
                  <input type="number" value={newMenuItem.price} onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })} className="input" placeholder={text.price} />
                  <input value={newMenuItem.description} onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })} className="input" placeholder={text.description} />
                  <button onClick={addMenuItem} className="btn-primary" style={{ padding: '11px 20px' }}>{text.add}</button>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={newMenuItem.isVegetarian} onChange={(e) => setNewMenuItem({ ...newMenuItem, isVegetarian: e.target.checked })} />
                    {text.vegetarian}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={newMenuItem.isAvailable} onChange={(e) => setNewMenuItem({ ...newMenuItem, isAvailable: e.target.checked })} />
                    {text.available}
                  </label>
                </div>
              </div>

              {/* Operating Hours */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{text.operatingHours}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {operatingHours.map((slot, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ width: 100, fontWeight: 600 }}>{slot.day}</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" checked={slot.isClosed} onChange={(e) => updateHours(idx, 'isClosed', e.target.checked)} />
                        {text.closed}
                      </label>
                      {!slot.isClosed && (
                        <>
                          <input type="time" value={slot.open} onChange={(e) => updateHours(idx, 'open', e.target.value)} className="input" style={{ width: 120 }} />
                          <span>{text.to}</span>
                          <input type="time" value={slot.close} onChange={(e) => updateHours(idx, 'close', e.target.value)} className="input" style={{ width: 120 }} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{text.shopFeatures}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {features.map((feature, idx) => (
                    <span key={idx} className="badge-mint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      ✨ {feature}
                      <button onClick={() => removeFeature(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} className="input" placeholder={text.featurePlaceholder} />
                  <button onClick={addFeature} className="btn-primary" style={{ padding: '11px 20px' }}>{text.add}</button>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{text.paymentMethods}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {paymentMethods.map((method, idx) => (
                    <span key={idx} className="badge-mint" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      💳 {method}
                      <button onClick={() => removePaymentMethod(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} className="input" placeholder={text.paymentPlaceholder} />
                  <button onClick={addPaymentMethod} className="btn-primary" style={{ padding: '11px 20px' }}>{text.add}</button>
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={saveProfile} className="btn-primary" disabled={saving} style={{ padding: '12px 32px' }}>
                  {saving ? (vendor ? text.updating : text.creating) : (vendor ? text.updateProfile : text.createProfile)}
                </button>
              </div>
            </div>
          )}

          {/* View Profile Mode */}
          {vendor && !editing && (
            <div>
              {/* Live Status Banner */}
              <div style={{
                background: isLive ? '#dcfce7' : '#fef2f2',
                padding: 16,
                borderRadius: 12,
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <strong style={{ color: isLive ? '#166534' : '#991b1b' }}>
                    {isLive ? '🟢 Your shop is LIVE!' : '⚫ Your shop is offline'}
                  </strong>
                  <p style={{ fontSize: 12, marginTop: 4, color: isLive ? '#166534' : '#991b1b' }}>
                    {isLive 
                      ? 'Customers can see your shop and menu right now!' 
                      : 'Go live to let customers find you'}
                  </p>
                </div>
                <button
                  onClick={isLive ? stopLive : goLive}
                  className={isLive ? 'btn-danger' : 'btn-primary'}
                  style={{ padding: '8px 20px' }}
                >
                  {isLive ? '🔴 Stop Live' : '🟢 Go Live'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
                <div style={{ flex: 1 }}>
                  <h3>{text.shopInformation}</h3>
                  <p><strong>{text.shopName}:</strong> {vendor.name}</p>
                  <p><strong>{text.phone}:</strong> {vendor.phone}</p>
                  <p><strong>{text.shopType}:</strong> {vendor.shopType}</p>
                  <p><strong>{text.shopAddress}:</strong> {vendor.address || (lang === 'hi' ? 'सेट नहीं' : 'Not set')}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h3>{lang === 'hi' ? 'विवरण' : 'About'}</h3>
                  <p>{vendor.description || (lang === 'hi' ? 'कोई विवरण नहीं जोड़ा गया' : 'No description added yet')}</p>
                </div>
              </div>

              {vendor.menu?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3>{text.menuItems}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {vendor.menu.map((item, idx) => (
                      <div key={idx} style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 8 }}>
                        <strong>{item.name}</strong> - ₹{item.price}
                        {item.description && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>• {item.description}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vendor.features?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3>{text.shopFeatures}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {vendor.features.map((feature, idx) => <span key={idx} className="badge-mint">✨ {feature}</span>)}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Link to={`/vendors/${vendor._id}`} className="btn-primary">
                  {text.viewPublicProfile}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}