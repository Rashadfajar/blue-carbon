interface Props {
  title?: string;
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export default function RepeatableFieldArray({
  title,
  value,
  onChange,
  placeholder = "Enter value",
  addLabel = "Add Item",
}: Props) {
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
    <div>
      {title ? <h3 className="mb-4 text-base font-semibold">{title}</h3> : null}

      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
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
    </div>
  );
}