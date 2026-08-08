const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["sale", "restock", "adjustment"], required: true },
    qty: { type: Number, required: true }, // negative for sale, positive for restock
    note: { type: String, default: "" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);
