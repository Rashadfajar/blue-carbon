"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import Shell from "@/components/layout/Shell";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import ResourceFileUpload from "@/components/admin/resources/ResourceFileUpload";
import type { ResourceItem } from "@/types/api";
import type { ResourceFormData } from "@/types/admin";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { ClassificationOptions } from "@/types/admin";
interface Props {
  mode: "create" | "edit";
  initialData?: ResourceItem;
}

export default function ResourceEditorForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [options, setOptions] = useState<ClassificationOptions | null>(null);

  const [form, setForm] = useState<ResourceFormData>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    category: initialData?.category || "",
    file_url: initialData?.file_url || "",
    external_url: initialData?.external_url || "",
    published_date: initialData?.published_date || "",
  });

  const handleSubmit = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url =
      mode === "create"
        ? `${apiBase}/admin/resources`
        : `${apiBase}/admin/resources/${initialData?.slug}`;

    const method = mode === "create" ? "POST" : "PUT";

    const payload = {
      ...form,
      published_date: form.published_date || null,
      file_url: form.file_url || null,
      external_url: form.external_url || null,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to save resource");
      return;
    }

    router.push("/admin/resources");
    router.refresh();
  };

  useEffect(() => {
    apiFetch<ClassificationOptions>("/admin/options/classifications")
      .then(setOptions)
      .catch(() => setOptions(null));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Create Resource" : "Edit Resource"}
        description="Manage knowledge files and document metadata."
        backHref="/admin/resources"
        backLabel="Back to Resource Manager"
      />

      <div className="space-y-6">
        <FormSection title="Basic Information">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Slug"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="rounded-xl border px-4 py-3"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl border px-4 py-3"
            >
              <option value="">Select category</option>
              {(options?.resource_categories || []).map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.published_date}
              onChange={(e) =>
                setForm({ ...form, published_date: e.target.value })
              }
              className="rounded-xl border px-4 py-3"
            />
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Summary"
              className="rounded-xl border px-4 py-3 md:col-span-2"
              rows={5}
            />
          </div>
        </FormSection>

        <FormSection title="Uploaded File">
          <ResourceFileUpload
            resourceSlug={form.slug || "draft-resource"}
            value={form.file_url}
            onUploaded={(fileUrl) => setForm({ ...form, file_url: fileUrl })}
          />
        </FormSection>

        <FormSection title="External Link">
          <input
            value={form.external_url}
            onChange={(e) => setForm({ ...form, external_url: e.target.value })}
            placeholder="External URL"
            className="w-full rounded-xl border px-4 py-3"
          />
        </FormSection>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save Resource
          </button>
        </div>
      </div>
    </div>
  );
}