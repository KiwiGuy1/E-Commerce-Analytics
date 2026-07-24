import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [products, sales] = await Promise.all([
      prisma.product.findMany(),
      prisma.sale.findMany({
        include: {
          product: true,
        },
        orderBy: {
          date: "asc",
        },
      }),
    ]);

    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.price * sale.quantity,
      0,
    );

    const productSalesCount: { [key: string]: number } = {};
    sales.forEach((sale) => {
      productSalesCount[sale.productId] =
        (productSalesCount[sale.productId] || 0) + sale.quantity;
    });

    const topProductId = Object.entries(productSalesCount).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    const topProduct =
      products.find((product) => product.id === topProductId)?.name || "N/A";

    res.json({
      totalSales,
      totalRevenue,
      topProduct,
      products: products.map((product) => ({
        _id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        tags: product.tags,
      })),
      sales: sales.map((sale) => ({
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
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
