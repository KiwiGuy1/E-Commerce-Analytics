import request from "supertest";
import type { Application } from "express";

const runIntegrationTests = process.env.RUN_INTEGRATION_TESTS === "true";
const describeIfIntegration = runIntegrationTests ? describe : describe.skip;

describeIfIntegration("GET /api/analytics (integration)", () => {
  let app: Application;
  let prisma: any;
  let disconnectPrisma: () => Promise<void>;

  beforeAll(async () => {
    ({ default: app } = await import("../app"));
    ({ default: prisma, disconnectPrisma } = await import("../lib/prisma"));
  });

  beforeEach(async () => {
    await prisma.sale.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await disconnectPrisma();
  });

  it("returns aggregate analytics from real postgres data", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Integration User",
        email: "integration@example.com",
        password: "not_hashed_for_test",
      },
    });

    const productA = await prisma.product.create({
      data: {
        name: "Product A",
        category: "Test",
        price: 10,
        stock: 50,
        tags: ["test"],
      },
    });

    const productB = await prisma.product.create({
      data: {
        name: "Product B",
        category: "Test",
        price: 5,
        stock: 30,
        tags: ["test"],
      },
    });

    await prisma.sale.createMany({
      data: [
        {
          userId: user.id,
          productId: productA.id,
          quantity: 2,
          price: 10,
        },
        {
          userId: user.id,
          productId: productB.id,
          quantity: 4,
          price: 5,
        },
      ],
    });

    const response = await request(app).get("/api/analytics");

    expect(response.status).toBe(200);
    expect(response.body.totalSales).toBe(6);
    expect(response.body.totalRevenue).toBe(40);
    expect(response.body.topProduct).toBe("Product B");
    expect(response.body.products).toHaveLength(2);
    expect(response.body.sales).toHaveLength(2);
  });
});
