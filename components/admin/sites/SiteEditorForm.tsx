"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/layout/Shell";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import QuickStatsFieldArray from "@/components/admin/sites/QuickStatsFieldArray";
import RiskFieldArray from "@/components/admin/sites/RiskFieldArray";
import StringListFieldArray from "@/components/admin/sites/StringListFieldArray";
import MiniMapFields from "@/components/admin/sites/MiniMapFields";
import HeroImageUpload from "@/components/admin/sites/HeroImageUpload";
import SiteGisUpload from "@/components/admin/sites/SiteGisUpload";
import type { SiteDetailResponse } from "@/types/api";
import type { SiteFormData } from "@/types/admin";

interface Props {
  mode: "create" | "edit";
  initialData?: SiteDetailResponse;
}

export default function SiteEditorForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<SiteFormData>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    summary: initialData?.summary || "",
    hero_image_url: initialData?.hero_image_url || "",
    quick_stats: initialData?.quick_stats || [{ label: "", value: "" }],
    sections: {
      site_overview: initialData?.sections.site_overview || "",
      pressures_and_risks:
        initialData?.sections.pressures_and_risks || [
          { title: "", description: "" },
        ],
      intervention_pathways:
        initialData?.sections.intervention_pathways || [""],
      mrv_readiness: initialData?.sections.mrv_readiness || [""],
      governance_financing:
        initialData?.sections.governance_financing || [""],
    },
    mini_map: initialData?.mini_map || {
      latitude: 0,
      longitude: 0,
      zoom: 8,
    },
  });

  const handleSubmit = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url =
      mode === "create"
        ? `${apiBase}/admin/sites`
        : `${apiBase}/admin/sites/${initialData?.slug}`;

    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to save site");
      return;
    }

    router.push("/admin/sites");
    router.refresh();
  };

  return (
    <Shell>
      <AdminPageHeader
        title={mode === "create" ? "Create Site" : "Edit Site"}
        description="Manage case-study and study-area content."
        backHref="/admin/sites"
        backLabel="Back to Site Manager"
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
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Subtitle"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Summary"
              className="rounded-xl border px-4 py-3 md:col-span-2"
              rows={4}
            />
            {/* <input
              value={form.hero_image_url}
              onChange={(e) =>
                setForm({ ...form, hero_image_url: e.target.value })
              }
              placeholder="Hero image URL"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            /> */}
          </div>
        </FormSection>

          <FormSection title="Hero Image Upload">
          <HeroImageUpload
            siteSlug={form.slug || "draft-site"}
            value={form.hero_image_url}
            onUploaded={(fileUrl) => setForm({ ...form, hero_image_url: fileUrl })}
          />
        </FormSection>

        {mode === "edit" && form.slug ? (
          <FormSection title="Site GIS Upload" >
            <SiteGisUpload siteSlug={form.slug} />
          </FormSection>
        ) : null}

        <FormSection title="Quick Stats">
          <QuickStatsFieldArray
            value={form.quick_stats}
            onChange={(items) => setForm({ ...form, quick_stats: items })}
          />
        </FormSection>

        <FormSection title="Site Overview">
          <textarea
            value={form.sections.site_overview}
            onChange={(e) =>
              setForm({
                ...form,
                sections: { ...form.sections, site_overview: e.target.value },
              })
            }
            className="w-full rounded-xl border px-4 py-3"
            rows={6}
          />
        </FormSection>

        <FormSection title="Pressures and Risks">
          <RiskFieldArray
            value={form.sections.pressures_and_risks}
            onChange={(items) =>
              setForm({
                ...form,
                sections: { ...form.sections, pressures_and_risks: items },
              })
            }
          />
        </FormSection>

        <FormSection title="Intervention Pathways">
          <StringListFieldArray
            title="Intervention Pathways"
            placeholder="Intervention pathway"
            value={form.sections.intervention_pathways}
            onChange={(items) =>
              setForm({
                ...form,
                sections: { ...form.sections, intervention_pathways: items },
              })
            }
          />
        </FormSection>

        <FormSection title="MRV Readiness">
          <StringListFieldArray
            title="MRV Readiness"
            placeholder="MRV readiness item"
            value={form.sections.mrv_readiness}
            onChange={(items) =>
              setForm({
                ...form,
                sections: { ...form.sections, mrv_readiness: items },
              })
            }
          />
        </FormSection>

        <FormSection title="Governance and Financing">
          <StringListFieldArray
            title="Governance and Financing"
            placeholder="Governance/financing item"
            value={form.sections.governance_financing}
            onChange={(items) =>
              setForm({
                ...form,
                sections: { ...form.sections, governance_financing: items },
              })
            }
          />
        </FormSection>

        <FormSection title="Mini Map">
          <MiniMapFields
            value={form.mini_map}
            onChange={(value) => setForm({ ...form, mini_map: value })}
          />
        </FormSection>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save Site
          </button>
        </div>
      </div>
    </Shell>
  );
}