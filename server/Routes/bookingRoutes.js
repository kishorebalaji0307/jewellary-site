const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public route for customers to submit bookings
router.post("/", createBooking);

// Protected admin routes
router.get("/", protect, adminOnly, getBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;
