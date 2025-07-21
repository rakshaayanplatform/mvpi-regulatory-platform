import * as React from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "large" | "small";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = "primary",
    size = "large",
    disabled,
    loading,
    children,
    ...props
  }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
    const variants = {
      primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
      secondary: "bg-[#22c55e] text-white hover:bg-[#16a34a]",
    };
    const sizes = {
      large: "h-12 px-8 text-[16px] min-w-[160px]",
      small: "h-9 px-6 text-[16px] min-w-[120px]",
    };
    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          disabled ? "bg-[#cbd5e1] text-white cursor-not-allowed" : "",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button"; 