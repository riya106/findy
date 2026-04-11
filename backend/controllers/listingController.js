const Listing = require("../models/listingModel");

/* Create Listing */

const createListing = async (req, res) => {
  try {

    const { title, description, price, lat, lng } = req.body;

    const listing = new Listing({
      title,
      description,
      price,

      seller: req.user.userId,

      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }

    });

    await listing.save();

    res.send({
      status: 1,
      message: "Listing created successfully",
      data: listing
    });

  } catch (error) {

    console.log(error);

    res.send({
      status: 0,
      message: "Error creating listing"
    });

  }
};


/* Get All Listings */

const getListings = async (req, res) => {
  try {

    const listings = await Listing.find();

    res.send({
      status: 1,
      data: listings
    });

  } catch (error) {

    res.send({
      status: 0,
      message: "Error fetching listings"
    });

  }
};


/* Get Nearby Listings */

const getNearbyListings = async (req, res) => {
  try {

    const { lat, lng } = req.query;

    const listings = await Listing.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000
        }
      }
    });

    res.send({
      status: 1,
      data: listings
    });

  } catch (error) {

    res.send({
      status: 0,
      message: "Error fetching nearby listings"
    });

  }
};


module.exports = {
  createListing,
  getListings,
  getNearbyListings
};