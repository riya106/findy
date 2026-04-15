const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
const { registerUser, loginUser, getUsers } = require("../controllers/userController");

// Debug: Check if functions exist
console.log("=== userRoutes Debug ===");
console.log("registerUser type:", typeof registerUser);
console.log("loginUser type:", typeof loginUser);
console.log("getUsers type:", typeof getUsers);

// Make sure functions exist before using them
if (typeof registerUser !== 'function') {
  console.error("ERROR: registerUser is not a function!");
}
if (typeof loginUser !== 'function') {
  console.error("ERROR: loginUser is not a function!");
}
if (typeof getUsers !== 'function') {
  console.error("ERROR: getUsers is not a function!");
}

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", checkUserAuth, getUsers);

module.exports = router;