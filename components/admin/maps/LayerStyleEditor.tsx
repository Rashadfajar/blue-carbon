"use client";

import { useState } from "react";
import type { MapLayerItem } from "@/types/api";

interface Props {
  layer: MapLayerItem;
  onSaved: () => Promise<void>;
  onClose: () => void;
}

const STYLE_PRESETS = {
  mangrove: {
    label: "Mangrove",
    fill_color: "#B6DAB8",
    fill_opacity: 0.55,
    stroke_color: "#84BD83",
    stroke_opacity: 0,
    stroke_weight: 0,
  },
  seagrass: {
    label: "Lamun / Seagrass",
    fill_color: "#ACDACF",
    fill_opacity: 0.55,
    stroke_color: "#78BEAA",
    stroke_opacity: 0,
    stroke_weight: 0,
  },
  custom: {
    label: "Custom",
  },
};

type StylePresetKey = keyof typeof STYLE_PRESETS;

function getDefaultLayerStyle(layer: MapLayerItem) {
  const text = `${layer.slug} ${layer.name} ${layer.category}`.toLowerCase();

  const isSeagrass =
    text.includes("lamun") ||
    text.includes("seagrass") ||
    text.includes("padang-lamun") ||
    text.includes("padang lamun");

  const isMangrove =
    text.includes("mangrove") ||
    text.includes("mangrove") ||
    text.includes("bakau");

  if (isSeagrass) {
    return {
      fill_color: "#ACDACF",
      fill_opacity: 0.55,
      stroke_color: "#78BEAA",
      stroke_opacity: 0,
      stroke_weight: 0,
    };
  }

  if (isMangrove) {
    return {
      fill_color: "#B6DAB8",
      fill_opacity: 0.55,
      stroke_color: "#84BD83",
      stroke_opacity: 0,
      stroke_weight: 0,
    };
  }

  return {
    fill_color: "#94A3B8",
    fill_opacity: 0.35,
    stroke_color: "#64748B",
    stroke_opacity: 0,
    stroke_weight: 0,
  };
}

export default function LayerStyleEditor({ layer, onSaved, onClose }: Props) {
  const [stylePreset, setStylePreset] = useState<StylePresetKey>("custom");
  const [form, setForm] = useState({
    name: layer.name,
    category: layer.category,
    description: layer.description || "",
    is_default_visible: layer.is_default_visible,
    fill_color: layer.fill_color || getDefaultLayerStyle(layer).fill_color,
    fill_opacity: layer.fill_opacity ?? getDefaultLayerStyle(layer).fill_opacity,
    stroke_color: layer.stroke_color || layer.fill_color || getDefaultLayerStyle(layer).stroke_color,
    stroke_opacity: layer.stroke_opacity ?? getDefaultLayerStyle(layer).stroke_opacity,
    stroke_weight: layer.stroke_weight ?? getDefaultLayerStyle(layer).stroke_weight,
  });

  const save = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBase}/admin/maps/layers/${layer.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      alert(err?.detail || "Failed to update layer");
      return;
    }

    await onSaved();
    onClose();
  };

  const noBorder = form.stroke_opacity === 0 && form.stroke_weight === 0;
  const applyStylePreset = (presetKey: StylePresetKey) => {
    setStylePreset(presetKey);

    if (presetKey === "custom") {
      return;
    }

    const preset = STYLE_PRESETS[presetKey];

    setForm((prev) => ({
      ...prev,
      fill_color: preset.fill_color,
      fill_opacity: preset.fill_opacity,
      stroke_color: preset.stroke_color,
      stroke_opacity: preset.stroke_opacity,
      stroke_weight: preset.stroke_weight,
    }));
  };  

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--bc-primary)]">
            Edit Layer Style
          </h2>
          <p className="mt-1 text-sm text-slate-500">{layer.slug}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Layer name"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          className="rounded-xl border px-4 py-3"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Layer description"
          className="rounded-xl border px-4 py-3 md:col-span-2"
          rows={3}
        />

        <div className="rounded-xl border px-4 py-3">
          <div className="mb-2 text-sm font-medium">Default style</div>

          <select
            value={stylePreset}
            onChange={(e) => applyStylePreset(e.target.value as StylePresetKey)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          >
            <option value="custom">Custom</option>
            <option value="mangrove">Mangrove</option>
            <option value="seagrass">Seagrass</option>
          </select>
        </div>

        <div className="rounded-xl border px-4 py-3">
          <div className="mb-2 text-sm font-medium">Fill color</div>
            <input
              type="color"
              value={form.fill_color}
              onChange={(e) => {
                setStylePreset("custom");
                setForm({ ...form, fill_color: e.target.value });
              }}
              className="h-11 w-full rounded-xl border px-2 py-1"
            />
        </div>

        <div className="rounded-xl border px-4 py-3">
          <div className="mb-2 text-sm font-medium">Fill opacity</div>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={form.fill_opacity}
            onChange={(e) =>
              setForm({ ...form, fill_opacity: Number(e.target.value) })
            }
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={noBorder}
            onChange={(e) =>
              setForm({
                ...form,
                stroke_opacity: e.target.checked ? 0 : 0.8,
                stroke_weight: e.target.checked ? 0 : 1,
                stroke_color: form.stroke_color || form.fill_color,
              })
            }
          />
          No border / no outline
        </label>

        {!noBorder ? (
          <>
            <div className="rounded-xl border px-4 py-3">
              <div className="mb-2 text-sm font-medium">Border color</div>
              <input
                type="color"
                value={form.stroke_color}
                onChange={(e) => {
                  setStylePreset("custom");
                  setForm({ ...form, stroke_color: e.target.value });
                }}
                className="h-11 w-full rounded-xl border px-2 py-1"
              />
            </div>

            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={form.stroke_opacity}
              onChange={(e) =>
                setForm({ ...form, stroke_opacity: Number(e.target.value) })
              }
              placeholder="Border opacity"
              className="rounded-xl border px-4 py-3"
            />

            <input
              type="number"
              min={0}
              max={10}
              value={form.stroke_weight}
              onChange={(e) =>
                setForm({ ...form, stroke_weight: Number(e.target.value) })
              }
              placeholder="Border weight"
              className="rounded-xl border px-4 py-3"
            />
          </>
        ) : null}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Save Layer Style
        </button>
      </div>
    </div>
  );
}