import { useState, useCallback } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    // Use high accuracy for exact location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        console.log("📍 EXACT LOCATION FOUND:", { lat, lng });
        console.log("Accuracy:", position.coords.accuracy, "meters");
        
        setCoords({ lat, lng });
        
        // Get address from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) {
            setAddress(data.display_name);
            console.log("📍 Address:", data.display_name);
          }
        } catch (err) {
          console.error("Error getting address:", err);
        }
        
        setLoading(false);
      },
      (err) => {
        let message = "Unable to detect your location.";
        if (err.code === 1) message = "❌ Location permission denied. Please allow location access.";
        if (err.code === 2) message = "❌ Location unavailable. Please try again.";
        if (err.code === 3) message = "❌ Location request timed out.";
        setError(message);
        setLoading(false);
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,  // Use GPS for exact location
        timeout: 15000,
        maximumAge: 0,  // Don't use cached location
      }
    );
  }, []);

  return { coords, error, loading, address, getLocation };
}