const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  profession: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    default: 0
  },

  location: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },

  rating: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Worker", workerSchema);