import { Request, Response } from "express";
import prisma from "../lib/prisma";

function mapSaleResponse(sale: {
  id: string;
  userId: string;
  quantity: number;
  price: number;
  date: Date;
  customerSegment: string | null;
  paymentMethod: string | null;
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string | null;
    tags: string[];
  };
}) {
  return {
    _id: sale.id,
    userId: sale.userId,
    productId: {
      _id: sale.product.id,
      name: sale.product.name,
      category: sale.product.category,
      price: sale.product.price,
      stock: sale.product.stock,
      description: sale.product.description,
      tags: sale.product.tags,
    },
    quantity: sale.quantity,
    price: sale.price,
    date: sale.date,
    customerSegment: sale.customerSegment,
    paymentMethod: sale.paymentMethod,
  };
}

export const createSale = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity, customerSegment, paymentMethod } =
      req.body;

    if (!userId || !productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message:
          "Invalid payload. userId, productId, and integer quantity >= 1 are required.",
      });
    }

    const [user, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findUnique({ where: { id: productId } }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${product.stock}.`,
      });
    }

    const sale = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: quantity } },
      });

      return tx.sale.create({
        data: {
          userId,
          productId,
          quantity,
          price: product.price,
          customerSegment: customerSegment?.trim() || null,
          paymentMethod: paymentMethod?.trim() || null,
        },
        include: {
          product: true,
        },
      });
    });

    return res.status(201).json(mapSaleResponse(sale));
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
