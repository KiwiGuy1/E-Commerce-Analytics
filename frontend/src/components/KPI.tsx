import React from "react";

interface KPIProps {
  label: string;
  value: string | number;
  color?: string;
}

const KPI: React.FC<KPIProps> = ({ label, value, color = "text-blue-600" }) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
    <span className="text-lg font-semibold text-gray-500">{label}</span>
    <span className={`text-2xl font-bold mt-2 ${color}`}>{value}</span>
  </div>
);

export default KPI;
