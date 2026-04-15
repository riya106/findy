import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (type, isLive = false) => {
  let color, icon, size;
  
  switch(type) {
    case 'vendor':
      color = isLive ? '#10b981' : '#f59e0b';
      icon = isLive ? '🟢' : '🏪';
      size = 36;
      break;
    case 'listing':
      color = '#8b5a2b';
      icon = '📋';
      size = 32;
      break;
    default:
      color = '#4a7c59';
      icon = '📍';
      size = 30;
  }
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size - 8}px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        border: 2px solid white;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        ${icon}
      </div>
    `,
    iconSize: [size, size],
    popupAnchor: [0, -size/2]
  });
};

export default function IndianMap({ places, userLocation }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  // Handle place click navigation
  const handlePlaceClick = (place) => {
    console.log("📍 Marker clicked:", place);
    
    if (place.isVendor) {
      navigate(`/vendors/${place._id}`);
    } else if (place.isListing) {
      navigate(`/listings/${place._id}`);
    }
  };

  useEffect(() => {
    if (!mapRef.current && userLocation) {
      // Initialize map
      mapRef.current = L.map('indian-map').setView([userLocation.lat, userLocation.lng], 14);
      
      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapRef.current);
      
      // Add user location marker
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="
            background: #10b981;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.3);
            border: 2px solid white;
            animation: pulse 1.5s infinite;
          "></div>
          <style>
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
              70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
              100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
            }
          </style>
        `,
        iconSize: [20, 20]
      });
      
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('<strong>📍 You are here</strong>')
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
    if (!mapRef.current || !places || places.length === 0) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for each place
    places.forEach(place => {
      const lat = place.lat || place.location?.lat || place.location?.coordinates?.[1];
      const lng = place.lng || place.location?.lng || place.location?.coordinates?.[0];
      
      if (!lat || !lng) return;
      
      let type = 'place';
      if (place.isVendor) type = 'vendor';
      if (place.isListing) type = 'listing';
      
      const isLive = place.isLive || false;
      const icon = createCustomIcon(type, isLive);
      
      // Create popup content with clickable button
      const popupContent = `
        <div style="
          font-family: 'DM Sans', sans-serif;
          min-width: 180px;
          padding: 4px;
        ">
          <div style="
            font-weight: 700;
            font-size: 14px;
            color: #1a1a1a;
            margin-bottom: 4px;
          ">
            ${type === 'vendor' ? '🏪' : type === 'listing' ? '📋' : '📍'} ${place.name || 'Place'}
          </div>
          <div style="
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
          ">
            ${place.shopType || place.type || 'Local Business'}
            ${isLive ? '<span style="color: #10b981; margin-left: 6px;">🟢 Live Now</span>' : ''}
          </div>
          ${place.distance ? `<div style="font-size: 11px; color: #f59e0b; margin-bottom: 8px;">📏 ${place.distance.toFixed(1)} km away</div>` : ''}
          <button 
            data-id="${place._id}"
            data-type="${type}"
            data-name="${place.name}"
            class="map-view-details-btn"
            style="
              background: #10b981;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 11px;
              cursor: pointer;
              width: 100%;
              font-weight: 600;
            "
          >
            View Details →
          </button>
        </div>
      `;
      
      const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
      marker.bindPopup(popupContent);
      
      // Add click event to popup button
      marker.on('popupopen', () => {
        const btn = document.querySelector('.map-view-details-btn');
        if (btn) {
          btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
            if (type === 'vendor') {
              navigate(`/vendors/${id}`);
            } else if (type === 'listing') {
              navigate(`/listings/${id}`);
            }
          };
        }
      });
      
      markersRef.current.push(marker);
    });
    
    // Fit bounds to show all markers
    if (markersRef.current.length > 0 && mapRef.current && userLocation) {
      const bounds = markersRef.current.map(m => m.getLatLng());
      bounds.push([userLocation.lat, userLocation.lng]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, userLocation, navigate]);

  return (
    <div 
      id="indian-map" 
      style={{ 
        width: '100%', 
        height: '500px', 
        borderRadius: '20px',
        overflow: 'hidden',
        border: '2px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }} 
    />
  );
}