"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { GisUploadResult, OptionItem, OptionListResponse} from "@/types/admin";

interface Props {
  onUploaded: (result: GisUploadResult) => void;
}
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.(zip|geojson)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeSpatialExtension(value: string) {
  return value.replace(/\.(zip|geojson)$/i, "");
}

export default function GisUploadForm({ onUploaded }: Props) {
  const [siteSlug, setSiteSlug] = useState("");
  const [layerName, setLayerName] = useState("");
  const [layerSlug, setLayerSlug] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sites, setSites] = useState<OptionItem[]>([]);

  const apiBase = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api"
    ).replace(/\/$/, "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiFetch<OptionListResponse>("/admin/options/sites")
      .then((res) => {
        if (!cancelled) {
          setSites(res.items || []);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch site options:", error);

        if (!cancelled) {
          setSites([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const fileBaseName = removeSpatialExtension(file.name);
      const finalLayerName = layerName.trim() || fileBaseName;
      const finalLayerSlug = layerSlug.trim() || slugify(file.name);

      if (!finalLayerName) {
        throw new Error("Layer name is required.");
      }

      if (!finalLayerSlug) {
        throw new Error("Layer slug is required.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("layer_name", finalLayerName);
      formData.append("layer_slug", finalLayerSlug);
      formData.append("category", "admin-uploaded");

      if (siteSlug) {
        formData.append("site_slug", siteSlug);
      }

      const url = siteSlug
        ? `${apiBase}/admin/sites/${siteSlug}/upload-gis`
        : `${apiBase}/map/upload-shapefile`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Failed to upload GIS file");
      }

      const result: GisUploadResult = await response.json();

      onUploaded(result);

      setLayerName("");
      setLayerSlug("");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <select
          value={siteSlug}
          onChange={(e) => setSiteSlug(e.target.value)}
          disabled={uploading}
          className="rounded-xl border px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Global / not linked to site</option>

          {sites.map((site) => (
            <option key={site.value} value={site.value}>
              {site.label}
            </option>
          ))}
        </select>

        <input
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          disabled={uploading}
          placeholder="Layer name"
          className="rounded-xl border px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />

        <input
          value={layerSlug}
          onChange={(e) => setLayerSlug(slugify(e.target.value))}
          disabled={uploading}
          placeholder="Layer slug"
          className="rounded-xl border px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <input
        type="file"
        accept=".zip,.geojson,application/zip,application/x-zip-compressed,application/geo+json"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleUpload(file);
          }

          e.currentTarget.value = "";
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      />

      {uploading ? (
        <div className="text-xs text-slate-500">Uploading GIS file...</div>
      ) : null}
    </div>
  );
}