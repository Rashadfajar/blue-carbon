"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { OptionItem, OptionListResponse, SiteLinkItem } from "@/types/admin";

interface Props {
  value: SiteLinkItem[];
  onChange: (items: SiteLinkItem[]) => void;
}

export default function LinkRows({ value, onChange }: Props) {
  const [resources, setResources] = useState<OptionItem[]>([]);

  useEffect(() => {
    apiFetch<OptionListResponse>("/admin/options/resources")
      .then((res) => setResources(res.items))
      .catch(() => setResources([]));
  }, []);

  const updateItem = (index: number, next: Partial<SiteLinkItem>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...next };
    onChange(updated);
  };

  const addItem = () => {
    const newItem: SiteLinkItem = {
      type: "resource",
      label: "",
      description: "",
      resource_slug: "",
      href: "",
    };

    onChange([...value, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="space-y-3 rounded-2xl border p-4">
          <select
            value={item.type || "resource"}
            onChange={(e) =>
              updateItem(index, {
                type: e.target.value as SiteLinkItem["type"],
              })
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="resource">Resource from Resource Manager</option>
            <option value="external">External Link</option>
            <option value="map">Map Link</option>
          </select>

          {item.type === "resource" || !item.type ? (
            <>
              <select
                value={item.resource_slug || ""}
                onChange={(e) => {
                  const selected = resources.find((x) => x.value === e.target.value);
                  updateItem(index, {
                    resource_slug: e.target.value,
                    label: selected?.label || item.label,
                    description: selected?.summary || item.description,
                    href: e.target.value ? `/resources/${e.target.value}` : "",
                  });
                }}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Select resource</option>
                {resources.map((res) => (
                  <option key={res.value} value={res.value}>
                    {res.label}
                  </option>
                ))}
              </select>

              <input
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                placeholder="Display label"
                className="w-full rounded-xl border px-4 py-3"
              />

              <textarea
                value={item.description || ""}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                placeholder="Short description"
                className="w-full rounded-xl border px-4 py-3"
                rows={2}
              />
            </>
          ) : null}

          {item.type === "external" ? (
            <>
              <input
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                placeholder="External link label"
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                value={item.external_url || ""}
                onChange={(e) =>
                  updateItem(index, {
                    external_url: e.target.value,
                    href: e.target.value,
                  })
                }
                placeholder="https://..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </>
          ) : null}

          {item.type === "map" ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Map link will be generated automatically from the site slug.
            </div>
          ) : null}

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