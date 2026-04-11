const express = require("express");
const router = express.Router();

const {
  registerVendor,
  goLive,
  getLiveVendors
} = require("../controllers/vendorController");

router.post("/register", registerVendor);

router.patch("/go-live", goLive);

router.get("/live", getLiveVendors);

module.exports = router;