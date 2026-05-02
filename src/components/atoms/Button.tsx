"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-tcrc-md text-tcrc-body font-semibold transition-all ios-button focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-tcrc-accent text-white hover:bg-tcrc-accent-hover",
        yellow: "bg-tcrc-accent-yellow text-white hover:brightness-110",
        blue: "bg-tcrc-accent-blue text-white hover:brightness-110",
        outline: "border border-tcrc-border bg-transparent text-tcrc-text-primary hover:bg-tcrc-bg-surface",
        ghost: "bg-transparent text-tcrc-text-secondary hover:bg-tcrc-bg-surface",
        destructive: "bg-tcrc-status-error text-white hover:brightness-110",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-tcrc-caption",
        lg: "h-14 px-8 py-4 text-tcrc-title3",
        icon: "h-10 w-10 p-2",
        full: "w-full h-14 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
