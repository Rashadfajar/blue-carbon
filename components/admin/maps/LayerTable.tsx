"use client";

import { useState } from "react";
import type { MapLayerItem } from "@/types/api";

interface LayerRow extends MapLayerItem {
  featureCount?: number;
}

interface Props {
  layers: LayerRow[];
  onDelete: (slug: string) => Promise<void>;
}

export default function LayerTable({ layers, onDelete }: Props) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="bc-table w-full text-left text-sm">
        <thead>
          <tr className="border-b text-slate-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Default Visible</th>
            <th className="px-4 py-3">Features</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((layer) => (
            <tr key={layer.slug} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{layer.name}</td>
              <td className="px-4 py-3 text-slate-500">{layer.slug}</td>
              <td className="px-4 py-3 text-slate-500">{layer.category}</td>
              <td className="px-4 py-3 text-slate-500">{layer.source_type}</td>
              <td className="px-4 py-3 text-slate-500">{layer.is_default_visible ? "Yes" : "No"}</td>
              <td className="px-4 py-3 text-slate-500">{layer.featureCount ?? "-"}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={deletingSlug === layer.slug}
                  onClick={async () => {
                    const confirmed = window.confirm(`Delete layer ${layer.name}?`);
                    if (!confirmed) return;
                    setDeletingSlug(layer.slug);
                    try {
                      await onDelete(layer.slug);
                    } finally {
                      setDeletingSlug(null);
                    }
                  }}
                  className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}