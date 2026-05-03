"use client";

import { useState } from "react";
import type { GisUploadResult } from "@/types/admin";

interface Props {
  onUploaded: (result: GisUploadResult) => void;
}

export default function GisUploadForm({ onUploaded }: Props) {
  const [siteSlug, setSiteSlug] = useState("");
  const [layerName, setLayerName] = useState("");
  const [layerSlug, setLayerSlug] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("layer_name", layerName || file.name.replace(/\.(zip|geojson)$/i, ""));
      formData.append(
        "layer_slug",
        layerSlug || file.name.replace(/\.(zip|geojson)$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
      );
      formData.append("category", "admin-uploaded");

      const url = siteSlug
        ? `${apiBase}/admin/sites/${siteSlug}/upload-gis`
        : `${apiBase}/map/upload-shapefile`;

      if (!siteSlug) {
        formData.append("site_slug", "");
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to upload GIS file");
      }

      const result: GisUploadResult = await response.json();
      onUploaded(result);
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
        <input
          value={siteSlug}
          onChange={(e) => setSiteSlug(e.target.value)}
          placeholder="Optional site slug"
          className="rounded-xl border px-4 py-3"
        />
        <input
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          placeholder="Layer name"
          className="rounded-xl border px-4 py-3"
        />
        <input
          value={layerSlug}
          onChange={(e) => setLayerSlug(e.target.value)}
          placeholder="Layer slug"
          className="rounded-xl border px-4 py-3"
        />
      </div>

      <input
        type="file"
        accept=".zip,.geojson,application/zip,application/geo+json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2"
      />

      {uploading ? <div className="text-xs text-slate-500">Uploading GIS file...</div> : null}
    </div>
  );
}