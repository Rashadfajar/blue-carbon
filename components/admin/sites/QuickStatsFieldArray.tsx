import KeyValueRows from "@/components/admin/shared/KeyValueRows";
import type { KeyValueItem } from "@/types/admin";

interface Props {
  value: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
}

export default function QuickStatsFieldArray({ value, onChange }: Props) {
  return (
    <KeyValueRows
      value={value}
      onChange={onChange}
      addLabel="Add Quick Stat"
      keyPlaceholder="Label"
      valuePlaceholder="Value"
    />
  );
}