import type { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "online",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "offline",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
};