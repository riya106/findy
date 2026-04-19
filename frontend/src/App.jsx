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
import WorkerDetailPage from "./pages/WorkerDetailPage"

import ListingsPage from "./pages/ListingsPage"
import ListingDetailPage from "./pages/ListingDetailPage"

import VendorsPage from "./pages/VendorsPage"
import VendorRegisterPage from "./pages/VendorRegisterPage"
import VendorDashboardPage from "./pages/VendorDashboardPage"
// import VendorReviewsPage from "./pages/VendorReviewsPage"  // ← REMOVED - Reviews now in Vendor Detail Page
import VendorDetailPage from "./pages/VendorDetailPage"

import WorkersPage from "./pages/WorkersPage"
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


/* ---------- Role-based Home Redirect ---------- */

function HomeRedirect() {
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
    return <Navigate to="/" replace />
  }

  // Redirect based on user role
  if (user.role === 'seller') {
    return <Navigate to="/vendor-dashboard" replace />
  }
  if (user.role === 'worker') {
    return <Navigate to="/worker-dashboard" replace />
  }
  // Default for explorer
  return <Navigate to="/listings" replace />
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

        {/* Home Redirect - handles role-based routing */}
        <Route path="/home" element={<HomeRedirect />} />

        {/* Listings */}
        <Route path="/listings" element={<Protected><ListingsPage /></Protected>} />
        <Route path="/listings/:id" element={<Protected><ListingDetailPage /></Protected>} />

        {/* Vendors */}
        <Route path="/vendors" element={<Protected><VendorsPage /></Protected>} />
        <Route path="/vendors/:id" element={<Protected><VendorDetailPage /></Protected>} />
        <Route path="/vendor-register" element={<Protected><VendorRegisterPage /></Protected>} />
        <Route path="/vendor-dashboard" element={<Protected><VendorDashboardPage /></Protected>} />
        {/* VendorReviewsPage route removed - reviews now in VendorDetailPage */}

        {/* Workers */}
        <Route path="/workers" element={<Protected><WorkersPage /></Protected>} />
        <Route path="/workers/:id" element={<Protected><WorkerDetailPage /></Protected>} />
        <Route path="/worker-dashboard" element={<Protected><WorkerDashboardPage /></Protected>} />

        {/* Other Pages */}
        <Route path="/around" element={<Protected><AroundPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
        
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