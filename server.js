require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    if (req.path.startsWith("/api/")) {
      return res.status(500).json({
        message: `Database connection error (${err.message}). Ensure MONGO_URI is correctly set in Vercel environment variables.`,
        error: err.message,
      });
    }
    next();
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Seed route to populate database on Vercel or locally
const seedDatabase = require("./seed/seed");
app.all("/api/seed", async (req, res) => {
  try {
    const result = await seedDatabase(false);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

// Static frontend (customer + admin)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[LATK Cafe] Server running on http://localhost:${PORT}`));
}

module.exports = app;

