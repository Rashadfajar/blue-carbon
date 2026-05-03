"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import CtaRows from "@/components/admin/home/CtaRows";
import SlugListEditor from "@/components/admin/home/SlugListEditor";
import type { HomeConfigFormData } from "@/types/admin";

interface Props {
  initialData: HomeConfigFormData;
}

export default function HomeConfigForm({ initialData }: Props) {
  const [form, setForm] = useState<HomeConfigFormData>(initialData);

  const handleSave = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(`${apiBase}/admin/home`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Failed to save home config");
      return;
    }

    alert("Home config saved successfully");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Home Config"
        description="Manage homepage hero, quick links, and featured content."
      />

      <FormSection title="Hero">
        <div className="grid gap-4">
          <input
            value={form.hero.badge}
            onChange={(e) =>
              setForm({
                ...form,
                hero: { ...form.hero, badge: e.target.value },
              })
            }
            placeholder="Hero badge"
            className="rounded-xl border px-4 py-3"
          />
          <input
            value={form.hero.title}
            onChange={(e) =>
              setForm({
                ...form,
                hero: { ...form.hero, title: e.target.value },
              })
            }
            placeholder="Hero title"
            className="rounded-xl border px-4 py-3"
          />
          <textarea
            value={form.hero.subtitle}
            onChange={(e) =>
              setForm({
                ...form,
                hero: { ...form.hero, subtitle: e.target.value },
              })
            }
            placeholder="Hero subtitle"
            className="rounded-xl border px-4 py-3"
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
            className="rounded-xl border px-4 py-3"
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
            className="rounded-xl border px-4 py-3"
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
            className="rounded-xl border px-4 py-3"
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
            className="rounded-xl border px-4 py-3"
          />
        </div>
      </FormSection>

      <FormSection title="Quick Links">
        <CtaRows
          value={form.quick_links}
          onChange={(items) => setForm({ ...form, quick_links: items })}
          addLabel="Add Quick Link"
        />
      </FormSection>

      <FormSection title="Featured Intervention Slugs">
        <SlugListEditor
          title="Featured Intervention Slugs"
          placeholder="intervention-slug"
          value={form.featured_intervention_slugs}
          onChange={(items) =>
            setForm({ ...form, featured_intervention_slugs: items })
          }
        />
      </FormSection>

      <FormSection title="Featured Resource Slugs">
        <SlugListEditor
          title="Featured Resource Slugs"
          placeholder="resource-slug"
          value={form.featured_resource_slugs}
          onChange={(items) =>
            setForm({ ...form, featured_resource_slugs: items })
          }
        />
      </FormSection>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Save Home Config
        </button>
      </div>
    </div>
  );
}