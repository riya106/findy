import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authcontext"
import { useLang } from '../context/LanguageContext'
import { authAPI } from "../services/api"

export default function LoginPage() {
  const { login } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      setError(t('auth.errorFill'))
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login(form)
      const data = response.data

      if (!data.user || !data.token) {
        setError(t('auth.loginFailed'))
        return
      }

      login(data.user, data.token)

      const role = data.user.role
      if (role === "seller") navigate("/vendor-dashboard")
      else if (role === "worker") navigate("/worker-dashboard")
      else navigate("/listings")

    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: 'var(--gradient-page)',
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            gap: 10, marginBottom: 16
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--gradient-hero)',
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#fff", fontWeight: 800,
              fontFamily: "Syne, sans-serif"
            }}>F</div>
            <span style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800, fontSize: 28, color: "var(--mint)"
            }}>
              {t('appName')}
            </span>
          </div>
          <h1 style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700, fontSize: 28, marginBottom: 8,
            color: 'var(--ink)'
          }}>
            {t('auth.welcomeBack')} 👋
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            {t('auth.signInSub')}
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: "blur(24px)",
          border: "1px solid var(--border)",
          borderRadius: 28, padding: 36,
        }}>
          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 12, marginBottom: 20,
              fontSize: 13, fontWeight: 500,
              background: "#fef2f2", color: "#dc2626",
              border: "1px solid #fca5a5"
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 13, fontWeight: 600,
                color: "var(--ink)", marginBottom: 8
              }}>
                {t('auth.email')}
              </label>
              <input
                className="input"
                type="email" name="email"
                placeholder="you@email.com"
                value={form.email} onChange={handle}
                style={{
                  border: "1.5px solid var(--border)",
                  borderRadius: 12, fontSize: 14,
                  padding: "12px 16px", width: "100%",
                  boxSizing: "border-box",
                  background: 'var(--input-bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: "block", fontSize: 13, fontWeight: 600,
                color: "var(--ink)", marginBottom: 8
              }}>
                {t('auth.password')}
              </label>
              <input
                className="input"
                type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={handle}
                style={{
                  border: "1.5px solid var(--border)",
                  borderRadius: 12, fontSize: 14,
                  padding: "12px 16px", width: "100%",
                  boxSizing: "border-box",
                  background: 'var(--input-bg)',
                  color: 'var(--ink)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "15px",
                borderRadius: 100, border: "none",
                background: 'var(--gradient-hero)',
                color: "#fff", fontSize: 16, fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? `⏳ ${t('auth.signingIn')}` : ` ${t('auth.signIn')}`}
            </button>
          </form>

          <div style={{
            display: "flex", gap: 8, marginTop: 20,
            justifyContent: "center", flexWrap: "wrap"
          }}>
            {[
              { icon: "🗺️", label: t('profile.roles.explorer') },
              { icon: "🏪", label: t('profile.roles.vendor') },
              { icon: "👷", label: t('profile.roles.worker') },
            ].map(({ icon, label }) => (
              <span key={label} style={{
                fontSize: 12, color: "var(--muted)",
                background: "var(--mint-soft)",
                border: "1px solid var(--border)",
                padding: "4px 12px", borderRadius: 100
              }}>
                {icon} {label}
              </span>
            ))}
          </div>

          <p style={{
            textAlign: "center", fontSize: 13,
            color: "var(--muted)", marginTop: 20
          }}>
            {t('auth.noAccount')}{" "}
            <Link to="/signup" style={{
              color: "var(--mint)", fontWeight: 600,
              textDecoration: "none"
            }}>
              {t('auth.signUpLink')}
            </Link>
          </p>

          <p style={{ textAlign: "center", marginTop: 10 }}>
            <Link to="/" style={{
              color: "var(--muted)", fontSize: 13,
              textDecoration: "none"
            }}>
              {t('back')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}