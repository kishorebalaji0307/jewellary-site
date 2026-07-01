const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  getMyBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public route for customers to submit bookings
router.post("/", createBooking);

// Route for logged-in users to get their own bookings
router.get("/my-bookings", protect, getMyBookings);

// Protected admin routes
router.get("/", protect, adminOnly, getBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;
