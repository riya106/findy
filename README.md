# 🗺️ Findy - Discover What's Around You

**Find local vendors, skilled professionals, and hidden gems — all within walking distance**

## 📖 About The Project

**Findy** is a location-based discovery platform that connects users with local vendors, skilled professionals, and services in their neighborhood. Whether you're looking for a nearby restaurant, an electrician, or a tutor, Findy helps you discover what's around you.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Location-Based Discovery** | Find vendors, workers, and places within your chosen radius (5-100km) |
| 🏪 **Vendor Management** | Vendors can create shops, add menus, set operating hours, and go live |
| 👷 **Professional Profiles** | Workers can showcase skills, portfolio, availability, and rates |
| ⭐ **Review System** | Users can rate and review both vendors and workers |
| 🌐 **Bilingual Support** | Complete Hindi and English translations |
| 🌙 **Dark/Light Mode** | Theme toggle with system preference detection |
| 🗺️ **Interactive Maps** | Leaflet integration with OpenStreetMap |
| 📍 **Smart Location** | GPS, PIN code search, and manual address input |

## 🚀 Live Demo

Visit the live application: **https://findy-five.vercel.app**

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM v6
- Axios
- Leaflet (Maps)
- Context API (State Management)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcryptjs
- CORS

### DevOps
- Vercel (Frontend Hosting)
- Render (Backend Hosting)
- MongoDB Atlas (Database)
- GitHub (Version Control)

## 📁 Project Structure
findy/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── i18n/
│ │ └── styles/
│ ├── index.html
│ └── package.json
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ └── package.json
│
└── README.md

text

## 🛠️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup


# Clone the repository
git clone https://github.com/riya106/Findy.git
cd Findy/backend

# Install dependencies
npm install

# Create .env file
# PORT=8000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

# Start the server
npm run dev
Frontend Setup

bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
# VITE_API_URL=http://localhost:8000/api

# Start the development server
npm run dev
🔧 Environment Variables

Backend (.env)

text
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/findyDB
JWT_SECRET=your_super_secret_key
Frontend (.env)

text
VITE_API_URL=http://localhost:8000/api
📡 API Endpoints

Method	Endpoint	Description
POST	/api/user/register	User registration
POST	/api/user/login	User login
GET	/api/vendors/live	Get live vendors
GET	/api/vendors/:id	Get vendor details
POST	/api/vendors/register	Register as vendor
GET	/api/workers/all	Get all workers
GET	/api/workers/:id	Get worker details
GET	/api/listing/all	Get all listings
POST	/api/review/add	Add review for listing
POST	/api/review/vendor	Add review for vendor
GET	/api/around	Get nearby places
🎯 User Roles

👤 Explorer

Browse listings, vendors, and workers
Search and filter by location and radius
Leave reviews
Save favorite places
🏪 Vendor

Create and manage shop profile
Add menu items with prices
Set operating hours
Go live / offline
View and respond to reviews
👷 Professional (Worker)

Create professional profile
Add skills and services
Set hourly/monthly rates
Manage availability
Optional portfolio
🌍 Deployment

Live Links

Frontend: https://findy-five.vercel.app
Backend: https://findy-backend.onrender.com
Backend Deployment (Render)

bash
# Push to GitHub
git push origin main

# Connect repository to Render
# Add environment variables
# Deploy
Frontend Deployment (Vercel)

bash
# Push to GitHub
git push origin main

# Connect repository to Vercel
# Add environment variable VITE_API_URL
# Deploy
🐛 Known Issues & Solutions

Issue	Solution
Vendor reviews 404	Add /review/vendor routes in backend
Around page no data	Check OpenStreetMap API connection
Location not updating	Enable high accuracy GPS in browser
CORS errors	Add frontend URL to backend CORS
🤝 Contributors

Riya	Kanika
Full Stack Developer	Full Stack Developer
📧 Contact

Project Link: https://findy-five.vercel.app
GitHub Repository: https://github.com/riya106/Findy
🙏 Acknowledgments

OpenStreetMap for free map data
Unsplash for placeholder images
Google Fonts for Syne and DM Sans fonts
Made with ❤️ by Riya & Kanika



