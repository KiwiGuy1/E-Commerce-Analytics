import request from "supertest";
import express from "express";
import { getAnalytics } from "./analyticsController";
import prisma from "../lib/prisma";

jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    product: { findMany: jest.fn() },
    sale: { findMany: jest.fn() },
  },
}));

const app = express();
app.get("/api/analytics", getAnalytics);

describe("GET /api/analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return analytics data", async () => {
    const mockProducts = [
      {
        id: "p1",
        name: "Wireless Headphones",
        category: "Electronics",
        price: 89.99,
        stock: 45,
        description: "Noise-cancelling over-ear headphones",
        tags: ["wireless", "bluetooth", "audio"],
      },
      {
        id: "p2",
        name: "Organic Coffee Beans",
        category: "Food & Beverage",
        price: 14.99,
        stock: 120,
        description: "Medium roast, fair-trade Arabica",
        tags: ["organic", "coffee", "fair-trade"],
      },
    ];

    const mockSales = [
      {
        id: "s1",
        userId: "u1",
        productId: "p1",
        quantity: 2,
        price: 89.99,
        date: new Date("2026-02-01T10:00:00.000Z"),
        customerSegment: "premium",
        paymentMethod: "credit_card",
        product: mockProducts[0],
      },
      {
        id: "s2",
        userId: "u2",
        productId: "p2",
        quantity: 5,
        price: 14.99,
        date: new Date("2026-02-02T10:00:00.000Z"),
        customerSegment: "bulk",
        paymentMethod: "paypal",
        product: mockProducts[1],
      },
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (prisma.sale.findMany as jest.Mock).mockResolvedValue(mockSales);

    const response = await request(app).get("/api/analytics");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sales");
    expect(response.body).toHaveProperty("totalSales");
    expect(response.body).toHaveProperty("totalRevenue");
    expect(response.body).toHaveProperty("topProduct");
    expect(response.body.totalSales).toBe(7);
    expect(response.body.topProduct).toBe("Organic Coffee Beans");
  });
});
