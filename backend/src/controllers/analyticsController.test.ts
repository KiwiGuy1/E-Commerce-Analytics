import request from "supertest";
import express from "express";
import { getAnalytics } from "./analyticsController";

const app = express();
app.get("/api/analytics", getAnalytics);

describe("GET /api/analytics", () => {
  it("should return analytics data", async () => {
    const response = await request(app).get("/api/analytics");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sales");
    expect(response.body).toHaveProperty("revenue");
    expect(response.body).toHaveProperty("topProducts");
  });
});
