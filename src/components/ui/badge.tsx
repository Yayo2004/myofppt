import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-purple-100 text-purple-700",
      secondary: "bg-gray-100 text-gray-700",
      outline: "border border-gray-300 text-gray-600",
    };
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
