"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import RevenueChart from "../components/RevenueChart";
import KPI from "../components/KPI";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface AnalyticsData {
  sales: number[];
  revenue: number[];
  topProducts: string[];
}

const DashboardHome: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    axios
      .get<AnalyticsData>(`${apiUrl}/analytics`)
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📊 E-Commerce Analytics Dashboard
      </h1>
      {data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KPI
              label="Total Sales"
              value={data.sales.reduce((a, b) => a + b, 0)}
              color="text-blue-600"
            />
            <KPI
              label="Total Revenue"
              value={`$${data.revenue.reduce((a, b) => a + b, 0)}`}
              color="text-green-600"
            />
            <KPI
              label="Top Product"
              value={data.topProducts[0]}
              color="text-purple-600"
            />
          </div>

          {/* Chart Section - full width below KPIs */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 text-center">
              Revenue Trend
            </h2>
            <div className="h-72">
              <RevenueChart revenue={data.revenue} />
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading data...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
