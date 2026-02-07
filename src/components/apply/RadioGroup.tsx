interface RadioGroupProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup = ({ label, options, value, onChange }: RadioGroupProps) => {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-3">{label}</label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                value === option
                  ? "border-accent bg-accent"
                  : "border-white/50 bg-transparent group-hover:border-white/80"
              }`}
              onClick={() => onChange(option)}
            >
              {value === option && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-white/90 text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
