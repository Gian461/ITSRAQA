const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    deliveryAddress: {
      firstName: String,
      lastName: String,
      address: String,
      barangay: String,
      city: String,
      landmark: String,
    },
    paymentMethod: {
      type: String,
      enum: ["QRPH", "Credit or Debit Card", "Cash on Delivery"],
      required: true,
    },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 49 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
