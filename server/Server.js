require("dotenv").config();
const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Jewellery API Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});