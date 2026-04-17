import RepeatableFieldArray from "@/components/admin/shared/RepeatableFieldArray";

interface Props {
  title: string;
  placeholder: string;
  value: string[];
  onChange: (items: string[]) => void;
}

export default function StringListFieldArray({
  title,
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <RepeatableFieldArray
      title={title}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      addLabel="Add Item"
    />
  );
}