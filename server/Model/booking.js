const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
      enum: ["Ear Piercing", "Gold Services"],
    },
    preferredDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
