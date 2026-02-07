import type { FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({ label, required, error, children, className = "" }: FormInputProps) => {
  return (
    <div className={className}>
      <label className="block text-white text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
