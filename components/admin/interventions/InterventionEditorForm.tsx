"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/layout/Shell";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import TagInput from "@/components/admin/interventions/TagInput";
import type { InterventionSummary } from "@/types/api";
import type { InterventionFormData } from "@/types/admin";

interface InterventionDetailLike extends InterventionSummary {
  description?: string | null;
}

interface Props {
  mode: "create" | "edit";
  initialData?: InterventionDetailLike;
}

export default function InterventionEditorForm({
  mode,
  initialData,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<InterventionFormData>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    ecosystem: initialData?.ecosystem || "",
    type: initialData?.type || "",
    objective: initialData?.objective || "",
    project_stage: initialData?.project_stage || "",
    tags: initialData?.tags || [""],
  });

  const handleSubmit = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url =
      mode === "create"
        ? `${apiBase}/admin/interventions`
        : `${apiBase}/admin/interventions/${initialData?.slug}`;

    const method = mode === "create" ? "POST" : "PUT";

    const payload = {
      ...form,
      tags: form.tags.filter((x) => x.trim() !== ""),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to save intervention");
      return;
    }

    router.push("/admin/interventions");
    router.refresh();
  };

  return (
    <div>
      <AdminPageHeader
        title={mode === "create" ? "Create Intervention" : "Edit Intervention"}
        description="Manage intervention library records."
        backHref="/admin/interventions"
        backLabel="Back to Intervention Manager"
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
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Summary"
              className="rounded-xl border px-4 py-3 md:col-span-2"
              rows={4}
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="rounded-xl border px-4 py-3 md:col-span-2"
              rows={6}
            />
          </div>
        </FormSection>

        <FormSection title="Classification">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.ecosystem}
              onChange={(e) => setForm({ ...form, ecosystem: e.target.value })}
              className="rounded-xl border px-4 py-3"
            >
              <option value="">Select ecosystem</option>
              <option value="mangrove">mangrove</option>
              <option value="seagrass">seagrass</option>
            </select>

            <input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="Type"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              placeholder="Objective"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.project_stage}
              onChange={(e) =>
                setForm({ ...form, project_stage: e.target.value })
              }
              placeholder="Project stage"
              className="rounded-xl border px-4 py-3"
            />
          </div>
        </FormSection>

        <FormSection title="Tags">
          <TagInput
            value={form.tags}
            onChange={(tags) => setForm({ ...form, tags })}
          />
        </FormSection>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save Intervention
          </button>
        </div>
      </div>
    </div>
  );
}