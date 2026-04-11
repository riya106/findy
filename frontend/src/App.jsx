import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"

import { AuthProvider, useAuth } from "./context/authcontext"
import { LanguageProvider } from "./context/LanguageContext"
import { ThemeProvider } from "./context/ThemeContext"

import Cursor from "./components/Cursor"
import ScrollProgress from "./components/ScrollProgress"
import Navbar from "./components/navbar"

import SplashPage from "./pages/SplashPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"

import ListingsPage from "./pages/ListingsPage"
import ListingDetailPage from "./pages/ListingDetailPage"

import VendorsPage from "./pages/VendorsPage"
import VendorRegisterPage from "./pages/VendorRegisterPage"
import VendorDashboardPage from "./pages/VendorDashboardPage"
import VendorReviewsPage from "./pages/VendorReviewsPage"

import WorkersPage from "./pages/WorkersPage"
import WorkerRegisterPage from "./pages/WorkerRegisterPage"
import WorkerDashboardPage from "./pages/WorkerDashboardPage"

import AroundPage from "./pages/AroundPage"
import ProfilePage from "./pages/ProfilePage"


/* ---------- Protected Route ---------- */

function Protected({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', color: 'var(--muted)',
        fontSize: 15, fontFamily: 'DM Sans, sans-serif',
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}


/* ---------- Navbar Hidden Routes ---------- */

const NO_NAV_ROUTES = ["/", "/login", "/signup"]


/* ---------- Layout ---------- */

function Layout() {
  const location = useLocation()
  const showNavbar = !NO_NAV_ROUTES.includes(location.pathname)

  return (
    <>
      <Cursor />
      <ScrollProgress />

      {showNavbar && <Navbar />}

      <Routes>

        {/* Splash / Auth */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Redirect */}
        <Route path="/home" element={<Navigate to="/listings" replace />} />

        {/* Listings */}
        <Route path="/listings" element={<Protected><ListingsPage /></Protected>} />
        <Route path="/listings/:id" element={<Protected><ListingDetailPage /></Protected>} />

        {/* Vendors */}
        <Route path="/vendors" element={<Protected><VendorsPage /></Protected>} />
        <Route path="/vendor-register" element={<Protected><VendorRegisterPage /></Protected>} />
        <Route path="/vendor-dashboard" element={<Protected><VendorDashboardPage /></Protected>} />
        <Route path="/vendor-reviews" element={<Protected><VendorReviewsPage /></Protected>} />

        {/* Workers */}
        <Route path="/workers" element={<Protected><WorkersPage /></Protected>} />
        <Route path="/worker-register" element={<Protected><WorkerRegisterPage /></Protected>} />
        <Route path="/worker-dashboard" element={<Protected><WorkerDashboardPage /></Protected>} />

        {/* Other Pages */}
        <Route path="/around" element={<Protected><AroundPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  )
}


/* ---------- App Root ---------- */

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
