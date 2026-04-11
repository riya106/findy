const Review = require("../models/reviewModel")

const addReview = async (req,res)=>{
 try{

  const { rating, comment, listing } = req.body

  const review = new Review({
   rating,
   comment,
   listing,
   user: req.user.userId
  })

  await review.save()

  res.status(201).json({
   status:1,
   message:"Review added successfully",
   data:review
  })

 }catch(error){

  res.status(500).json({
   status:0,
   message:"Error adding review"
  })

 }
}


const getListingReviews = async (req,res)=>{
 try{

  const listingId = req.params.id

  const reviews = await Review.find({ listing: listingId })
  .populate("user","name")

  res.status(200).json({
   status:1,
   data:reviews
  })

 }catch(error){

  res.status(500).json({
   status:0,
   message:"Error fetching reviews"
  })

 }
}

module.exports = {
 addReview,
 getListingReviews
}