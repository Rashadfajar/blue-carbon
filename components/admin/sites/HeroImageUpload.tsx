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
  const base = process.env.NEXT_PUBLIC_API_ROOT || "http://127.0.0.1:8000";

  const imageSrc = value?.startsWith("http")
    ? value
    : `${base}${value}`;

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("site_slug", siteSlug || "draft-site");

      const response = await fetch(`${apiBase}/admin/uploads/site-hero`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to upload image");
      }

      const result = await response.json();
      onUploaded(result.file_url);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative z-0 space-y-3">
      <input
        value={value}
        readOnly
        placeholder="Uploaded hero image URL will appear here"
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2"
      />

      {uploading ? <div className="text-xs text-slate-500">Uploading image...</div> : null}

      {value ? (
        <Image
        src={imageSrc}
        alt="Hero preview"
        className="max-h-56 rounded-2xl border object-cover"
        fill
        unoptimized
        />
      ) : null}
    </div>
  );
}