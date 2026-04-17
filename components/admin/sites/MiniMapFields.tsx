import type { MiniMapValue } from "@/types/admin";

interface Props {
  value: MiniMapValue;
  onChange: (value: MiniMapValue) => void;
}

export default function MiniMapFields({ value, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <input
        type="number"
        value={value.latitude}
        onChange={(e) =>
          onChange({ ...value, latitude: Number(e.target.value) })
        }
        placeholder="Latitude"
        className="rounded-xl border px-4 py-3"
      />
      <input
        type="number"
        value={value.longitude}
        onChange={(e) =>
          onChange({ ...value, longitude: Number(e.target.value) })
        }
        placeholder="Longitude"
        className="rounded-xl border px-4 py-3"
      />
      <input
        type="number"
        value={value.zoom}
        onChange={(e) =>
          onChange({ ...value, zoom: Number(e.target.value) })
        }
        placeholder="Zoom"
        className="rounded-xl border px-4 py-3"
      />
    </div>
  );
}