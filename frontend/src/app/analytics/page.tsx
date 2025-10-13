"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnalyticsData, Sale, Product } from "../../types/analytics";
import RevenueChart from "../../components/RevenueChart";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    axios.get<AnalyticsData>(`${apiUrl}/analytics`).then((res) => {
      console.log("Analytics data:", res.data); // Check if sales exist
      setData(res.data);
    });
  }, []);

  // Revenue breakdown by month
  const revenueByMonth: { [month: string]: number } = {};
  data?.sales.forEach((sale: Sale) => {
    const month = new Date(sale.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    revenueByMonth[month] =
      (revenueByMonth[month] || 0) + sale.price * sale.quantity;
  });

  // Product performance
  const productPerformance: { [name: string]: number } = {};
  data?.sales.forEach((sale: Sale) => {
    if (typeof sale.productId === "object" && "name" in sale.productId) {
      const name = sale.productId.name;
      productPerformance[name] =
        (productPerformance[name] || 0) + sale.quantity;
    }
  });

  // Customer acquisition channels (dummy example)
  const acquisitionChannels = [
    { channel: "Organic Search", percent: 40 },
    { channel: "Paid Ads", percent: 30 },
    { channel: "Social Media", percent: 20 },
    { channel: "Referral", percent: 10 },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">
        📈 Analytics / Reports
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold mb-6 text-center text-blue-900">
            Revenue Breakdown by Month
          </h2>
          <RevenueChart
            revenue={
              Object.values(revenueByMonth).length
                ? Object.values(revenueByMonth)
                : [0]
            }
            labels={
              Object.keys(revenueByMonth).length
                ? Object.keys(revenueByMonth)
                : ["No Data"]
            }
          />
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold mb   -6 text-center text-purple-900">
            Product Performance
          </h2>
          <ul className="divide-y divide-gray-200">
            {Object.entries(productPerformance).map(([name, qty], idx) => (
              <li key={idx} className="py-4 flex justify-between items-center">
                <span className="font-semibold text-blue-800">{name}</span>
                <span className="text-sm text-green-700">{qty} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-8 mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center text-orange-900">
          Customer Acquisition Channels
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-blue-900">Channel</th>
              <th className="px-4 py-2 text-left text-blue-900">Percent</th>
            </tr>
          </thead>
          <tbody>
            {acquisitionChannels.map((ch, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2 text-blue-800">{ch.channel}</td>
                <td className="px-4 py-2 text-green-700">{ch.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsPage;
