import prisma from "./prisma";

const FIRST_NAMES = [
  "Ava", "Liam", "Noah", "Emma", "Mia", "Lucas",
  "Sophia", "Ethan", "Olivia", "Mason", "Amelia", "Logan",
];
const LAST_NAMES = [
  "Johnson", "Smith", "Brown", "Davis", "Miller", "Wilson",
  "Moore", "Taylor", "Clark", "Hall", "Allen", "Young",
];
const PAYMENT_METHODS = ["card", "paypal", "apple_pay", "google_pay"];
const CUSTOMER_SEGMENTS = ["retail", "vip", "new_customer", "loyal"];

const FALLBACK_PRODUCTS = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    stock: 180,
    description: "Noise-cancelling over-ear headphones",
    tags: ["wireless", "bluetooth", "audio"],
  },
  {
    name: "Running Shoes",
    category: "Sports",
    price: 74.99,
    stock: 220,
    description: "Lightweight running shoes",
    tags: ["sports", "footwear", "running"],
  },
  {
    name: "Organic Coffee Beans",
    category: "Food & Beverage",
    price: 16.49,
    stock: 360,
    description: "Medium roast coffee beans",
    tags: ["coffee", "organic", "kitchen"],
  },
  {
    name: "Wireless Mouse",
    category: "Electronics",
    price: 25.99,
    stock: 300,
    description: "Ergonomic wireless mouse",
    tags: ["electronics", "office", "accessories"],
  },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function ensureProducts() {
  if ((await prisma.product.count()) > 0) return;
  await prisma.product.createMany({ data: FALLBACK_PRODUCTS });
  console.log(`[simulator] created ${FALLBACK_PRODUCTS.length} fallback products`);
}

async function createRandomCustomer() {
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const emailName = name.toLowerCase().replace(/\s+/g, ".");
  const unique = `${Date.now()}${randomInt(1000, 9999)}`;
  const user = await prisma.user.create({
    data: {
      name,
      email: `${emailName}.${unique}@example.com`,
      password: "simulated_password_hash",
      role: "customer",
    },
    select: { id: true, email: true },
  });

  console.log(`[simulator] new signup: ${user.email}`);
  return user;
}

async function createRandomOrder(preferredUserId?: string) {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length === 0) {
    console.log("[simulator] skipped order (no products in stock)");
    return;
  }

  const product = pick(products);
  const quantity = randomInt(1, Math.min(3, product.stock));
  let userId = preferredUserId;

  if (!userId) {
    const customers = await prisma.user.findMany({
      where: { role: "customer" },
      select: { id: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    });
    userId = customers.length > 0
      ? pick(customers).id
      : (await createRandomCustomer()).id;
  }

  const sale = await prisma.$transaction(async (tx) => {
    // The stock predicate prevents concurrent workers from overselling.
    const updated = await tx.product.updateMany({
      where: { id: product.id, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    if (updated.count === 0) return null;

    return tx.sale.create({
      data: {
        userId,
        productId: product.id,
        quantity,
        price: product.price,
        customerSegment: pick(CUSTOMER_SEGMENTS),
        paymentMethod: pick(PAYMENT_METHODS),
      },
      select: { id: true },
    });
  });

  if (sale) {
    console.log(
      `[simulator] new order: sale=${sale.id} product="${product.name}" qty=${quantity}`
    );
  }
}

export async function runSimulationTick() {
  await ensureProducts();
  const user = Math.random() < 0.65 ? await createRandomCustomer() : undefined;
  if (Math.random() < 0.9) await createRandomOrder(user?.id);
}
