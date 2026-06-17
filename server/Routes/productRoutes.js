const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post("/", protect, adminOnly, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", protect, adminOnly, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
