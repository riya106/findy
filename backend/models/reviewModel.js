const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
{
 rating: {
  type: Number,
  required: true,
  min: 1,
  max: 5
 },

 comment: {
  type: String,
  required: true
 },

 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
 },

 listing: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Listing",
  required: true
 }

},
{ timestamps: true }
)

module.exports = mongoose.model("Review", reviewSchema)