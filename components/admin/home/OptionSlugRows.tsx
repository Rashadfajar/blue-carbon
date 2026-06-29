"use client";

import type { OptionItem } from "@/types/admin";

interface Props {
  title: string;
  value: string[];
  options: OptionItem[];
  onChange: (items: string[]) => void;
}

export default function OptionSlugRows({ title, value, options, onChange }: Props) {
  const updateItem = (index: number, next: string) => {
    const updated = [...value];
    updated[index] = next;
    onChange(updated);
  };

  const addItem = () => onChange([...value, ""]);
  const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <select
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              <option value="">Select item</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-xl border px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}