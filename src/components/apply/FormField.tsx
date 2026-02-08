import React, { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

const FormField = forwardRef<HTMLDivElement, FormInputProps>(
  ({ label, required, error, children, className = "" }, ref) => {
    return (
      <div ref={ref} className={className}>
        <label className="block text-white text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div
          className={
            error
              ? "[&>input]:!border-red-400 [&>input]:!ring-2 [&>input]:!ring-red-400/30 [&>select]:!border-red-400 [&>select]:!ring-2 [&>select]:!ring-red-400/30 [&>textarea]:!border-red-400 [&>textarea]:!ring-2 [&>textarea]:!ring-red-400/30"
              : ""
          }
        >
          {children}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400 font-medium">{error.message}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
