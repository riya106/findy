const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  shopType: {
    type: String,
    required: true
  },

  location: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },

  isLive: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Vendor", vendorSchema);