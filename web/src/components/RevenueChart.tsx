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
  Legend,
);

interface RevenueChartProps {
  revenue: number[];
  labels: string[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenue, labels }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.16)",
        pointBackgroundColor: "#0284c7",
        pointBorderWidth: 0,
        pointRadius: 2.8,
        pointHoverRadius: 4,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false, text: "Revenue Trend" },
      tooltip: {
        displayColors: false,
        backgroundColor: "rgba(15,23,42,0.92)",
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148,163,184,0.14)" },
        ticks: { color: "#64748b", maxRotation: 0 },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.14)" },
        ticks: {
          color: "#64748b",
          callback: (value: string | number) => `$${value}`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default RevenueChart;
