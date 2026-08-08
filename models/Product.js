const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["food", "drinks"], required: true },
    // Food: Grilled / Steak / Fried  |  Drinks: Coffee-Based / Frappuccino / Matcha
    subcategory: { type: String, required: true },
    unliRice: { type: Boolean, default: false },
    image: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
