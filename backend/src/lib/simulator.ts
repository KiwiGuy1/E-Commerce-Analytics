import prisma from "./prisma";

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

let timer: NodeJS.Timeout | null = null;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function randomEmail(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, ".");
  const unique = `${Date.now()}${randomInt(1000, 9999)}`;
  return `${normalized}.${unique}@example.com`;
}

async function ensureProducts() {
  const productCount = await prisma.product.count();
  if (productCount > 0) return;

  await prisma.product.createMany({
    data: FALLBACK_PRODUCTS,
  });

  console.log(`[simulator] created ${FALLBACK_PRODUCTS.length} fallback products`);
}

async function createRandomCustomer() {
  const name = randomName();
  const user = await prisma.user.create({
    data: {
      name,
      email: randomEmail(name),
      password: "simulated_password_hash",
      role: "customer",
    },
    select: {
      id: true,
      email: true,
    },
  });

  console.log(`[simulator] new signup: ${user.email}`);
  return user;
}

async function createRandomOrder(preferredUserId?: string) {
  const inStockProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });

  if (inStockProducts.length === 0) {
    console.log("[simulator] skipped order (no products in stock)");
    return;
  }

  const product = pick(inStockProducts);
  const quantity = randomInt(1, Math.min(3, product.stock));

  let userId = preferredUserId;
  if (!userId) {
    const customers = await prisma.user.findMany({
      where: { role: "customer" },
      select: { id: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    if (customers.length === 0) {
      const created = await createRandomCustomer();
      userId = created.id;
    } else {
      userId = pick(customers).id;
    }
  }

  const sale = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: product.id },
      data: { stock: { decrement: quantity } },
    });

    return tx.sale.create({
      data: {
        userId,
        productId: product.id,
        quantity,
        price: product.price,
        customerSegment: pick(CUSTOMER_SEGMENTS),
        paymentMethod: pick(PAYMENT_METHODS),
      },
      select: {
        id: true,
      },
    });
  });

  console.log(
    `[simulator] new order: sale=${sale.id} product="${product.name}" qty=${quantity}`
  );
}

export async function runSimulationTick() {
  await ensureProducts();

  const signupHappens = Math.random() < 0.65;
  let createdUserId: string | undefined;

  if (signupHappens) {
    const user = await createRandomCustomer();
    createdUserId = user.id;
  }

  const orderHappens = Math.random() < 0.9;
  if (orderHappens) {
    await createRandomOrder(createdUserId);
  }
}

export async function startSimulator() {
  if (process.env.SIMULATOR_ENABLED === "false") {
    console.log("[simulator] disabled");
    return;
  }

  const configuredInterval = Number(process.env.SIMULATOR_INTERVAL_MS ?? 30000);
  const intervalMs = Number.isFinite(configuredInterval) && configuredInterval > 0
    ? configuredInterval
    : 30000;

  try {
    await runSimulationTick();
  } catch (error) {
    console.error("[simulator] startup tick failed", error);
  }

  timer = setInterval(() => {
    void runSimulationTick().catch((error) => {
      console.error("[simulator] tick failed", error);
    });
  }, intervalMs);

  console.log(`[simulator] running every ${intervalMs}ms`);
}

export function stopSimulator() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
