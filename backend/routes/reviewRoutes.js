const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/add", checkUserAuth, reviewController.addReview);
router.get("/listing/:id", reviewController.getListingReviews);

module.exports = router;