import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, disabled, ...props }, ref) => (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "w-6 h-6 rounded border-2 border-[#e5e7eb] appearance-none transition-colors focus:ring-2 focus:ring-[#2563eb] focus:outline-none",
          "checked:bg-[#2563eb] checked:border-[#2563eb] checked:text-white",
          disabled && "bg-[#f9fafb] border-[#cbd5e1] cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      />
      <span className="ml-2 select-none text-[16px] text-[#1e293b]">{props.children}</span>
    </label>
  )
);
Checkbox.displayName = "Checkbox"; 