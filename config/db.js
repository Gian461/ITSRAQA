const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/latk_cafe";
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState;
    console.log("[MongoDB] Connected successfully.");
  } catch (err) {
    console.error("[MongoDB] Connection error:", err.message);
  }
}

module.exports = connectDB;

