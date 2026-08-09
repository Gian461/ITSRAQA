require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockLog = require("../models/StockLog");

const FOOD = [
  // --- GRILLED (Unli Rice with Dessert) ---
  { name: "Tasty BBQ", subcategory: "Grilled", price: 149, unliRice: true, description: "Grilled pork skewers, unlimited rice with dessert." },
  { name: "Juicy Liempo", subcategory: "Grilled", price: 179, unliRice: true, description: "Marinated grilled pork belly, unlimited rice with dessert." },
  { name: "Big Inasal", subcategory: "Grilled", price: 179, unliRice: true, description: "Savory chicken inasal, unlimited rice with dessert." },

  // --- STEAK (Roasted Potato or Fried Rice) ---
  { name: "Steak (200 Grams)", subcategory: "Steak", price: 799, description: "200g juicy steak served with roasted potato or fried rice." },
  { name: "Steak (500 Grams)", subcategory: "Steak", price: 1499, description: "500g premium steak served with roasted potato or fried rice." },
  { name: "Steak (1000 Grams)", subcategory: "Steak", price: 2799, description: "1000g grand steak platter served with roasted potato or fried rice." },

  // --- FRIED ---
  { name: "Fried Chicken & Fries", subcategory: "Fried", price: 199, description: "Golden crispy fried chicken served with seasoned fries." },

  // --- PANSIT ---
  { name: "Mique Bihon with Crispy Liempo", subcategory: "Pansit", price: 299, description: "Traditional Mique Bihon noodle dish topped with crispy liempo." },
  { name: "Mique Bihon with Garlic Bread", subcategory: "Pansit", price: 149, description: "Flavorful Mique Bihon noodles served with warm garlic bread." },

  // --- PASTA ---
  { name: "Spanish Sardine Pasta", subcategory: "Pasta", price: 210, description: "Pasta tossed with Spanish sardines, olive oil, and herbs." },
  { name: "Aglio Olio", subcategory: "Pasta", price: 210, description: "Classic garlic and olive oil pasta with a hint of chili flakes." },
  { name: "Korean Carbonara", subcategory: "Pasta", price: 240, description: "Creamy carbonara pasta with spicy Korean twist." },
  { name: "Carbonara", subcategory: "Pasta", price: 240, description: "Rich creamy carbonara with bacon and parmesan." },
  { name: "Choice of Pasta w/ Fried Chicken", subcategory: "Pasta", price: 280, description: "Your choice of pasta served with crispy fried chicken." },

  // --- SANDWICHES (Homemade Chips) ---
  { name: "Ham and Egg Sandwich", subcategory: "Sandwiches", price: 210, description: "Ham and egg sandwich served with homemade chips." },
  { name: "Egg and Cheese Sandwich", subcategory: "Sandwiches", price: 210, description: "Egg and cheese sandwich served with homemade chips." },
  { name: "Grilled Cheese Sandwich", subcategory: "Sandwiches", price: 210, description: "Golden toasted grilled cheese sandwich with homemade chips." },
  { name: "Tuna Melt Sandwich", subcategory: "Sandwiches", price: 210, description: "Warm tuna melt sandwich served with homemade chips." },
  { name: "Fries with House Dip", subcategory: "Sandwiches", price: 100, description: "Crispy french fries served with LATK signature house dip." },
  { name: "House Chips with Dip", subcategory: "Sandwiches", price: 150, description: "Freshly fried house potato chips served with special dip." },

  // --- PASTRIES AND DESSERTS ---
  { name: "Banana Walnut Muffin", subcategory: "Pastries & Desserts", price: 100, description: "Freshly baked banana walnut muffin." },
  { name: "Puto Flan", subcategory: "Pastries & Desserts", price: 25, description: "Steamed rice cake topped with creamy leche flan." },
  { name: "Bibingka", subcategory: "Pastries & Desserts", price: 50, description: "Traditional rice cake with salted egg and cheese." },
  { name: "Dark Chocolate Cookie", subcategory: "Pastries & Desserts", price: 90, description: "Fudgy dark chocolate chip cookie." },
  { name: "Coffee Jelly", subcategory: "Pastries & Desserts", price: 25, description: "Chilled coffee jelly cubes in sweet cream." },
];

