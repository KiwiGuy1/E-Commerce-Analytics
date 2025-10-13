"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Sale } from "../../types/analytics";
import RevenueChart from "../../components/RevenueChart";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<{ sales: Sale[] }>(`${apiUrl}/analytics`)
      .then((res) => setSales(res.data.sales));
  }, []);

  // Helper: Get sales by date for chart
  const salesByDate: { [date: string]: number } = {};
  sales.forEach((sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    salesByDate[date] = (salesByDate[date] || 0) + sale.price * sale.quantity;
  });

  const chartData = Object.entries(salesByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // GSAP entrance animation
  useEffect(() => {
    if (!scope.current) return;
    import("gsap").then(({ gsap }) => {
      gsap.fromTo(
        scope.current,
        { autoAlpha: 0, y: 32, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
      );
      gsap.from(".sales-card", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });
    });
  }, []);

  return (
    <div
      ref={scope}
      className="min-h-screen w-full px-0 md:px-0 flex flex-col items-center justify-start bg-gradient-to-br from-black via-purple-900 to-black"
    >
      <h1 className="text-4xl font-extrabold mt-10 mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-700 tracking-tight drop-shadow-lg">
        ⚛️ Atomic Sales & Orders
      </h1>
      <div className="sales-card w-full max-w-6xl bg-gradient-to-br from-black via-purple-950 to-black border border-purple-900 rounded-3xl shadow-2xl p-10 mb-10">
        <h2 className="text-2xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-600">
          Revenue Trend by Date
        </h2>
        <div className="h-80">
          <RevenueChart
            revenue={chartData.map((d) => d.revenue)}
            labels={chartData.map((d) => d.date)}
          />
        </div>
      </div>
      <div className="sales-card w-full max-w-6xl bg-gradient-to-br from-black via-purple-950 to-black border border-purple-900 rounded-3xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-600">
          Recent Sales
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-purple-200 font-semibold">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {sales
                .slice(-20)
                .reverse()
                .map((sale, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-purple-900 hover:bg-purple-950/60 transition-colors"
                  >
                    <td className="px-4 py-2 text-purple-100">
                      {typeof sale.productId === "object" &&
                      "name" in sale.productId
                        ? sale.productId.name
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-fuchsia-400 font-bold">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-2 text-purple-400 font-bold">
                      ${sale.price}
                    </td>
                    <td className="px-4 py-2 text-purple-300">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-purple-200">
                      {sale.customerSegment || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-fuchsia-400">
                      {sale.paymentMethod || "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 text-center">
        <Link href="/" className="text-purple-400 hover:underline text-lg">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SalesPage;
