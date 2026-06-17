require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jewellery API Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});