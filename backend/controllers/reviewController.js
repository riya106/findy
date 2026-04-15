const Review = require("../models/reviewModel");
const Listing = require("../models/listingModel");

// Add review
const addReview = async (req, res) => {
  try {
    console.log("=== ADD REVIEW DEBUG ===");
    console.log("Request body:", req.body);
    console.log("req.user:", req.user);
    
    const { rating, comment, listingId } = req.body;
    
    // Validate required fields
    if (!rating || !comment || !listingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating, comment, and listingId are required" 
      });
    }
    
    // Get user ID from req.user (set by auth middleware)
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      console.error("No user ID found in req.user:", req.user);
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }
    
    console.log("Using userId:", userId);
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: "Listing not found" 
      });
    }
    
    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({ 
      user: userId, 
      listing: listingId 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this listing" 
      });
    }
    
    // Create new review
    const review = new Review({
      rating: Number(rating),
      comment: comment,
      user: userId,
      listing: listingId
    });
    
    await review.save();
    console.log("Review saved successfully:", review);
    
    // Update listing rating
    const allReviews = await Review.find({ listing: listingId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    listing.averageRating = totalRating / allReviews.length;
    listing.totalReviews = allReviews.length;
    await listing.save();
    
    // Return the populated review
    const populatedReview = await Review.findById(review._id).populate("user", "name");
    
    res.status(201).json({ 
      success: true, 
      data: populatedReview,
      message: "Review added successfully" 
    });
    
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get reviews for a listing
const getListingReviews = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching reviews for listing:", id);
    
    const reviews = await Review.find({ listing: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    
    console.log("Found reviews:", reviews.length);
    
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  addReview,
  getListingReviews
};