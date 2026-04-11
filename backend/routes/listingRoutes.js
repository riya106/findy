const express = require("express");
const router = express.Router();

const checkUserAuth = require("../middleware/authMiddleware");

const { 
  createListing, 
  getListings,
  getNearbyListings 
} = require("../controllers/listingController");

/* Create Listing (Protected) */
router.post("/add", checkUserAuth, createListing);

/* Get All Listings (Public) */
router.get("/all", getListings);

/* Get Nearby Listings (Location Based) */
router.get("/nearby", getNearbyListings);

module.exports = router;