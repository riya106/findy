# Findy — React Frontend

**Discover what's around you.** A location-based discovery platform for local vendors, skilled workers, and nearby places.

---

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | React 18 + Vite                     |
| Routing       | React Router v6                     |
| Styling       | TailwindCSS + custom CSS variables  |
| HTTP client   | Axios (with JWT interceptor)        |
| State / Auth  | Context API + localStorage          |
| Fonts         | Syne (display) + DM Sans (body)     |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL
cp .env.example .env
# Edit .env → VITE_API_URL=http://localhost:5000/api

# 3. Start dev server
npm run dev
```

---

## Project Structure

```
src/
├── components/
│   ├── Cursor.jsx          # Custom mint cursor + lerp ring
│   ├── Footer.jsx
│   ├── ListingCard.jsx
│   ├── LocationButton.jsx  # Geolocation capture button
│   ├── Navbar.jsx          # Sticky glass navbar
│   ├── ReviewCard.jsx
│   ├── ScrollProgress.jsx  # Top progress bar
│   ├── VendorCard.jsx
│   └── WorkerCard.jsx
│
├── context/
│   └── AuthContext.jsx     # JWT auth state, login/logout
│
├── hooks/
│   ├── useGeolocation.js   # navigator.geolocation wrapper
│   └── useScrollReveal.js  # IntersectionObserver scroll animations
│
├── pages/
│   ├── SplashPage.jsx      # Cinematic landing page with scroll animations
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── HomePage.jsx
│   ├── ListingsPage.jsx
│   ├── ListingDetailPage.jsx
│   ├── VendorsPage.jsx
│   ├── VendorRegisterPage.jsx
│   ├── VendorDashboardPage.jsx   # Go Live with geolocation
│   ├── WorkersPage.jsx
│   ├── WorkerRegisterPage.jsx
│   ├── AroundPage.jsx            # Nearby places map
│   └── ProfilePage.jsx
│
├── services/
│   └── api.js              # Axios instance + all API calls
│
├── styles/
│   └── global.css          # Design tokens, animations, utilities
│
├── App.jsx                 # Router + Protected routes
└── main.jsx
```

---

## Scroll Animations (StringTune-style)

The splash page includes:

| Effect                   | Implementation                                      |
|--------------------------|-----------------------------------------------------|
| Word-by-word hero title  | CSS `animation: wordUp` with staggered delays       |
| Pinned scroll steps      | `position: sticky` + scroll progress → step index  |
| Split text word lighter  | JS splits text into spans, lights them by scroll %  |
| Counter animation        | IntersectionObserver triggers easing count-up       |
| Horizontal card scroll   | CSS `overflow-x: auto` + `scroll-snap-type`        |
| Scroll reveal (fade/slide)| `useScrollReveal` hook with IntersectionObserver   |
| Progress bar             | `window.scrollY / maxScroll` mapped to bar width    |
| Custom cursor            | rAF lerp loop for the trailing ring                 |
| Marquee                  | CSS `animation: marquee` infinite                   |

---

## API Endpoints Used

| Page            | Method | Endpoint                   |
|-----------------|--------|----------------------------|
| Login           | POST   | `/api/user/login`          |
| Signup          | POST   | `/api/user/register`       |
| Listings        | GET    | `/api/listing/all`         |
| Listing Detail  | GET    | `/api/listing/:id`         |
| Reviews         | GET    | `/api/review/listing/:id`  |
| Add Review      | POST   | `/api/review/add`          |
| Enquiry         | POST   | `/api/enquiry`             |
| Live Vendors    | GET    | `/api/vendors/live`        |
| Vendor Register | POST   | `/api/vendors/register`    |
| Go Live         | PATCH  | `/api/vendors/go-live`     |
| All Workers     | GET    | `/api/workers/all`         |
| Worker Register | POST   | `/api/workers/register`    |
| Around          | GET    | `/api/around?lat=&lng=`    |

---

## Colour Theme — Mint

```css
--mint:        #0fb892   /* Primary action */
--mint-dark:   #059272   /* Hover state    */
--mint-light:  #ccfbec   /* Badge fill     */
--mint-soft:   #f0fdf8   /* Card / surface */
--ink:         #0d1f1a   /* Text           */
--bg:          #f4faf7   /* Page bg        */
```

---

## Build for Production

```bash
npm run build
npm run preview
```