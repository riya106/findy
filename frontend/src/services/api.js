import axios from "axios"

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// ─── Attach JWT to every request ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("findy_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Global Error Handler ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("findy_token")
      localStorage.removeItem("findy_user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

// ─── Auth APIs ───────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/user/login", data),
  register: (data) => api.post("/user/register", data),
}

// ─── Listings APIs ───────────────────────────────────────
export const listingsAPI = {
  getAll: () => api.get("/listing/all"),
  getById: (id) => api.get(`/listing/${id}`),
}

// ─── Reviews APIs ────────────────────────────────────────
export const reviewsAPI = {
  getForListing: (id) => api.get(`/review/listing/${id}`),
  add: (data) => api.post("/review/add", data),
}

// ─── Enquiries APIs ──────────────────────────────────────
export const enquiryAPI = {
  send: (data) => api.post("/enquiry", data),
}

// ─── Vendors APIs ────────────────────────────────────────
export const vendorsAPI = {
  getLive: () => api.get("/vendors/live"),
  register: (data) => api.post("/vendors/register", data),
  goLive: (data) => api.patch("/vendors/go-live", data),
  getById: (id) => api.get(`/vendors/${id}`),
  getMyVendor: () => api.get("/vendors/me"),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  addMenuItem: (id, menuItem) => api.post(`/vendors/${id}/menu`, menuItem),
  updateMenuItem: (id, menuId, menuItem) => api.put(`/vendors/${id}/menu/${menuId}`, menuItem),
  deleteMenuItem: (id, menuId) => api.delete(`/vendors/${id}/menu/${menuId}`),
  updateHours: (id, hours) => api.put(`/vendors/${id}/hours`, hours),
  updateFeatures: (id, features) => api.patch(`/vendors/${id}/features`, { features }),
  updatePaymentMethods: (id, paymentMethods) => api.patch(`/vendors/${id}/payment-methods`, { paymentMethods }),
}

// ─── Workers APIs ────────────────────────────────────────
export const workersAPI = {
  getAll: () => api.get("/workers/all"),
  register: (data) => api.post("/workers/register", data),
  getById: (id) => api.get(`/workers/${id}`),
  getMyWorker: () => api.get("/workers/me"),
  update: (id, data) => api.put(`/workers/${id}`, data),
  addPortfolio: (id, data) => api.post(`/workers/${id}/portfolio`, data),
  addReview: (id, data) => api.post(`/workers/${id}/review`, data),
  updateAvailability: (id, data) => api.put(`/workers/${id}/availability`, data),
  toggleAvailability: (id) => api.patch(`/workers/${id}/toggle-availability`),
}
// ─── Around APIs ─────────────────────────────────────────
export const aroundAPI = {
  getNearby: (lat, lng) => api.get(`/around?lat=${lat}&lng=${lng}`),
}

export default api