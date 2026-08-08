const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/latk_cafe";
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("[MongoDB] Connected successfully.");
  } catch (err) {
    console.error("[MongoDB] Connection error:", err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  }
}

module.exports = connectDB;
