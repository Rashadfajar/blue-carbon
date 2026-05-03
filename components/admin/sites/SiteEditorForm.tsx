"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import QuickStatsFieldArray from "@/components/admin/sites/QuickStatsFieldArray";
import RiskFieldArray from "@/components/admin/sites/RiskFieldArray";
import MiniMapFields from "@/components/admin/sites/MiniMapFields";
import HeroImageUpload from "@/components/admin/sites/HeroImageUpload";
import SiteGisUpload from "@/components/admin/sites/SiteGisUpload";
import TextBlockRows from "@/components/admin/shared/TextBlockRows";
import LinkRows from "@/components/admin/shared/LinkRows";

import type { SiteDetailResponse } from "@/types/api";
import type { SiteFormData } from "@/types/admin";

interface Props {
  mode: "create" | "edit";
  initialData?: SiteDetailResponse;
}

const emptyTextBlock = [{ title: "", description: "" }];

function getInitialForm(initialData?: SiteDetailResponse): SiteFormData {
  const sections = initialData?.sections;

  const miniMap = initialData?.mini_map as
    | {
        latitude?: number;
        longitude?: number;
        lat?: number;
        lon?: number;
        zoom?: number;
      }
    | undefined;

  return {
    slug: initialData?.slug ?? "",
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    summary: initialData?.summary ?? "",
    hero_image_url: initialData?.hero_image_url ?? "",

    quick_stats:
      initialData?.quick_stats && initialData.quick_stats.length > 0
        ? initialData.quick_stats
        : [{ label: "", value: "" }],

    sections: {
      site_overview: sections?.site_overview ?? "",

      pressures_and_risks:
        sections?.pressures_and_risks && sections.pressures_and_risks.length > 0
          ? sections.pressures_and_risks
          : emptyTextBlock,

      intervention_pathways:
        sections?.intervention_pathways &&
        sections.intervention_pathways.length > 0
          ? sections.intervention_pathways
          : emptyTextBlock,

      mrv_readiness:
        sections?.mrv_readiness && sections.mrv_readiness.length > 0
          ? sections.mrv_readiness
          : emptyTextBlock,

      governance_financing:
        sections?.governance_financing &&
        sections.governance_financing.length > 0
          ? sections.governance_financing
          : emptyTextBlock,
      downloads_and_links:
      initialData?.sections.downloads_and_links || [
        { label: "", href: "", description: "" },
      ],
    },

    mini_map: {
      latitude: miniMap?.latitude ?? miniMap?.lat ?? 0,
      longitude: miniMap?.longitude ?? miniMap?.lon ?? 0,
      zoom: miniMap?.zoom ?? 8,
    },
  };
}

export default function SiteEditorForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<SiteFormData>(() =>
    getInitialForm(initialData)
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBase) {
      alert("NEXT_PUBLIC_API_BASE_URL belum diatur di file .env");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug wajib diisi.");
      return;
    }

    if (!form.title.trim()) {
      alert("Title wajib diisi.");
      return;
    }

    try {
      setIsSaving(true);

      const url =
        mode === "create"
          ? `${apiBase}/admin/sites`
          : `${apiBase}/admin/sites/${initialData?.slug ?? form.slug}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = "Failed to save site";

        try {
          const err = await res.json();
          message =
            typeof err.detail === "string"
              ? err.detail
              : JSON.stringify(err.detail ?? err);
        } catch {
          message = await res.text();
        }

        alert(message || "Failed to save site");
        return;
      }

      router.push("/admin/sites");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan site.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
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
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
              placeholder="Slug"
              className="rounded-xl border px-4 py-3"
              disabled={mode === "edit"}
            />

            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.subtitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  subtitle: e.target.value,
                })
              }
              placeholder="Subtitle"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />

            <textarea
              value={form.summary}
              onChange={(e) =>
                setForm({
                  ...form,
                  summary: e.target.value,
                })
              }
              placeholder="Summary"
              className="rounded-xl border px-4 py-3 md:col-span-2"
              rows={4}
            />
          </div>
        </FormSection>

        <FormSection title="Hero Image Upload">
          <HeroImageUpload
            siteSlug={form.slug || "draft-site"}
            value={form.hero_image_url}
            onUploaded={(fileUrl) =>
              setForm({
                ...form,
                hero_image_url: fileUrl,
              })
            }
          />
        </FormSection>

        {mode === "edit" && form.slug ? (
          <FormSection title="Site GIS Upload">
            <SiteGisUpload siteSlug={form.slug} />
          </FormSection>
        ) : null}

        <FormSection title="Quick Stats">
          <QuickStatsFieldArray
            value={form.quick_stats}
            onChange={(items) =>
              setForm({
                ...form,
                quick_stats: items,
              })
            }
          />
        </FormSection>

        <FormSection title="Site Overview">
          <textarea
            value={form.sections.site_overview}
            onChange={(e) =>
              setForm({
                ...form,
                sections: {
                  ...form.sections,
                  site_overview: e.target.value,
                },
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
                sections: {
                  ...form.sections,
                  pressures_and_risks: items,
                },
              })
            }
          />
        </FormSection>

        <FormSection title="Intervention Pathways">
          <TextBlockRows
            value={form.sections.intervention_pathways}
            onChange={(items) =>
              setForm({
                ...form,
                sections: {
                  ...form.sections,
                  intervention_pathways: items,
                },
              })
            }
          />
        </FormSection>

        <FormSection title="MRV Readiness">
          <TextBlockRows
            value={form.sections.mrv_readiness}
            onChange={(items) =>
              setForm({
                ...form,
                sections: {
                  ...form.sections,
                  mrv_readiness: items,
                },
              })
            }
          />
        </FormSection>

        <FormSection title="Governance and Financing">
          <TextBlockRows
            value={form.sections.governance_financing}
            onChange={(items) =>
              setForm({
                ...form,
                sections: {
                  ...form.sections,
                  governance_financing: items,
                },
              })
            }
          />
        </FormSection>

        <FormSection title="Downloads and Links">
          <LinkRows
            value={form.sections.downloads_and_links}
            onChange={(items) =>
              setForm({
                ...form,
                sections: { ...form.sections, downloads_and_links: items },
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
            disabled={isSaving}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Site"}
          </button>
        </div>
      </div>
    </div>
  );
}