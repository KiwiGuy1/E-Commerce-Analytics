import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(
      users.map((user) => ({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
