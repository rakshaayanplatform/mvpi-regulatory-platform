import * as React from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
import { Button } from "@/components/ui/button";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  onSeeDetails?: () => void;
  color?: "primary" | "secondary";
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onSeeDetails,
  color = "primary",
  className,
  ...props
}) => {
  const bg = color === "primary" ? "bg-[#e0edfd]" : "bg-[#e6faed]";
  return (
    <div
      className={cn(
        "rounded-2xl shadow-sm p-6 flex flex-col items-start gap-4 min-w-[240px] max-w-[320px]",
        bg,
        className
      )}
      {...props}
    >
      {icon && <div className="w-10 h-10 mb-2">{icon}</div>}
      <h3 className="text-[22px] font-semibold text-[#1e293b] leading-6">{title}</h3>
      <p className="text-[16px] text-[#1e293b] mb-2">{description}</p>
      {onSeeDetails && (
        <Button
          size="small"
          variant="secondary"
          className="mt-auto"
          onClick={onSeeDetails}
        >
          See Details
        </Button>
      )}
    </div>
  );
}; 