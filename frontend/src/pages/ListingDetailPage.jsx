import { Link } from "react-router-dom"

export default function ListingCard({ listing, delay = 0 }) {

  const lat = listing?.location?.coordinates?.[1]
  const lng = listing?.location?.coordinates?.[0]

  return (

    <Link
      to={`/listings/${listing._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "10px",
          padding: "16px",
          background: "#fff",
          transition: "0.2s",
          animationDelay: `${delay}s`
        }}
      >

        {/* Title */}
        <h3 style={{ marginBottom: "6px" }}>
          {listing.title || "Listing"}
        </h3>

        {/* Type */}
        <p style={{ color: "#666", fontSize: "14px" }}>
          {listing.type || "Service"}
        </p>

        {/* Location */}
        <p style={{ fontSize: "13px", color: "#999" }}>
          {lat && lng
            ? `Lat: ${lat}, Lng: ${lng}`
            : "Location available"}
        </p>

      </div>

    </Link>

  )
}