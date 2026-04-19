import { Link } from 'react-router-dom';
import { useAddress } from '../hooks/useAddress';
import { useLang } from '../context/LanguageContext';

const PROFESSION_EMOJI = {
  'Electrician': '⚡', 'Plumber': '🔧', 'Carpenter': '🪚',
  'Painter': '🎨', 'Mechanic': '🔩', 'Cleaner': '🧹',
  'Mason': '🧱', 'Welder': '🔥', 'AC Technician': '❄️',
  'Teacher': '📚', 'Coach': '🏋️', 'Driver': '🚗', 'Cook': '🍳',
  'Other': '👤',
};

export default function WorkerCard({ worker, delay = 0 }) {
  const emoji = PROFESSION_EMOJI[worker.profession] || '👤';
  const address = useAddress(worker.location?.lat, worker.location?.lng);
  const { t, lang } = useLang();

  return (
    <Link to={`/workers/${worker._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          marginBottom: 14,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = 'var(--mint)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--gradient-hero)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, color: '#fff', flexShrink: 0,
        }}>
          {emoji}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3, color: 'var(--ink)' }}>
            {worker.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 5 }}>
            {worker.profession} • {worker.experience} {lang === 'hi' ? 'साल' : 'yrs'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mint)', fontWeight: 500 }}>
            📍 {address}
          </div>
          {worker.distance && (
            <div style={{ fontSize: 11, color: 'var(--mint)', marginTop: 4 }}>
              📏 {worker.distance < 1 ? `${Math.round(worker.distance * 1000)}m` : `${worker.distance.toFixed(1)}km`} away
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {worker.rating > 0 && (
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 8 }}>
              ⭐ {worker.rating.toFixed(1)}
            </div>
          )}
          <span style={{
            padding: '4px 12px',
            borderRadius: 100,
            fontSize: 11,
            background: worker.isAvailable ? 'var(--mint-soft)' : '#fee2e2',
            color: worker.isAvailable ? 'var(--mint-dark)' : '#dc2626'
          }}>
            {worker.isAvailable ? (lang === 'hi' ? 'उपलब्ध' : 'Available') : (lang === 'hi' ? 'व्यस्त' : 'Busy')}
          </span>
        </div>
      </div>
    </Link>
  );
}