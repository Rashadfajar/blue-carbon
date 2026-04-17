import type { RiskItem } from "@/types/admin";

interface Props {
  value: RiskItem[];
  onChange: (items: RiskItem[]) => void;
}

export default function RiskFieldArray({ value, onChange }: Props) {
  const updateItem = (
    index: number,
    field: keyof RiskItem,
    fieldValue: string
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...value, { title: "", description: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="space-y-3 rounded-2xl border p-4">
          <input
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            placeholder="Risk title"
            className="w-full rounded-xl border px-4 py-3"
          />
          <textarea
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            placeholder="Risk description"
            className="w-full rounded-xl border px-4 py-3"
            rows={3}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="rounded-xl border px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Remove Risk
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
      >
        Add Risk
      </button>
    </div>
  );
}