const DRINKS = [
  // --- COFFEE BASED ---
  { name: "Americano", subcategory: "Coffee-Based", price: 120, description: "Espresso with water (Iced 16oz: ₱120 / Hot 12oz: ₱100)." },
  { name: "Americano (Hot 12oz)", subcategory: "Coffee-Based", price: 100, description: "Classic hot 12oz espresso with hot water." },
  { name: "Cafe Latte", subcategory: "Coffee-Based", price: 150, description: "Espresso with steamed milk (Hot / Iced 16oz)." },
  { name: "Spanish Latte", subcategory: "Coffee-Based", price: 150, description: "Sweet, creamy signature espresso latte (Hot / Iced 16oz)." },
  { name: "Cappuccino (Hot Only)", subcategory: "Coffee-Based", price: 150, description: "Rich espresso with thick steamed milk foam." },
  { name: "Banana Hazelnut", subcategory: "Coffee-Based", price: 160, description: "Espresso with banana hazelnut flavor (Iced ₱160 / Hot ₱150)." },
  { name: "Mocha Latte", subcategory: "Coffee-Based", price: 150, description: "Espresso infused with rich chocolate milk (Hot / Iced 16oz)." },
  { name: "Salted Caramel Latte", subcategory: "Coffee-Based", price: 150, description: "Espresso with sweet and salty caramel (Hot / Iced 16oz)." },
  { name: "Caramel Macchiato", subcategory: "Coffee-Based", price: 150, description: "Iced espresso with vanilla milk and caramel drizzle." },
  { name: "Oreo Latte", subcategory: "Coffee-Based", price: 220, description: "Creamy iced latte topped with crushed Oreo." },
  { name: "Biscoff Latte (Coffee)", subcategory: "Coffee-Based", price: 240, description: "Espresso with Lotus Biscoff cookie butter." },
  { name: "Biscoff Latte (Non-Coffee)", subcategory: "Coffee-Based", price: 220, description: "Non-coffee milk beverage with Lotus Biscoff." },
  { name: "Milo Latte", subcategory: "Coffee-Based", price: 120, description: "Espresso & chocolatey Milo (Iced ₱120 / Hot ₱110)." },

  // --- FRAPPUCCINO ---
  { name: "LATK Signature Frappe", subcategory: "Frappuccino", price: 190, description: "LATK house signature ice blended frappe." },
  { name: "Mocha Frappe", subcategory: "Frappuccino", price: 180, description: "Iced blended mocha coffee frappe with whipped cream." },
  { name: "Caramel Frappe", subcategory: "Frappuccino", price: 180, description: "Blended caramel frappe topped with caramel drizzle." },
  { name: "Strawberry & Cream Frappe", subcategory: "Frappuccino", price: 180, description: "Creamy ice-blended strawberry frappe." },
  { name: "Milo Frappe", subcategory: "Frappuccino", price: 180, description: "Blended chocolatey Milo frappe." },

  // --- MATCHA ---
  { name: "Matcha Latte", subcategory: "Matcha", price: 220, description: "Premium Japanese green tea matcha with milk." },
  { name: "Matcha Berry", subcategory: "Matcha", price: 240, description: "Layered matcha green tea with sweet strawberry puree." },
  { name: "Banana Matcha", subcategory: "Matcha", price: 240, description: "Creamy matcha green tea with banana flavor." },

  // --- MOCKTAILS ---
  { name: "Strawberry-Lychee Mocktail", subcategory: "Mocktails", price: 130, description: "Refreshing blend of sweet strawberry and lychee fruit." },
  { name: "Green Apple Mocktail", subcategory: "Mocktails", price: 130, description: "Crisp and tangy green apple sparkling drink." },
  { name: "Strawberry Mocktail", subcategory: "Mocktails", price: 130, description: "Sweet strawberry sparkling mocktail." },
  { name: "Blueberry Mocktail", subcategory: "Mocktails", price: 130, description: "Fruity blueberry sparkling iced mocktail." },
  { name: "Blueberry-Strawberry Mocktail", subcategory: "Mocktails", price: 130, description: "Dual berry punch with blueberry and strawberry." },
  { name: "Mango Whip", subcategory: "Mocktails", price: 150, description: "Creamy tropical mango whip iced drink." },
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
