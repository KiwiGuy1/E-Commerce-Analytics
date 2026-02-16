import prisma from "../src/lib/prisma";

const FIRST_NAMES = [
  "Ava",
  "Liam",
  "Noah",
  "Emma",
  "Mia",
  "Lucas",
  "Sophia",
  "Ethan",
  "Olivia",
  "Mason",
  "Amelia",
  "Logan",
];

const LAST_NAMES = [
  "Johnson",
  "Smith",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Clark",
  "Hall",
  "Allen",
  "Young",
];

const PRODUCTS = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    stock: 240,
    description: "Noise-cancelling over-ear headphones",
    tags: ["wireless", "bluetooth", "audio"],
  },
  {
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 109.0,
    stock: 180,
    description: "Tactile mechanical keyboard with RGB",
    tags: ["keyboard", "gaming", "office"],
  },
  {
    name: "4K Monitor",
    category: "Electronics",
    price: 329.0,
    stock: 120,
    description: "27-inch UHD monitor",
    tags: ["display", "workstation", "4k"],
  },
  {
    name: "Smart Watch",
    category: "Wearables",
    price: 199.99,
    stock: 200,
    description: "Fitness tracking smart watch",
    tags: ["wearable", "health", "smart"],
  },
  {
    name: "Running Shoes",
    category: "Sports",
    price: 74.99,
    stock: 260,
    description: "Lightweight running shoes",
    tags: ["sports", "footwear", "running"],
  },
  {
    name: "Yoga Mat",
    category: "Fitness",
    price: 29.99,
    stock: 320,
    description: "Non-slip exercise mat",
    tags: ["fitness", "yoga", "home-gym"],
  },
  {
    name: "Stainless Water Bottle",
    category: "Fitness",
    price: 21.5,
    stock: 500,
    description: "Insulated 1L water bottle",
    tags: ["fitness", "outdoor", "hydration"],
  },
  {
    name: "Organic Coffee Beans",
    category: "Food & Beverage",
    price: 16.49,
    stock: 450,
    description: "Medium roast, fair-trade arabica",
    tags: ["coffee", "organic", "kitchen"],
  },
  {
    name: "Desk Lamp",
    category: "Home",
    price: 39.99,
    stock: 210,
    description: "Dimmable LED desk lamp",
    tags: ["lighting", "office", "home"],
  },
  {
    name: "Backpack",
    category: "Accessories",
    price: 54.0,
    stock: 230,
    description: "Water-resistant commuter backpack",
    tags: ["travel", "school", "daily"],
  },
  {
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 69.99,
    stock: 190,
    description: "Portable waterproof speaker",
    tags: ["audio", "wireless", "portable"],
  },
  {
    name: "Wireless Mouse",
    category: "Electronics",
    price: 25.99,
    stock: 350,
    description: "Ergonomic wireless mouse",
    tags: ["electronics", "office", "accessories"],
  },
  {
    name: "Gaming Chair",
    category: "Furniture",
    price: 249.99,
    stock: 95,
    description: "Adjustable ergonomic gaming chair",
    tags: ["furniture", "gaming", "comfort"],
  },
  {
    name: "Phone Charger 65W",
    category: "Electronics",
    price: 34.99,
    stock: 410,
    description: "USB-C fast charger",
    tags: ["charging", "mobile", "accessories"],
  },
  {
    name: "Noise-Isolating Earbuds",
    category: "Electronics",
    price: 49.99,
    stock: 280,
    description: "In-ear buds with mic",
    tags: ["audio", "mobile", "wireless"],
  },
];

const PAYMENT_METHODS = ["card", "paypal", "apple_pay", "google_pay"];
const CUSTOMER_SEGMENTS = ["retail", "vip", "new_customer", "loyal"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function randomEmail(name: string, index: number) {
  const normalized = name.toLowerCase().replace(/\s+/g, ".");
  return `${normalized}.${index}@example.com`;
}

async function main() {
  console.log("Starting seed...");

  await prisma.sale.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const users = await Promise.all(
    Array.from({ length: 12 }).map((_, index) => {
      const name = randomName();
      return prisma.user.create({
        data: {
          name,
          email: randomEmail(name, index + 1),
          password: "seeded_password_hash",
          role: index === 0 ? "admin" : "customer",
        },
      });
    })
  );

  const products = await Promise.all(
    PRODUCTS.map((product) => prisma.product.create({ data: product }))
  );

  const salesCount = 80;
  for (let i = 0; i < salesCount; i += 1) {
    const user = pick(users);
    const product = pick(products);
    const quantity = randomInt(1, 4);

    await prisma.sale.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantity,
        price: product.price,
        customerSegment: pick(CUSTOMER_SEGMENTS),
        paymentMethod: pick(PAYMENT_METHODS),
      },
    });
  }

  console.log(`Created ${users.length} users`);
  console.log(`Created ${products.length} products with high stock`);
  console.log(`Created ${salesCount} sales`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
