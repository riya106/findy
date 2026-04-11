const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware")
const { registerUser, loginUser, getUsers } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", checkUserAuth, getUsers);

module.exports = router;