"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-tcrc-sm p-1">
        {label && (
          <label className="font-bold text-tcrc-body text-tcrc-text-primary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "ios-input py-2 px-3 rounded-tcrc-md border border-tcrc-border text-tcrc-body",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
