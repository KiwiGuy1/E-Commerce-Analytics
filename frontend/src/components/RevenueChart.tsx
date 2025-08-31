import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  revenue: number[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenue }) => {
  const data = {
    labels: revenue.map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Revenue Trend" },
    },
  };

  return <Line data={data} options={options} />;
};

export default RevenueChart;
