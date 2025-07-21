import * as React from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  success: "bg-[#22c55e]",
  error: "bg-[#ef4444]",
  info: "bg-[#2563eb]",
  warning: "bg-[#f59e42]",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "info" | "warning";
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "flex items-center gap-3 w-[320px] min-h-[56px] rounded-lg px-4 py-3 text-white text-[16px] shadow-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  )
);
Alert.displayName = "Alert"; 