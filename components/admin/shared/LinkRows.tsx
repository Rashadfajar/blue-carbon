"use client";

import type { SiteLinkItem } from "@/types/admin";

interface Props {
  value: SiteLinkItem[];
  onChange: (items: SiteLinkItem[]) => void;
}

export default function LinkRows({ value, onChange }: Props) {
  const updateItem = (
    index: number,
    field: keyof SiteLinkItem,
    fieldValue: string
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...value, { label: "", href: "", description: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="space-y-3 rounded-2xl border p-4">
          <input
            value={item.label}
            onChange={(e) => updateItem(index, "label", e.target.value)}
            placeholder="Link label, e.g. FS Mangrove Belitung Timur"
            className="w-full rounded-xl border px-4 py-3"
          />
          <input
            value={item.href}
            onChange={(e) => updateItem(index, "href", e.target.value)}
            placeholder="/resources/fs-mangrove-belitung-timur or external URL"
            className="w-full rounded-xl border px-4 py-3"
          />
          <textarea
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            placeholder="Short description"
            className="w-full rounded-xl border px-4 py-3"
            rows={2}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-xl border px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Remove Link
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
      >
        Add Link
      </button>
    </div>
  );
}