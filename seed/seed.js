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
  age: Number,
});
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
});
const orderSchema = new mongoose.Schema({
  userEmail: String,
  products: [{ name: String, quantity: Number, price: Number }],
  total: Number,
  date: Date,
});

// Create models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

async function seed() {
  await mongoose.connection.dropDatabase(); // Clear old data

  // Create dummy data
  const users = [
    { name: "Alice Johnson", email: "alice@example.com", age: 28 },
    { name: "Bob Smith", email: "bob@example.com", age: 34 },
  ];
  const products = [
    {
      name: "Wireless Mouse",
      category: "Electronics",
      price: 25.99,
      stock: 120,
    },
    { name: "Running Shoes", category: "Sports", price: 59.99, stock: 50 },
  ];
  const orders = [
    {
      userEmail: "alice@example.com",
      products: [{ name: "Wireless Mouse", quantity: 1, price: 25.99 }],
      total: 25.99,
      date: new Date(),
    },
    {
      userEmail: "bob@example.com",
      products: [{ name: "Running Shoes", quantity: 2, price: 59.99 }],
      total: 119.98,
      date: new Date(),
    },
  ];

  await User.insertMany(users);
  await Product.insertMany(products);
  await Order.insertMany(orders);

  console.log("Database seeded!");
  mongoose.disconnect();
}

seed();
