"use client";

import { useState } from "react";

interface Props {
  resourceSlug: string;
  value: string;
  onUploaded: (fileUrl: string) => void;
}

export default function ResourceFileUpload({
  resourceSlug,
  value,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("resource_slug", resourceSlug || "draft-resource");

      const response = await fetch(`${apiBase}/admin/uploads/resource-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to upload resource file");
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
    <div className="space-y-3">
      <input
        value={value}
        readOnly
        placeholder="Uploaded file URL will appear here"
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="block w-full rounded-xl border bg-white px-3 py-2"
      />

      {uploading ? (
        <div className="text-xs text-slate-500">Uploading file...</div>
      ) : null}
    </div>
  );
}