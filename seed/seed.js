const mongoose = require("mongoose");

// Connect to your local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "customer" },
  createdAt: { type: Date, default: Date.now },
});
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  description: String,
  tags: [String],
});
const saleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
  date: Date,
  customerSegment: String,
  paymentMethod: String,
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Sale = mongoose.model("Sale", saleSchema);

async function seed() {
  await mongoose.connection.dropDatabase();

  // Create more users
  const users = await User.insertMany([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "hashed1",
      role: "customer",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      password: "hashed2",
      role: "customer",
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "adminhashed",
      role: "admin",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: "hashed3",
      role: "customer",
    },
    {
      name: "Dana White",
      email: "dana@example.com",
      password: "hashed4",
      role: "customer",
    },
    {
      name: "Eve Black",
      email: "eve@example.com",
      password: "hashed5",
      role: "customer",
    },
  ]);

  // Create more products
  const products = await Product.insertMany([
    {
      name: "Wireless Mouse",
      category: "Electronics",
      price: 25.99,
      stock: 120,
      description: "Ergonomic wireless mouse",
      tags: ["electronics", "accessories"],
    },
    {
      name: "Running Shoes",
      category: "Sports",
      price: 59.99,
      stock: 50,
      description: "Comfortable running shoes",
      tags: ["sports", "footwear"],
    },
    {
      name: "Yoga Mat",
      category: "Fitness",
      price: 29.99,
      stock: 80,
      description: "Non-slip yoga mat",
      tags: ["fitness", "accessories"],
    },
    {
      name: "Bluetooth Headphones",
      category: "Electronics",
      price: 89.99,
      stock: 60,
      description: "Noise-cancelling headphones",
      tags: ["electronics", "audio"],
    },
    {
      name: "Water Bottle",
      category: "Fitness",
      price: 15.99,
      stock: 200,
      description: "Stainless steel water bottle",
      tags: ["fitness", "accessories"],
    },
    {
      name: "Smart Watch",
      category: "Electronics",
      price: 199.99,
      stock: 30,
      description: "Fitness tracking smart watch",
      tags: ["electronics", "wearable"],
    },
    {
      name: "Football",
      category: "Sports",
      price: 34.99,
      stock: 40,
      description: "Professional football",
      tags: ["sports", "equipment"],
    },
    {
      name: "Tennis Racket",
      category: "Sports",
      price: 79.99,
      stock: 25,
      description: "Lightweight tennis racket",
      tags: ["sports", "equipment"],
    },
    {
      name: "Gym Bag",
      category: "Fitness",
      price: 49.99,
      stock: 70,
      description: "Spacious gym bag",
      tags: ["fitness", "accessories"],
    },
    {
      name: "Cycling Helmet",
      category: "Sports",
      price: 69.99,
      stock: 35,
      description: "Safety cycling helmet",
      tags: ["sports", "equipment"],
    },
  ]);

  // Create more sales (randomized for variety)
  const paymentMethods = ["Credit Card", "PayPal", "Apple Pay", "Google Pay"];
  const customerSegments = [
    "Young Professional",
    "Athlete",
    "Yoga Enthusiast",
    "Tech Savvy",
    "Outdoor Lover",
    "Fitness Buff",
  ];

  const salesData = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = product.price;
    const date = new Date(2024, 6, Math.floor(Math.random() * 30) + 1); // July 2024
    const customerSegment =
      customerSegments[Math.floor(Math.random() * customerSegments.length)];
    const paymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    salesData.push({
      userId: user._id,
      productId: product._id,
      quantity,
      price,
      date,
      customerSegment,
      paymentMethod,
    });
  }

  await Sale.insertMany(salesData);

  console.log("Database seeded with lots of data for analytics and ML!");
  mongoose.disconnect();
}

seed();
