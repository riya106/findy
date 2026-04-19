import { useState, useEffect } from 'react'
import { useAuth } from '../context/authcontext'
import { useLang } from '../context/LanguageContext'
import { vendorsAPI } from '../services/api'
import { Link } from 'react-router-dom'

export default function VendorDashboardPage() {
  const { user } = useAuth()
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
    lat: null,
    lng: null,
    offersDelivery: false,
    offersPickup: true,
    minimumOrderAmount: '',
    deliveryFee: ''
  })
  
  const [addressInput, setAddressInput] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)
  
  // Menu Items - Keep this as the source of truth
  const [menuItems, setMenuItems] = useState([])
  const [newMenuItem, setNewMenuItem] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: 'Main Course', 
    isAvailable: true, 
    isVegetarian: false 
  })
  
  // Operating Hours
  const [operatingHours, setOperatingHours] = useState([
    { day: "Monday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Tuesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Wednesday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Thursday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Friday", open: "09:00 AM", close: "09:00 PM", isClosed: false },
    { day: "Saturday", open: "10:00 AM", close: "10:00 PM", isClosed: false },
    { day: "Sunday", open: "10:00 AM", close: "08:00 PM", isClosed: false }
  ])
  
  // Features
  const [features, setFeatures] = useState([])
  const [newFeature, setNewFeature] = useState('')
  
  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState(['Cash', 'UPI'])
  const [newPaymentMethod, setNewPaymentMethod] = useState('')
  
  const [message, setMessage] = useState({ type: '', text: '' })

  const t = {
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
      addressPlaceholder: 'Enter your full shop address',
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
      liveNow: '🟢 LIVE NOW',
      offline: '⚫ OFFLINE',
      youAreLive: '✅ You are now LIVE! Customers can see you.',
      youAreOffline: 'You are now offline',
      locationDenied: 'Location permission denied',
      profileUpdated: 'Profile updated successfully!',
      profileCreated: 'Profile created successfully!',
      menuAdded: 'Menu item added successfully!',
      menuDeleted: 'Menu item deleted successfully!',
      saveProfileFirst: 'Please save your profile first before adding menu items',
      loading: 'Loading...',
      noProfile: 'You haven\'t created your shop profile yet.',
      location: 'Shop Location',
      useCurrentLocation: '📍 Use My Current Location',
      searchAddress: '🔍 Search',
      locationUpdated: 'Location updated successfully!',
      about: 'About',
      soldOut: 'Sold Out',
      menuWillBeSaved: ' (will be saved when you save profile)'
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
      addressPlaceholder: 'अपना पूरा दुकान का पता दर्ज करें',
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
      liveNow: '🟢 लाइव',
      offline: '⚫ ऑफलाइन',
      youAreLive: '✅ आप अब लाइव हैं! ग्राहक आपको देख सकते हैं।',
      youAreOffline: 'आप अब ऑफलाइन हैं',
      locationDenied: 'लोकेशन की अनुमति नहीं दी गई',
      profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
      profileCreated: 'प्रोफ़ाइल सफलतापूर्वक बन गई!',
      menuAdded: 'मेनू आइटम सफलतापूर्वक जोड़ दिया गया!',
      menuDeleted: 'मेनू आइटम सफलतापूर्वक हटा दिया गया!',
      saveProfileFirst: 'मेनू आइटम जोड़ने से पहले कृपया अपनी प्रोफ़ाइल सहेजें',
      loading: 'लोड हो रहा है...',
      noProfile: 'आपने अभी तक अपनी दुकान की प्रोफ़ाइल नहीं बनाई है।',
      location: 'दुकान का स्थान',
      useCurrentLocation: '📍 मेरा वर्तमान स्थान उपयोग करें',
      searchAddress: '🔍 खोजें',
      locationUpdated: 'स्थान सफलतापूर्वक अपडेट हो गया!',
      about: 'हमारे बारे में',
      soldOut: 'बिक गया',
      menuWillBeSaved: ' (प्रोफ़ाइल सहेजने पर सुरक्षित हो जाएगा)'
    }
  }

  const language = t[lang] || t.en

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    fetchVendorProfile()
  }, [user])

  // Sync menuItems when vendor changes (important for edit mode)
  useEffect(() => {
    if (vendor && vendor.menu) {
      setMenuItems(vendor.menu)
    }
  }, [vendor])

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
          lat: vendorData.location?.lat || null,
          lng: vendorData.location?.lng || null,
          offersDelivery: vendorData.offersDelivery || false,
          offersPickup: vendorData.offersPickup !== false,
          minimumOrderAmount: vendorData.minimumOrderAmount || '',
          deliveryFee: vendorData.deliveryFee || ''
        })
        setAddressInput(vendorData.address || '')
        setMenuItems(vendorData.menu || [])
        if (vendorData.operatingHours) setOperatingHours(vendorData.operatingHours)
        setFeatures(vendorData.features || [])
        setPaymentMethods(vendorData.paymentMethods || ['Cash', 'UPI'])
      }
    } catch (err) {
      console.log("No existing profile, will create new one")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
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
        setMessage({ type: 'error', text: language.locationDenied })
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Menu Item Functions - ADD
  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      setMessage({ type: 'error', text: 'Please enter item name and price' })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      return
    }
    
    // If vendor exists (profile already saved), save to backend
    if (vendor) {
      try {
        const menuItemData = {
          name: newMenuItem.name,
          price: parseInt(newMenuItem.price),
          description: newMenuItem.description || '',
          category: newMenuItem.category,
          isAvailable: newMenuItem.isAvailable,
          isVegetarian: newMenuItem.isVegetarian
        }
        
        const response = await vendorsAPI.addMenuItem(vendor._id, menuItemData)
        const newItem = response.data.data
        
        // Update all states
        setMenuItems(prevItems => [...prevItems, newItem])
        setVendor(prev => prev ? {
          ...prev,
          menu: [...(prev.menu || []), newItem]
        } : prev)
        
        setNewMenuItem({ name: '', price: '', description: '', category: 'Main Course', isAvailable: true, isVegetarian: false })
        setMessage({ type: 'success', text: language.menuAdded })
        setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      } catch (err) {
        console.error('Add menu error:', err)
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add menu item' })
        setTimeout(() => setMessage({ type: '', text: '' }), 2000)
      }
    } else {
      // If no vendor yet, add to local state with temp ID
      const newItem = {
        _id: 'temp_' + Date.now(),
        name: newMenuItem.name,
        price: parseInt(newMenuItem.price),
        description: newMenuItem.description || '',
        category: newMenuItem.category,
        isAvailable: newMenuItem.isAvailable,
        isVegetarian: newMenuItem.isVegetarian
      }
      
      setMenuItems(prevItems => [...prevItems, newItem])
      setNewMenuItem({ name: '', price: '', description: '', category: 'Main Course', isAvailable: true, isVegetarian: false })
      setMessage({ type: 'success', text: language.menuAdded + language.menuWillBeSaved })
      setTimeout(() => setMessage({ type: '', text: '' }), 2000)
    }
  }

  // Menu Item Functions - DELETE
  const deleteMenuItem = async (menuId) => {
    if (!menuId) {
      setMessage({ type: 'error', text: 'Invalid menu item' })
      return
    }
    
    if (window.confirm(lang === 'hi' ? 'इस मेनू आइटम को हटाएं?' : 'Delete this menu item?')) {
      // If vendor exists and this is not a temp ID, delete from backend
      if (vendor && !menuId.toString().startsWith('temp')) {
        try {
          await vendorsAPI.deleteMenuItem(vendor._id, menuId)
          
          // Update states
          setMenuItems(prevItems => prevItems.filter(item => item._id !== menuId))
          setVendor(prev => prev ? {
            ...prev,
            menu: prev.menu.filter(item => item._id !== menuId)
          } : prev)
          
          setMessage({ type: 'success', text: language.menuDeleted })
          setTimeout(() => setMessage({ type: '', text: '' }), 2000)
        } catch (err) {
          console.error('Delete error:', err)
          setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete menu item' })
          setTimeout(() => setMessage({ type: '', text: '' }), 2000)
        }
      } else {
        // Remove from local state only
        setMenuItems(prevItems => prevItems.filter(item => item._id !== menuId))
        setMessage({ type: 'success', text: language.menuDeleted })
        setTimeout(() => setMessage({ type: '', text: '' }), 2000)
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
      setMessage({ type: 'error', text: language.saveProfileFirst })
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
          setMessage({ type: 'success', text: language.youAreLive })
          setTimeout(() => setMessage({ type: '', text: '' }), 3000)
          // Refresh vendor data
          await fetchVendorProfile()
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to go live' })
        }
        setLiveLoading(false)
      },
      () => {
        setMessage({ type: 'error', text: language.locationDenied })
        setLiveLoading(false)
      }
    )
  }

  const stopLive = async () => {
    try {
      await vendorsAPI.goLive({ vendorId: vendor._id })
      setIsLive(false)
      setMessage({ type: 'success', text: language.youAreOffline })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      await fetchVendorProfile()
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to stop live' })
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      // Format menu items properly - remove temp IDs for backend
      const formattedMenuItems = menuItems.map(item => {
        const { _id, ...rest } = item
        // Only include _id if it's not a temporary ID
        if (_id && !_id.toString().startsWith('temp')) {
          return { _id, ...rest }
        }
        return rest
      })
      
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        shopType: formData.shopType,
        description: formData.description,
        address: formData.address,
        coverImage: formData.coverImage,
        location: { lat: formData.lat, lng: formData.lng },
        offersDelivery: formData.offersDelivery,
        offersPickup: formData.offersPickup,
        minimumOrderAmount: parseInt(formData.minimumOrderAmount) || 0,
        deliveryFee: parseInt(formData.deliveryFee) || 0,
        operatingHours: operatingHours,
        features: features,
        paymentMethods: paymentMethods,
        menu: formattedMenuItems
      }
      
      if (vendor) {
        const response = await vendorsAPI.update(vendor._id, profileData)
        setMessage({ type: 'success', text: language.profileUpdated })
        // Refresh the vendor data
        await fetchVendorProfile()
      } else {
        const response = await vendorsAPI.register(profileData)
        setVendor(response.data.data)
        setMessage({ type: 'success', text: language.profileCreated })
        // Refresh to get the saved menu with real IDs
        await fetchVendorProfile()
      }
      setEditing(false)
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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>{language.loading}</p>
        </div>
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
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, color: 'var(--ink)' }}>
              🏪 {vendor ? language.dashboard : language.completeProfile}
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              {vendor ? language.manageShop : language.setupShop}
            </p>
          </div>
          {vendor && (
            <div style={{ display: 'flex', gap: 12 }}>
              {isLive ? (
                <button onClick={stopLive} className="btn-danger" style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                  🔴 {language.stopLive}
                </button>
              ) : (
                <button onClick={goLive} disabled={liveLoading} className="btn-primary" style={{ background: 'var(--mint)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                  {liveLoading ? `📍 ${language.gettingLocation}` : `🟢 ${language.goLive}`}
                </button>
              )}
              <button onClick={() => setEditing(!editing)} className="btn-primary" style={{ background: 'var(--mint)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                {editing ? language.cancel : `✏️ ${language.editProfile}`}
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={message.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginBottom: 20, padding: '12px 20px', borderRadius: 12, background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
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
          
          {!vendor && !editing && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
              <h2>{language.createYourShop}</h2>
              <p style={{ marginBottom: 24 }}>{language.fillForm}</p>
              <button onClick={() => setEditing(true)} className="btn-primary" style={{ background: 'var(--mint)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                {language.getStarted}
              </button>
            </div>
          )}

          {(editing || !vendor) && (
            <div>
              <h2 style={{ marginBottom: 24 }}>{language.shopInformation}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.shopName} *</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="input" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.phone} *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="input" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.email}</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="input" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.shopType} *</label>
                  <select name="shopType" value={formData.shopType} onChange={handleChange} className="select" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <option value="">{language.selectShopType}</option>
                    <option value="Food & Beverages">🍔 {language.foodBeverages}</option>
                    <option value="Clothing & Accessories">👕 {language.clothing}</option>
                    <option value="Electronics">📱 {language.electronics}</option>
                    <option value="Grocery">🛒 {language.grocery}</option>
                    <option value="Services">⚡ {language.services}</option>
                    <option value="Handicrafts">🎨 {language.handicrafts}</option>
                    <option value="Other">📦 {language.other}</option>
                  </select>
                </div>
              </div>

              {/* Location Section */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>📍 {language.location}</label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="input"
                    placeholder={language.addressPlaceholder}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}
                  />
                  <button onClick={searchAddress} className="btn-primary" style={{ padding: '11px 20px', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }} disabled={locationLoading}>
                    {locationLoading ? '...' : language.searchAddress}
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
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: idx < addressSuggestions.length - 1 ? '1px solid var(--border)' : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--mint-soft)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontSize: 13 }}>{suggestion.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={useCurrentLocation}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 13
                  }}
                >
                  📍 {language.useCurrentLocation}
                </button>
                
                {formData.address && (
                  <div style={{
                    marginTop: 10,
                    padding: 10,
                    background: 'var(--mint-soft)',
                    borderRadius: 8,
                    fontSize: 12
                  }}>
                    📌 {formData.address}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.shopDescription}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input" placeholder={language.describeShop} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>{language.coverImage}</label>
                <input name="coverImage" value={formData.coverImage} onChange={handleChange} className="input" placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>

              {/* Delivery Options */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>{language.deliveryOptions}</h3>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="offersDelivery" checked={formData.offersDelivery} onChange={handleChange} />
                    {language.offersDelivery}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="offersPickup" checked={formData.offersPickup} onChange={handleChange} />
                    {language.offersPickup}
                  </label>
                </div>
                {formData.offersDelivery && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>{language.minimumOrder}</label>
                      <input type="number" name="minimumOrderAmount" value={formData.minimumOrderAmount} onChange={handleChange} className="input" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6 }}>{language.deliveryFee}</label>
                      <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} className="input" style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>📋 {language.menuItems}</h3>
                
                {/* Display existing menu items */}
                {menuItems.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {menuItems.map((item, idx) => (
                      <div key={item._id || idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '14px 16px', 
                        background: 'var(--surface-2)', 
                        borderRadius: 12,
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: 16, color: 'var(--ink)' }}>{item.name}</strong>
                            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--mint)' }}>₹{item.price}</span>
                            {item.isVegetarian && <span style={{ fontSize: 14 }}>🥬</span>}
                            {!item.isAvailable && <span style={{ fontSize: 11, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: 20 }}>{language.soldOut}</span>}
                          </div>
                          {item.description && (
                            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{item.description}</div>
                          )}
                        </div>
                        <button 
                          onClick={() => deleteMenuItem(item._id)} 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#dc2626', 
                            fontSize: 22,
                            padding: '8px',
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new menu item form */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 0.8fr 1.2fr auto', 
                  gap: 10, 
                  alignItems: 'center',
                  marginTop: menuItems.length > 0 ? 16 : 0
                }}>
                  <input 
                    value={newMenuItem.name} 
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })} 
                    className="input" 
                    placeholder={language.itemName}
                    style={{ fontSize: 14, padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}
                  />
                  <input 
                    type="number" 
                    value={newMenuItem.price} 
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })} 
                    className="input" 
                    placeholder={language.price}
                    style={{ fontSize: 14, padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}
                  />
                  <input 
                    value={newMenuItem.description} 
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })} 
                    className="input" 
                    placeholder={language.description}
                    style={{ fontSize: 14, padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}
                  />
                  <button 
                    onClick={addMenuItem} 
                    className="btn-primary" 
                    style={{ padding: '11px 20px', whiteSpace: 'nowrap', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}
                  >
                    + {language.add}
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input 
                      type="checkbox" 
                      checked={newMenuItem.isVegetarian} 
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, isVegetarian: e.target.checked })} 
                    />
                    🌱 {language.vegetarian}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input 
                      type="checkbox" 
                      checked={newMenuItem.isAvailable} 
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, isAvailable: e.target.checked })} 
                    />
                    ✅ {language.available}
                  </label>
                </div>
              </div>

              {/* Operating Hours */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>🕐 {language.operatingHours}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {operatingHours.map((slot, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ width: 100, fontWeight: 600, color: 'var(--ink)' }}>{slot.day}</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" checked={slot.isClosed} onChange={(e) => updateHours(idx, 'isClosed', e.target.checked)} />
                        {language.closed}
                      </label>
                      {!slot.isClosed && (
                        <>
                          <input type="time" value={slot.open} onChange={(e) => updateHours(idx, 'open', e.target.value)} className="input" style={{ width: 120, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                          <span>{language.to}</span>
                          <input type="time" value={slot.close} onChange={(e) => updateHours(idx, 'close', e.target.value)} className="input" style={{ width: 120, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>✨ {language.shopFeatures}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {features.map((feature, idx) => (
                    <span key={idx} className="badge-mint" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--mint-soft)', borderRadius: 40, fontSize: 13 }}>
                      ✨ {feature}
                      <button onClick={() => removeFeature(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} className="input" placeholder={language.featurePlaceholder} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                  <button onClick={addFeature} className="btn-primary" style={{ padding: '11px 20px', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}>{language.add}</button>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>💳 {language.paymentMethods}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {paymentMethods.map((method, idx) => (
                    <span key={idx} className="badge-mint" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--mint-soft)', borderRadius: 40, fontSize: 13 }}>
                      💳 {method}
                      <button onClick={() => removePaymentMethod(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newPaymentMethod} onChange={(e) => setNewPaymentMethod(e.target.value)} className="input" placeholder={language.paymentPlaceholder} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                  <button onClick={addPaymentMethod} className="btn-primary" style={{ padding: '11px 20px', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}>{language.add}</button>
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                {vendor && (
                  <button onClick={() => setEditing(false)} className="btn-outline" style={{ padding: '12px 24px', borderRadius: 40, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>
                    {language.cancel}
                  </button>
                )}
                <button onClick={saveProfile} className="btn-primary" disabled={saving} style={{ padding: '12px 32px', background: 'var(--mint)', color: 'white', border: 'none', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                  {saving ? (vendor ? language.updating : language.creating) : (vendor ? language.updateProfile : language.createProfile)}
                </button>
              </div>
            </div>
          )}

          {/* View Profile Mode */}
          {vendor && !editing && (
            <div>
              <div style={{
                background: isLive ? '#dcfce7' : '#fee2e2',
                padding: 16,
                borderRadius: 12,
                textAlign: 'center',
                marginBottom: 24
              }}>
                <strong style={{ color: isLive ? '#166534' : '#991b1b' }}>
                  {isLive ? language.liveNow : language.offline}
                </strong>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{language.shopInformation}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <p><strong>{language.shopName}:</strong> {vendor.name}</p>
                  <p><strong>{language.phone}:</strong> {vendor.phone}</p>
                  <p><strong>{language.shopType}:</strong> {vendor.shopType}</p>
                  <p><strong>{language.shopAddress}:</strong> {vendor.address || 'Not set'}</p>
                </div>
              </div>

              {vendor.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{language.about}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{vendor.description}</p>
                </div>
              )}

              {menuItems.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>📋 {language.menuItems}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {menuItems.map((item, idx) => (
                      <div key={idx} style={{ 
                        padding: '12px 16px', 
                        background: 'var(--surface-2)', 
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{item.name}</strong>
                          {item.description && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>• {item.description}</span>}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--mint)' }}>₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setEditing(true)} className="btn-primary" style={{ background: 'var(--mint)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
                  ✏️ {language.editProfile}
                </button>
                <Link to={`/vendors/${vendor._id}`} className="btn-outline" style={{ padding: '12px 24px', borderRadius: 40, border: '1px solid var(--border)', background: 'transparent', textDecoration: 'none', color: 'var(--ink)' }}>
                  {language.viewPublicProfile} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}