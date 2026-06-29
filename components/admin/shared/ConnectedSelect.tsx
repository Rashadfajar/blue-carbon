import type { OptionItem } from "@/types/admin";

interface Props {
  label?: string;
  value: string;
  options: OptionItem[];
  placeholder?: string;
  onChange: (value: string, option?: OptionItem) => void;
}

export default function ConnectedSelect({
  label,
  value,
  options,
  placeholder = "Select option",
  onChange,
}: Props) {
  return (
    <div className="space-y-1">
      {label ? <div className="text-sm font-medium text-slate-600">{label}</div> : null}

      <select
        value={value}
        onChange={(e) => {
          const selected = options.find((x) => x.value === e.target.value);
          onChange(e.target.value, selected);
        }}
        className="w-full rounded-xl border px-4 py-3"
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}