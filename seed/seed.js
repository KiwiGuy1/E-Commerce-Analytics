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
  // For ML: add features like customer segment, payment method, etc.
  customerSegment: String,
  paymentMethod: String,
});

// Create models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Sale = mongoose.model("Sale", saleSchema);

async function seed() {
  await mongoose.connection.dropDatabase(); // Clear old data

  // Create dummy users
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
  ]);

  // Create dummy products
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
  ]);

  // Create dummy sales (for analytics & ML)
  await Sale.insertMany([
    {
      userId: users[0]._id,
      productId: products[0]._id,
      quantity: 1,
      price: 25.99,
      date: new Date("2024-07-01"),
      customerSegment: "Young Professional",
      paymentMethod: "Credit Card",
    },
    {
      userId: users[1]._id,
      productId: products[1]._id,
      quantity: 2,
      price: 59.99,
      date: new Date("2024-07-02"),
      customerSegment: "Athlete",
      paymentMethod: "PayPal",
    },
    {
      userId: users[0]._id,
      productId: products[2]._id,
      quantity: 1,
      price: 29.99,
      date: new Date("2024-07-03"),
      customerSegment: "Yoga Enthusiast",
      paymentMethod: "Credit Card",
    },
  ]);

  console.log("Database seeded for analytics and ML!");
  mongoose.disconnect();
}

seed();
