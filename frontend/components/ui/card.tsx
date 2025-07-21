import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card"; 