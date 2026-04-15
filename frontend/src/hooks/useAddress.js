import { useState, useEffect } from 'react'

export function useAddress(lat, lng) {
  const [address, setAddress] = useState('Location not available')

  useEffect(() => {
    if (!lat || !lng) {
      setAddress('Location not available')
      return
    }

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const addr = data.address
        if (!addr) {
          setAddress(`${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`)
          return
        }
        const place = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.county || addr.state_district || 'Unknown area'
        const city = addr.city || addr.town || addr.state_district || addr.state || ''
        const result = city ? `${place}, ${city}` : place
        setAddress(result || `${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`)
      })
      .catch(() => {
        setAddress(`${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`)
      })
  }, [lat, lng])

  return address
}