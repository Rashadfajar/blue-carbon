import Image from "next/image";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import SmallTag from "@/components/ui/SmallTag";
import Link from "next/link";
import type { HomeResponse } from "@/types/api";

export default function HomePage({ data }: { data: HomeResponse }) {
  const safeQuickLinks = data.quick_links.filter((item) =>
    ["/", "/interventions", "/map"].includes(item.href)
  );

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-9 p-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {data.hero.badge}
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {data.hero.title}
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                {data.hero.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={data.hero.primary_cta.href}
                  className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow"
                >
                  {data.hero.primary_cta.label}
                </Link>
                <Link
                  href={data.hero.secondary_cta.href}
                  className="rounded-2xl border px-4 py-2.5 text-sm font-medium text-slate-700"
                >
                  {data.hero.secondary_cta.label}
                </Link>
              </div>
            </div>

            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
                <Image
                  src="/images/indonesia-map.jpg"
                  alt="Blue Carbon Indonesia"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle title="Quick access" subtitle="Primary routes for the first release" />
          <div className="space-y-3">
            {safeQuickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span>{item.label}</span>
                <span className="text-slate-400">→</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((item) => (
          <Card key={item.label} className="p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">{item.label}</div>
            <div className="mt-2 text-lg font-semibold">{item.value}</div>
          </Card>
        ))}
      </div>

      {/* <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <SectionTitle title="Why this portal matters" />
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Learn blue carbon in a structured, practical way.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Explore landscapes, interventions, and ecosystem pressures.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Move toward feasibility study and project readiness.</div>
          </div>
        </Card>

        <Card className="lg:col-span-8">
          <SectionTitle
            title="Policy → baseline → intervention → MRV → finance → implementation"
            subtitle="Core workflow carried from the COAST logic into portal navigation"
          />
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {["Policy", "Baseline", "Intervention", "MRV", "Finance", "Implementation"].map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm font-medium text-slate-700"
              >
                {step}
              </div>
            ))}
          </div>
        </Card>
      </div> */}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <SectionTitle title="Featured interventions" subtitle="Prototype card pattern for the intervention library" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.featured_interventions.map((item) => (
              <div key={item.slug} className="rounded-3xl border bg-slate-50 p-4">
                <div className="text-base font-semibold">{item.title}</div>
                <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <SmallTag key={tag}>{tag}</SmallTag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <SectionTitle title="Latest resources" subtitle="Document cards for reports and manuals" />
          <div className="space-y-3">
            {data.latest_resources.map((res) => (
              <div key={res.slug} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-sm font-medium">{res.title}</div>
                <div className="mt-1 text-xs text-slate-500">{res.summary}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}