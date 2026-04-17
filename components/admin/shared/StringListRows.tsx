"use client";

export default function StringListRows({
  value,
  onChange,
}: {
  value: string[];
  onChange: (items: string[]) => void;
}) {
  const updateRow = (index: number, nextValue: string) => {
    const copy = [...value];
    copy[index] = nextValue;
    onChange(copy);
  };

  const addRow = () => onChange([...value, ""]);
  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {value.map((row, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={row}
            onChange={(e) => updateRow(index, e.target.value)}
            placeholder="Value"
            className="rounded-2xl border px-4 py-3"
          />
          <button type="button" onClick={() => removeRow(index)} className="rounded-2xl border px-4 py-3">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Add row
      </button>
    </div>
  );
}