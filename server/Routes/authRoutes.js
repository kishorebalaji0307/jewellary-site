const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  googleLogin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for Google login
router.post("/google-login", googleLogin);

// Route to get current user details (protected)
router.get("/me", protect, getMe);

module.exports = router;
