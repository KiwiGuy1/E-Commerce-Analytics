import prisma, { disconnectPrisma } from "../src/lib/prisma";

const USERS = [
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
];

const PRODUCTS = [
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
];

const PAYMENT_METHODS = ["Credit Card", "PayPal", "Apple Pay", "Google Pay"];
const CUSTOMER_SEGMENTS = [
  "Young Professional",
  "Athlete",
  "Yoga Enthusiast",
  "Tech Savvy",
  "Outdoor Lover",
  "Fitness Buff",
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function main() {
  // Compose runs this script whenever the API container starts. Never clear an
  // existing database here, otherwise manually-created orders disappear after
  // every restart.
  const [userCount, productCount, saleCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.sale.count(),
  ]);

  if (userCount > 0 || productCount > 0 || saleCount > 0) {
    console.log(
      `Database already contains data (${userCount} users, ${productCount} products, ${saleCount} sales); skipping demo seed.`,
    );
    return;
  }

  const users = await Promise.all(
    USERS.map((user) => prisma.user.create({ data: user }))
  );
  const products = await Promise.all(
    PRODUCTS.map((product) => prisma.product.create({ data: product }))
  );

  const sales = Array.from({ length: 50 }, () => {
    const user = pick(users);
    const product = pick(products);

    return {
      userId: user.id,
      productId: product.id,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: product.price,
      date: new Date(2024, 6, Math.floor(Math.random() * 30) + 1),
      customerSegment: pick(CUSTOMER_SEGMENTS),
      paymentMethod: pick(PAYMENT_METHODS),
    };
  });

  await prisma.sale.createMany({ data: sales });

  console.log(
    `Seeded ${users.length} users, ${products.length} products, and ${sales.length} sales.`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
