"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  siteSlug: string;
  value: string;
  onUploaded: (fileUrl: string) => void;
}

export default function HeroImageUpload({ siteSlug, value, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  
  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api"
  ).replace(/\/$/, "");

  const mediaBase = (
    process.env.NEXT_PUBLIC_API_ROOT || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  const imageSrc = value
    ? value.startsWith("http")
      ? value
      : `${mediaBase}${value.startsWith("/") ? value : `/${value}`}`
    : "";

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("site_slug", siteSlug || "draft-site");

      const response = await fetch(`${apiBase}/admin/uploads/site-hero`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || "Failed to upload image");
      }

      const result = await response.json();

      // Biasanya backend return:
      // { file_url: "/media/site-heroes/xxx.jpg" }
      onUploaded(result.file_url);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        value={value}
        readOnly
        placeholder="Uploaded hero image URL will appear here"
        className="w-full rounded-xl border px-4 py-3 text-sm"
      />

      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      />

      {uploading ? (
        <div className="text-xs text-slate-500">Uploading image...</div>
      ) : null}

      {value && imageSrc ? (
        <div className="relative aspect-[6/3] w-full overflow-hidden rounded-2xl border bg-slate-100">
          <Image
            src={imageSrc}
            alt="Hero preview"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}
    </div>
  );
}