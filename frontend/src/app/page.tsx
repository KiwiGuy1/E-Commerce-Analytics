"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RevenueChart from "../components/RevenueChart";
import KPI from "../components/KPI";
import { AnalyticsData, Sale, Product } from "../types/analytics";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const DashboardHome: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    axios
      .get<AnalyticsData>(`${apiUrl}/analytics`)
      .then((res) => setData(res.data));
  }, []);

  // Helper: Get recent sales
  const recentSales = data?.sales.slice(-5).reverse() || [];

  // Helper: Get top 3 products by sales
  const topProducts =
    data?.products.filter((p: Product) => p && p.name).slice(0, 3) || [];

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-900">
        📊 E-Commerce Analytics Dashboard
      </h1>
      <p className="text-center text-blue-700 mb-8">
        Welcome! Track your sales, revenue, and product performance in real
        time.
      </p>
      {data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KPI
              label="Total Sales"
              value={data.totalSales}
              color="text-blue-600"
            />
            <KPI
              label="Total Revenue"
              value={`$${data.totalRevenue}`}
              color="text-green-600"
            />
            <KPI
              label="Top Product"
              value={data.topProduct}
              color="text-purple-600"
            />
            <KPI
              label="Products in Stock"
              value={data.products.reduce((sum, p) => sum + (p.stock || 0), 0)}
              color="text-orange-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold mb-6 text-center text-blue-900">
                Revenue Trend
              </h2>
              <div className="h-72">
                <RevenueChart
                  revenue={data.sales.map((sale) => sale.price * sale.quantity)}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold mb-6 text-center text-purple-900">
                Top Products
              </h2>
              <ul className="divide-y divide-gray-200">
                {topProducts.map((product: Product, idx: number) => (
                  <li
                    key={product._id || idx}
                    className="py-4 flex justify-between items-center"
                  >
                    <span className="font-semibold text-blue-800">
                      {product.name}
                    </span>
                    <span className="text-sm text-green-700">
                      {product.category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-center text-orange-900">
              Recent Sales
            </h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-blue-900">Product</th>
                  <th className="px-4 py-2 text-left text-blue-900">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-blue-900">Price</th>
                  <th className="px-4 py-2 text-left text-blue-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale: Sale, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 text-blue-800">
                      {sale.productId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-green-700">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-2 text-purple-700">${sale.price}</td>
                    <td className="px-4 py-2 text-orange-700">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-blue-700">Loading data...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
