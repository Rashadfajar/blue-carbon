interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagInput({ value, onChange }: Props) {
  const updateItem = (index: number, fieldValue: string) => {
    const updated = [...value];
    updated[index] = fieldValue;
    onChange(updated);
  };

  const addItem = () => {
    onChange([...value, ""]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.map((tag, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={tag}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder="Tag"
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
        Add Tag
      </button>
    </div>
  );
}