const Order = require("../Model/order");
const Product = require("../Model/product");
const { sendOrderEmails } = require("../config/nodemailer");

// @desc    Create a new order request
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, productId } = req.body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !productId) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Phone format validation
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({ message: "Please enter a valid phone number (minimum 10 digits)" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      product: productId,
      productDetails: {
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0] : "/jewellery_hero.png",
      },
      productCategory: product.category,
    });

    // Send email notification asynchronously (non-blocking for HTTP response)
    sendOrderEmails(order).catch((err) => {
      console.error("Non-blocking order email sending error:", err.message);
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CreateOrder Error:", error.message);
    res.status(500).json({ message: "Server error occurred while processing order request" });
  }
};

// @desc    Get all order requests
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("product").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("GetOrders Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching orders" });
  }
};

// @desc    Get logged-in user's own orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("GetMyOrders Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching user orders" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
};

