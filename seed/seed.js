require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockLog = require("../models/StockLog");

const FOOD = [
  { name: "Tasty BBQ", subcategory: "Grilled", price: 189, unliRice: true, description: "Grilled pork skewers, unli-rice with dessert." },
  { name: "Juicy Liempo", subcategory: "Grilled", price: 209, unliRice: true, description: "Marinated grilled pork belly, unli-rice with dessert." },
  { name: "Big Inasal", subcategory: "Grilled", price: 199, unliRice: true, description: "Chicken inasal, unli-rice with dessert." },
  { name: "Sizzling Sirloin", subcategory: "Steak", price: 259, description: "Sizzling beef sirloin with mushroom gravy." },
  { name: "Porterhouse Cut", subcategory: "Steak", price: 329, description: "Grilled porterhouse steak, medium-rare." },
  { name: "Tapa Steak", subcategory: "Steak", price: 219, description: "Beef tapa steak with garlic rice on the side." },
  { name: "Crispy Chicken", subcategory: "Fried", price: 169, description: "Golden fried chicken, two pieces." },
  { name: "Crispy Pata", subcategory: "Fried", price: 349, description: "Deep-fried pork leg, crispy skin." },
  { name: "Lumpiang Shanghai", subcategory: "Fried", price: 129, description: "Crispy spring rolls, 10 pcs with sweet chili sauce." },
];

const DRINKS = [
  { name: "Americano", subcategory: "Coffee-Based", price: 99, description: "Espresso shots topped with hot water." },
  { name: "Cafe Latte", subcategory: "Coffee-Based", price: 119, description: "Espresso with steamed milk." },
  { name: "Spanish Latte", subcategory: "Coffee-Based", price: 129, description: "Sweet, creamy espresso latte." },
  { name: "Cappuccino", subcategory: "Frappuccino", price: 139, description: "Iced blended cappuccino." },
  { name: "Banana Hazelnut", subcategory: "Frappuccino", price: 149, description: "Iced blended banana hazelnut frappe." },
  { name: "Mocha Latte", subcategory: "Frappuccino", price: 139, description: "Iced blended mocha frappe." },
  { name: "Salted Caramel Matcha", subcategory: "Matcha", price: 139, description: "Matcha with salted caramel drizzle." },
  { name: "Caramel Macchiato Matcha", subcategory: "Matcha", price: 139, description: "Matcha macchiato with caramel." },
  { name: "Oreo Matcha", subcategory: "Matcha", price: 149, description: "Creamy matcha blended with Oreo." },
];

async function run() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    StockLog.deleteMany({}),
  ]);

  console.log("Creating admin account...");
  const adminHash = await bcrypt.hash("admin123", 10);
  await User.create({
    firstName: "Lolo",
    lastName: "Admin",
    email: "admin@latkcafe.com",
    username: "admin",
    homeAddress: "LATK Cafe HQ",
    passwordHash: adminHash,
    isAdmin: true,
  });

  console.log("Creating sample customer account...");
  const custHash = await bcrypt.hash("customer123", 10);
  await User.create({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    username: "juandelacruz",
    homeAddress: "123 Rizal St, Lipa City, Batangas",
    passwordHash: custHash,
    isAdmin: false,
  });

  console.log("Seeding menu (food + drinks)...");
  const foodDocs = FOOD.map((p) => ({ ...p, type: "food", stock: 50, lowStockThreshold: 10 }));
  const drinkDocs = DRINKS.map((p) => ({ ...p, type: "drinks", stock: 80, lowStockThreshold: 15 }));
  await Product.insertMany([...foodDocs, ...drinkDocs]);

  console.log("Done!");
  console.log("----------------------------------------");
  console.log("Admin login   -> username: admin      password: admin123");
  console.log("Customer login-> username: juandelacruz password: customer123");
  console.log("----------------------------------------");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
