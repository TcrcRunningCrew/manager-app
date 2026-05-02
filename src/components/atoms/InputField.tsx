"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-tcrc-sm p-1">
        {label && (
          <label className="font-bold text-tcrc-body text-tcrc-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "ios-input py-2 px-3 rounded-tcrc-md border border-tcrc-border bg-white text-tcrc-text-inverted text-tcrc-body",
            props.disabled && "opacity-80 font-bold",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-tcrc-caption text-tcrc-status-error">{error}</p>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

export { InputField };
