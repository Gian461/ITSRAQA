const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockLog = require("../models/StockLog");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, requireAdmin);

// ---------- Registered accounts ----------
// GET /api/admin/users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ users });
});

// ---------- Inventory ----------
// GET /api/admin/inventory
router.get("/inventory", async (req, res) => {
  const products = await Product.find().sort({ type: 1, subcategory: 1, name: 1 });
  res.json({ products });
});

// POST /api/admin/inventory  (add a new product)
router.post("/inventory", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/admin/inventory/:id/restock  { qty, note }
router.post("/inventory/:id/restock", async (req, res) => {
  try {
    const qty = Number(req.body.qty);
    if (!qty || qty <= 0) return res.status(400).json({ message: "Enter a valid restock quantity." });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    product.stock += qty;
    await product.save();

    await StockLog.create({
      product: product._id,
      type: "restock",
      qty,
      note: req.body.note || "Manual replenishment by admin",
    });

    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error while restocking." });
  }
});

// PATCH /api/admin/inventory/:id  (edit price/stock/active/etc.)
router.patch("/inventory/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- Orders (view/update status) ----------
// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate("user", "firstName lastName username email").sort({ createdAt: -1 });
  res.json({ orders });
});

// PATCH /api/admin/orders/:id/status  { status }
router.patch("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status." });

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json({ order });
});

// ---------- Reports ----------
// GET /api/admin/reports
router.get("/reports", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
    const totalOrders = orders.length;
    const ordersByStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // top selling products
    const salesMap = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      o.items.forEach((it) => {
        const key = it.name;
        salesMap[key] = (salesMap[key] || 0) + it.qty;
      });
    });
    const topProducts = Object.entries(salesMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // revenue by day (last 14 entries)
    const revenueByDayMap = {};
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      const day = o.createdAt.toISOString().slice(0, 10);
      revenueByDayMap[day] = (revenueByDayMap[day] || 0) + o.total;
    });
    const revenueByDay = Object.entries(revenueByDayMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    // low stock alert
    const products = await Product.find();
    const lowStock = products
      .filter((p) => p.stock <= p.lowStockThreshold)
      .map((p) => ({ name: p.name, stock: p.stock, threshold: p.lowStockThreshold }));

    // replenishment history
    const restockLogs = await StockLog.find({ type: "restock" })
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      totalRevenue,
      totalOrders,
      ordersByStatus,
      topProducts,
      revenueByDay,
      lowStock,
      restockLogs,
      totalCustomers: await User.countDocuments({ isAdmin: false }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while generating report." });
  }
});

module.exports = router;
