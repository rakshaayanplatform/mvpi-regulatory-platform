import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "large" | "small";
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = "large", error, disabled, ...props }, ref) => {
    const sizes = {
      large: "h-12 px-4 text-[16px] min-w-[360px]",
      small: "h-9 px-3 text-[16px] min-w-[240px]",
    };
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full rounded-lg border text-[#1e293b] placeholder-[#64748b] bg-white focus:outline-none transition-colors",
          sizes[size],
          error
            ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]"
            : "border-[#e5e7eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]",
          disabled && "bg-[#f9fafb] text-[#cbd5e1] cursor-not-allowed",
          className
        )}
        disabled={disabled}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input"; 