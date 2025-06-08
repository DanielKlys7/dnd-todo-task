type SelectProps = {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  optionKey?: string;
  optionLabel?: string;
};

export const Select = ({ options, value, onChange }: SelectProps) => (
  <select
    value={value}
    onChange={(e) => {
      const selectedValue = e.target.value;
      onChange(selectedValue);
    }}
    className="px-4 py-3 border border-primary rounded-md focus:outline-none 
    focus:ring-2 focus:ring-accent h-12 "
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
