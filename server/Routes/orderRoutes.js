const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getMyOrders } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @route   POST /api/orders
// @desc    Create a new order request
// @access  Public
router.post("/", createOrder);

// @route   GET /api/orders/my-orders
// @desc    Get current user's own orders
// @access  Private
router.get("/my-orders", protect, getMyOrders);

// @route   GET /api/orders
// @desc    Get all order requests
// @access  Private/Admin
router.get("/", protect, adminOnly, getOrders);

module.exports = router;
