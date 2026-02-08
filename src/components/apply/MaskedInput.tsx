import { useCallback } from "react";

const masks = {
  ssn: (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  },
  phone: (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  },
  zip: (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  },
};

interface MaskedInputProps {
  value: string;
  onChange: (formatted: string) => void;
  mask: keyof typeof masks;
  name?: string;
  placeholder?: string;
  className?: string;
  type?: string;
}

const MaskedInput = ({ value, onChange, mask, name, placeholder, className, type }: MaskedInputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(masks[mask](e.target.value));
    },
    [mask, onChange]
  );

  return (
    <input
      name={name}
      type={type || "text"}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default MaskedInput;
