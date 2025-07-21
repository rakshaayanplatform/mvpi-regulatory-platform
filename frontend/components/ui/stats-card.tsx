import * as React from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 bg-white rounded-2xl shadow-sm p-6 min-w-[200px] max-w-[320px]",
        className
      )}
      {...props}
    >
      {icon && <div className="w-10 h-10 text-[#2563eb]">{icon}</div>}
      <div>
        <div className="text-[28px] font-bold text-[#2563eb] leading-7">{value}</div>
        <div className="text-[16px] text-[#1e293b]">{label}</div>
      </div>
    </div>
  );
}; 