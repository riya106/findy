import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix marker icon issue (important for Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function IndianMap({ places = [], userLocation }) {
  if (!userLocation) return null;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      {/* Map tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Marker */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>
          <div style={{ color: "#000" }}>📍 You are here</div>
        </Popup>
      </Marker>

      {/* Places Markers */}
      {places.map((place, index) => {
        const lat = place.lat || place.location?.lat;
        const lng = place.lng || place.location?.lng;

        if (!lat || !lng) return null;

        return (
          <Marker key={index} position={[lat, lng]}>
            <Popup>
              <div
                style={{
                  background: "rgba(20, 30, 30, 0.95)",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  minWidth: "160px",
                  color: "#ffffff",
                  fontFamily: "sans-serif",
                }}
              >
                {/* Name */}
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#ffffff",
                  }}
                >
                  📍 {place.name}
                </div>

                {/* Type */}
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.85,
                    marginBottom: "4px",
                  }}
                >
                  {place.type}
                </div>

                {/* Distance */}
                {place.distance && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#00e6a7",
                      fontWeight: "500",
                    }}
                  >
                    📏{" "}
                    {place.distance < 1
                      ? Math.round(place.distance * 1000) + " m"
                      : place.distance.toFixed(1) + " km"}{" "}
                    away
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}