const express = require("express")
const router = express.Router()

const {
 addReview,
 getListingReviews
} = require("../controllers/reviewController")

const checkUserAuth = require("../middleware/authMiddleware")


/* Add Review */
router.post("/add", checkUserAuth, addReview)

/* Get Reviews by Listing */
router.get("/listing/:id", getListingReviews)

module.exports = router