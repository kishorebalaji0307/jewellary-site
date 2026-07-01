const Booking = require("../Model/booking");
const { sendBookingEmail } = require("../config/nodemailer");

// @desc    Create a new home service booking request
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, location, serviceCategory, preferredDate, notes } = req.body;

    // Validation
    if (!customerName || !customerPhone || !location || !serviceCategory) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Phone format validation (minimum 10 digits)
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({ message: "Please enter a valid phone number (minimum 10 digits)" });
    }

    // Service category validation
    const validCategories = ["Ear Piercing", "Gold Services"];
    if (!validCategories.includes(serviceCategory)) {
      return res.status(400).json({ message: "Please select a valid service category" });
    }

    const booking = await Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      location,
      serviceCategory,
      preferredDate: preferredDate || undefined,
      notes,
    });

    // Send email notification asynchronously
    sendBookingEmail(booking).catch((err) => {
      console.error("Non-blocking booking email sending error:", err.message);
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("CreateBooking Error:", error.message);
    res.status(500).json({ message: "Server error occurred while processing booking request" });
  }
};

// @desc    Get all booking requests
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("GetBookings Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching bookings" });
  }
};

// @desc    Update status of a booking request
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Contacted", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status value" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking request not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error("UpdateBookingStatus Error:", error.message);
    res.status(500).json({ message: "Server error occurred while updating booking status" });
  }
};

// @desc    Get logged-in user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("GetMyBookings Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching user bookings" });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  getMyBookings,
};
