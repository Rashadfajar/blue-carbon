"use client";

import type { RiskItem } from "@/types/admin";

export default function RiskRows({
  value,
  onChange,
}: {
  value: RiskItem[];
  onChange: (items: RiskItem[]) => void;
}) {
  const updateRow = (index: number, field: keyof RiskItem, nextValue: string) => {
    const copy = [...value];
    copy[index] = { ...copy[index], [field]: nextValue };
    onChange(copy);
  };

  const addRow = () => onChange([...value, { title: "", description: "" }]);
  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {value.map((row, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={row.title}
            onChange={(e) => updateRow(index, "title", e.target.value)}
            placeholder="Risk title"
            className="rounded-2xl border px-4 py-3"
          />
          <input
            value={row.description}
            onChange={(e) => updateRow(index, "description", e.target.value)}
            placeholder="Risk description"
            className="rounded-2xl border px-4 py-3"
          />
          <button type="button" onClick={() => removeRow(index)} className="rounded-2xl border px-4 py-3">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Add risk
      </button>
    </div>
  );
}