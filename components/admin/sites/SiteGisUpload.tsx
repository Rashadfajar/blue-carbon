"use client";

import { useState } from "react";

interface Props {
  siteSlug: string;
}

export default function SiteGisUpload({ siteSlug }: Props) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<null | {
    message: string;
    layer_slug: string;
    feature_count: number;
    bounds: [number, number, number, number];
  }>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const baseSlug = file.name.replace(/\.(zip|geojson)$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("layer_name", file.name.replace(/\.(zip|geojson)$/i, ""));
      formData.append("layer_slug", `${siteSlug}-${baseSlug}`);
      formData.append("category", "site-uploaded");

      const response = await fetch(`${apiBase}/admin/sites/${siteSlug}/upload-gis`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to upload GIS layer");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "GIS upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept=".zip,.geojson,application/zip,application/geo+json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2"
      />

      {uploading ? <div className="text-xs text-slate-500">Uploading GIS...</div> : null}

      {result ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-medium">{result.message}</div>
          <div className="mt-2">Layer slug: {result.layer_slug}</div>
          <div>Feature count: {result.feature_count}</div>
          <div>Bounds: {result.bounds.join(", ")}</div>
        </div>
      ) : null}
    </div>
  );
}