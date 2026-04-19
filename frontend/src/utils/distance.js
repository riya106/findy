// Calculate distance between two coordinates in kilometers (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Filter items by distance
export const filterByDistance = (items, userLat, userLng, radiusKm = 10) => {
  if (!userLat || !userLng) return items;
  
  return items.filter(item => {
    // Try to get coordinates from different possible locations
    let itemLat = item.location?.lat || item.location?.coordinates?.[1];
    let itemLng = item.location?.lng || item.location?.coordinates?.[0];
    
    if (itemLat && itemLng) {
      const distance = calculateDistance(userLat, userLng, itemLat, itemLng);
      return distance <= radiusKm;
    }
    
    return true; // Keep items without coordinates
  }).map(item => {
    // Add distance to item
    let itemLat = item.location?.lat || item.location?.coordinates?.[1];
    let itemLng = item.location?.lng || item.location?.coordinates?.[0];
    if (itemLat && itemLng) {
      item.distance = calculateDistance(userLat, userLng, itemLat, itemLng);
    }
    return item;
  }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
};