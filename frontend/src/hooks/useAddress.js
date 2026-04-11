import { useState, useEffect } from 'react'

export function useAddress(lat, lng) {
  const [address, setAddress] = useState('Fetching location...')

  useEffect(() => {
    if (!lat || !lng) {
      setAddress('Location not set')
      return
    }

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const addr = data.address
        const place =
          addr.suburb ||
          addr.neighbourhood ||
          addr.village ||
          addr.town ||
          addr.county ||
          addr.state_district ||
          'Unknown area'
        const city =
          addr.city ||
          addr.town ||
          addr.state_district ||
          addr.state ||
          ''
        setAddress(city ? `${place}, ${city}` : place)
      })
      .catch(() => {
        setAddress(`${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`)
      })
  }, [lat, lng])

  return address
}