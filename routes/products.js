const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/products?type=food|drinks&subcategory=Grilled
router.get("/", async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;

    const products = await Product.find(filter).sort({ subcategory: 1, name: 1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
