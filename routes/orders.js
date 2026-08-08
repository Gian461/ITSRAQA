const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const StockLog = require("../models/StockLog");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

const DELIVERY_FEE = 49;

// POST /api/orders  -> checkout: create order, decrement inventory
// Note: deliberately avoids Mongoose sessions/transactions so this works against a
// standalone MongoDB instance (transactions require a replica set / mongos). Stock is
// validated up-front, then decremented with atomic conditional updates; if a later item
// fails, any already-decremented stock for this request is rolled back.
router.post("/", authenticate, async (req, res) => {
  const decremented = []; // { productId, qty } already applied, for rollback on failure

  try {
    const { items, deliveryAddress, paymentMethod, discount = 0 } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    if (!deliveryAddress || !deliveryAddress.firstName || !deliveryAddress.address) {
      return res.status(400).json({ message: "Please complete the delivery address." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Please choose a payment method." });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Atomic: only succeeds if stock >= qty, so concurrent checkouts can't oversell.
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      if (!product) {
        const existing = await Product.findById(item.productId);
        if (!existing) throw new Error(`Product not found: ${item.productId}`);
        throw new Error(`Not enough stock for ${existing.name}. Only ${existing.stock} left.`);
      }

      decremented.push({ productId: product._id, qty: item.qty });

      subtotal += product.price * item.qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
    }

    const total = Math.max(subtotal + DELIVERY_FEE - discount, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      discount,
      total,
      status: "Pending",
    });

    await StockLog.insertMany(
      orderItems.map((i) => ({
        product: i.product,
        type: "sale",
        qty: -i.qty,
        note: "Order checkout",
        order: order._id,
      }))
    );

    res.status(201).json({ order });
  } catch (err) {
    // Roll back any stock we already decremented before the failure.
    for (const d of decremented) {
      await Product.findByIdAndUpdate(d.productId, { $inc: { stock: d.qty } }).catch(() => {});
    }
    console.error(err);
    res.status(400).json({ message: err.message || "Could not place order." });
  }
});

// GET /api/orders/mine -> order status & history
router.get("/mine", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/orders/:id -> order details/confirmation
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (!order.user.equals(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order." });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
