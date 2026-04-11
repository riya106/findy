import { useGeolocation } from '../hooks/useGeolocation'

export default function LocationButton({ onLocation, label = 'Use My Location' }) {
  const { loading, error, getLocation, coords } = useGeolocation()

  const handleClick = async () => {
    getLocation()
  }

  // fire callback when coords arrive
  if (coords && onLocation) {
    onLocation(coords)
  }

  return (
    <div>
      <button
        className="btn-outline"
        onClick={handleClick}
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading ? 'Detecting location…' : `📍 ${label}`}
      </button>
      {error && <p style={{ fontSize: 12, color: '#991b1b', marginTop: 6 }}>{error}</p>}
      {coords && (
        <p style={{ fontSize: 12, color: 'var(--mint)', marginTop: 6 }}>
          ✓ Location captured ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
        </p>
      )}
    </div>
  )
}