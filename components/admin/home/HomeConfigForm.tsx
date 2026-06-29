"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import CtaRows from "@/components/admin/home/CtaRows";
import OptionSlugRows from "@/components/admin/home/OptionSlugRows";
import KeyValueRows from "@/components/admin/shared/KeyValueRows";
import { apiFetch } from "@/lib/api";
import type {
  HomeConfigFormData,
  OptionItem,
  OptionListResponse,
} from "@/types/admin";

interface Props {
  initialData: HomeConfigFormData;
}

function normalizeHomeConfig(data: HomeConfigFormData): HomeConfigFormData {
  return {
    hero: {
      badge: data.hero?.badge || "",
      title: data.hero?.title || "",
      subtitle: data.hero?.subtitle || "",
      primary_cta: {
        label: data.hero?.primary_cta?.label || "",
        href: data.hero?.primary_cta?.href || "",
      },
      secondary_cta: {
        label: data.hero?.secondary_cta?.label || "",
        href: data.hero?.secondary_cta?.href || "",
      },
    },
    quick_links: data.quick_links || [],
    stats: data.stats || [],
    featured_intervention_slugs: data.featured_intervention_slugs || [],
    featured_resource_slugs: data.featured_resource_slugs || [],
  };
}

export default function HomeConfigForm({ initialData }: Props) {
  const [form, setForm] = useState<HomeConfigFormData>(() =>
    normalizeHomeConfig(initialData)
  );

  const [interventionOptions, setInterventionOptions] = useState<OptionItem[]>(
    []
  );
  const [resourceOptions, setResourceOptions] = useState<OptionItem[]>([]);
  const [saving, setSaving] = useState(false);

  const apiBase = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api"
    ).replace(/\/$/, "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiFetch<OptionListResponse>("/admin/options/interventions")
      .then((res) => {
        if (!cancelled) {
          setInterventionOptions(res.items || []);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch intervention options:", error);

        if (!cancelled) {
          setInterventionOptions([]);
        }
      });

    apiFetch<OptionListResponse>("/admin/options/resources")
      .then((res) => {
        if (!cancelled) {
          setResourceOptions(res.items || []);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch resource options:", error);

        if (!cancelled) {
          setResourceOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch(`${apiBase}/admin/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Failed to save home config");
      }

      alert("Home config saved successfully");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save home config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Home Config"
        description="Manage homepage hero, quick links, stats, and featured content."
      />

      <FormSection title="Hero">
        <div className="grid gap-4">
          <input
            value={form.hero.badge}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  badge: e.target.value,
                },
              })
            }
            placeholder="Hero badge"
            className="rounded-xl border px-4 py-3 text-sm"
          />

          <input
            value={form.hero.title}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  title: e.target.value,
                },
              })
            }
            placeholder="Hero title"
            className="rounded-xl border px-4 py-3 text-sm"
          />

          <textarea
            value={form.hero.subtitle}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  subtitle: e.target.value,
                },
              })
            }
            placeholder="Hero subtitle"
            className="rounded-xl border px-4 py-3 text-sm"
            rows={4}
          />
        </div>
      </FormSection>

      <FormSection title="Primary and Secondary CTA">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.hero.primary_cta.label}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  primary_cta: {
                    ...form.hero.primary_cta,
                    label: e.target.value,
                  },
                },
              })
            }
            placeholder="Primary CTA label"
            className="rounded-xl border px-4 py-3 text-sm"
          />

          <input
            value={form.hero.primary_cta.href}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  primary_cta: {
                    ...form.hero.primary_cta,
                    href: e.target.value,
                  },
                },
              })
            }
            placeholder="Primary CTA href"
            className="rounded-xl border px-4 py-3 text-sm"
          />

          <input
            value={form.hero.secondary_cta.label}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  secondary_cta: {
                    ...form.hero.secondary_cta,
                    label: e.target.value,
                  },
                },
              })
            }
            placeholder="Secondary CTA label"
            className="rounded-xl border px-4 py-3 text-sm"
          />

          <input
            value={form.hero.secondary_cta.href}
            onChange={(e) =>
              setForm({
                ...form,
                hero: {
                  ...form.hero,
                  secondary_cta: {
                    ...form.hero.secondary_cta,
                    href: e.target.value,
                  },
                },
              })
            }
            placeholder="Secondary CTA href"
            className="rounded-xl border px-4 py-3 text-sm"
          />
        </div>
      </FormSection>

      <FormSection title="Quick Links">
        <CtaRows
          value={form.quick_links || []}
          onChange={(items) =>
            setForm({
              ...form,
              quick_links: items,
            })
          }
          addLabel="Add Quick Link"
        />
      </FormSection>

      <FormSection title="Homepage Stats">
        <KeyValueRows
          value={form.stats || []}
          onChange={(items) =>
            setForm({
              ...form,
              stats: items,
            })
          }
          addLabel="Add Stat"
          keyPlaceholder="Stat label"
          valuePlaceholder="Stat value"
        />
      </FormSection>

      <FormSection title="Featured Content">
        <div className="space-y-6">
          <OptionSlugRows
            title="Featured Interventions"
            value={form.featured_intervention_slugs || []}
            options={interventionOptions}
            onChange={(items) =>
              setForm({
                ...form,
                featured_intervention_slugs: items,
              })
            }
          />

          <OptionSlugRows
            title="Featured Resources"
            value={form.featured_resource_slugs || []}
            options={resourceOptions}
            onChange={(items) =>
              setForm({
                ...form,
                featured_resource_slugs: items,
              })
            }
          />
        </div>
      </FormSection>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Home Config"}
        </button>
      </div>
    </div>
  );
}