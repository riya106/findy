import { Link } from "react-router-dom"
import { useLang } from '../context/LanguageContext'

const EMOJI_MAP = {
  food: "🍜",
  services: "⚡",
  shop: "🛍️",
  shops: "🛍️",
  tourism: "🌳",
  health: "🏥",
  default: "📌",
}

const COLOR_MAP = {
  food: { bg: "#fef3c7", color: "#d97706" },
  services: { bg: "#ede9fe", color: "#7c3aed" },
  shop: { bg: "#fce7f3", color: "#db2777" },
  shops: { bg: "#fce7f3", color: "#db2777" },
  tourism: { bg: "#dcfce7", color: "#16a34a" },
  health: { bg: "#dbeafe", color: "#2563eb" },
  default: { bg: "#f0fdf4", color: "#059669" },
}

const IMAGE_MAP = {
  food: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  services: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  shop: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
  shops: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
  tourism: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  health: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
  default: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
}

export default function ListingCard({ listing, delay = 0 }) {
  const { lang } = useLang()

  if (!listing) return null

  const category = listing.category?.toLowerCase() || "default"
  const emoji = EMOJI_MAP[category] ?? EMOJI_MAP.default
  const colors = COLOR_MAP[category] ?? COLOR_MAP.default
const image =
  listing.coverImage ||
  listing.image ||
  listing.galleryImages?.[0] ||
  IMAGE_MAP[category] ||
  IMAGE_MAP.default
  return (
    <Link
      to={`/listings/${listing._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "var(--shadow)",
          transition: "all 0.25s ease",
          cursor: "pointer",
          animationDelay: `${delay}s`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)"
          e.currentTarget.style.boxShadow = "var(--shadow)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "var(--shadow)"
        }}
      >
        {/* IMAGE BANNER */}
        <div style={{ position: "relative", height: 160 }}>
          <img
            src={image}
            alt="listing"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* CATEGORY BADGE */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: colors.bg,
              color: colors.color,
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 100,
              border: `1px solid ${colors.color}30`,
              textTransform: "capitalize"
            }}
          >
            {listing.category || listing.type || (lang === 'hi' ? 'स्थानीय' : 'Local')}
          </div>

          {/* EMOJI ICON */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              fontSize: 30,
              background: "rgba(255,255,255,0.85)",
              padding: "4px 10px",
              borderRadius: 10
            }}
          >
            {emoji}
          </div>
        </div>

        {/* CARD BODY */}
        <div style={{ padding: "20px 22px" }}>
          {/* TITLE */}
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 17,
              margin: "0 0 8px",
              color: 'var(--ink)',
              lineHeight: 1.3
            }}
          >
            {listing.title || listing.name || (lang === 'hi' ? 'शीर्षकहीन' : 'Untitled')}
          </h3>

          {/* DESCRIPTION */}
          {listing.description && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                margin: "0 0 12px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {listing.description}
            </p>
          )}

          {/* ADDRESS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: 'var(--muted)',
              marginBottom: 14
            }}
          >
            <span style={{ color: "var(--mint)" }}>📍</span>
            {listing.address || (lang === 'hi' ? 'स्थान उपलब्ध' : 'Location available')}
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 14,
              borderTop: "1px solid var(--border)"
            }}
          >
            {listing.price ? (
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "var(--mint)",
                  fontFamily: "Syne, sans-serif"
                }}
              >
                ₹{listing.price}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {lang === 'hi' ? 'मुफ़्त / संपर्क करें' : 'Free / Contact'}
              </div>
            )}

            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--mint)",
                background: "var(--mint-soft)",
                padding: "6px 14px",
                borderRadius: 100,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              {lang === 'hi' ? 'देखें →' : 'View →'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}