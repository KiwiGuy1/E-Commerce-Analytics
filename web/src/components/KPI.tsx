import React from "react";

interface KPIProps {
  label: string;
  value: string | number;
  color?: string;
  sublabel?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

const KPI: React.FC<KPIProps> = ({
  label,
  value,
  color = "text-blue-600",
  sublabel,
  align = "start",
  className = "",
}) => {
  const alignClass =
    align === "center"
      ? "items-center"
      : align === "end"
        ? "items-end"
        : "items-start";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <span className={`mt-2 text-3xl font-bold leading-none ${color}`}>
        {value}
      </span>
      {sublabel && (
        <span className="mt-2 text-xs text-slate-500">{sublabel}</span>
      )}
    </div>
  );
};

export default KPI;
