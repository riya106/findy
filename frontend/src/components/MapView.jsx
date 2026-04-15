import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different types
const vendorIcon = L.divIcon({
  className: 'custom-vendor-icon',
  html: '🏪',
  iconSize: [30, 30],
  popupAnchor: [0, -15]
});

const listingIcon = L.divIcon({
  className: 'custom-listing-icon',
  html: '📍',
  iconSize: [30, 30],
  popupAnchor: [0, -15]
});

const placeIcon = L.divIcon({
  className: 'custom-place-icon',
  html: '🏞️',
  iconSize: [30, 30],
  popupAnchor: [0, -15]
});

export default function MapView({ places, userLocation, onPlaceClick }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current && userLocation) {
      // Initialize map
      mapRef.current = L.map('map').setView([userLocation.lat, userLocation.lng], 14);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapRef.current);
      
      // Add user location marker
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: '📍',
          iconSize: [25, 25]
        })
      }).addTo(mapRef.current)
        .bindPopup('You are here')
        .openPopup();
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current || !places.length) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for each place
    places.forEach(place => {
      const lat = place.location?.lat || place.location?.coordinates?.[1];
      const lng = place.location?.lng || place.location?.coordinates?.[0];
      
      if (!lat || !lng) return;
      
      let icon;
      let popupContent;
      
      if (place.isVendor) {
        icon = vendorIcon;
        popupContent = `
          <div style="min-width: 150px;">
            <strong>🏪 ${place.name}</strong><br/>
            <span style="color: #666;">${place.type || 'Vendor'}</span><br/>
            ${place.isLive ? '<span style="color: #10b981;">🟢 Live Now</span>' : ''}<br/>
            <button onclick="window.dispatchEvent(new CustomEvent('placeClick', { detail: { id: '${place._id}', type: 'vendor' } }))" 
              style="margin-top: 8px; padding: 4px 12px; background: #10b981; color: white; border: none; border-radius: 20px; cursor: pointer;">
              View Details →
            </button>
          </div>
        `;
      } else if (place.isListing) {
        icon = listingIcon;
        popupContent = `
          <div style="min-width: 150px;">
            <strong>📋 ${place.name}</strong><br/>
            <span style="color: #666;">${place.type || 'Listing'}</span><br/>
            ${place.price ? `<span style="color: #10b981;">₹${place.price}</span>` : ''}<br/>
            <button onclick="window.dispatchEvent(new CustomEvent('placeClick', { detail: { id: '${place._id}', type: 'listing' } }))" 
              style="margin-top: 8px; padding: 4px 12px; background: #10b981; color: white; border: none; border-radius: 20px; cursor: pointer;">
              View Details →
            </button>
          </div>
        `;
      } else {
        icon = placeIcon;
        popupContent = `
          <div style="min-width: 150px;">
            <strong>📍 ${place.name}</strong><br/>
            <span style="color: #666;">${place.type || 'Place'}</span><br/>
            <button onclick="window.dispatchEvent(new CustomEvent('placeClick', { detail: { id: '${place._id}', type: 'place' } }))" 
              style="margin-top: 8px; padding: 4px 12px; background: #10b981; color: white; border: none; border-radius: 20px; cursor: pointer;">
              View Details →
            </button>
          </div>
        `;
      }
      
      const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
    
    // Fit bounds to show all markers
    if (markersRef.current.length > 0 && mapRef.current) {
      const bounds = markersRef.current.map(m => m.getLatLng());
      bounds.push([userLocation.lat, userLocation.lng]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, userLocation]);

  // Listen for custom events
  useEffect(() => {
    const handlePlaceClick = (e) => {
      if (onPlaceClick) {
        onPlaceClick(e.detail);
      }
    };
    
    window.addEventListener('placeClick', handlePlaceClick);
    return () => window.removeEventListener('placeClick', handlePlaceClick);
  }, [onPlaceClick]);

  return (
    <div 
      id="map" 
      style={{ 
        width: '100%', 
        height: '500px', 
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }} 
    />
  );
}