import { Request, Response } from "express";
import Product from "../models/Product";
import Sale from "../models/Sale";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Always populate productId so it's a product object
    const products: Array<{ _id: any; name: string }> = await Product.find();
    const sales = await Sale.find().populate("productId");

    // Calculate total sales and revenue
    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.price * sale.quantity,
      0
    );

    // Find top product by sales quantity
    const productSalesCount: { [key: string]: number } = {};
    sales.forEach((sale) => {
      const id = (sale.productId as typeof Product.prototype)._id.toString();
      productSalesCount[id] = (productSalesCount[id] || 0) + sale.quantity;
    });

    const topProductId = Object.entries(productSalesCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    const topProduct =
      products.find((p) => p._id.toString() === topProductId)?.name || "N/A";

    res.json({
      totalSales,
      totalRevenue,
      topProduct,
      products,
      sales,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
