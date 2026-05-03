interface CtaItem {
  label: string;
  href: string;
}

interface Props {
  value: CtaItem[];
  onChange: (items: CtaItem[]) => void;
  addLabel?: string;
}

export default function CtaRows({
  value,
  onChange,
  addLabel = "Add Link",
}: Props) {
  const updateItem = (
    index: number,
    field: keyof CtaItem,
    fieldValue: string
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...value, { label: "", href: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            value={item.label}
            onChange={(e) => updateItem(index, "label", e.target.value)}
            placeholder="Label"
            className="rounded-xl border px-4 py-3"
          />
          <input
            value={item.href}
            onChange={(e) => updateItem(index, "href", e.target.value)}
            placeholder="Href"
            className="rounded-xl border px-4 py-3"
          />
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
        {addLabel}
      </button>
    </div>
  );
}