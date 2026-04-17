import Image from "next/image";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import MiniMapCard from "@/components/case-study/MiniMapCard";
import type { SiteDetailResponse } from "@/types/api";

export default function CaseStudyPage({ data }: { data: SiteDetailResponse }) {
  return (
    <Shell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          Case Study / {data.title}
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{data.summary}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card className="p-4">
            <div className="relative aspect-[6/3] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              {data.hero_image_url ? (
                <Image
                  src={data.hero_image_url}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  No site image available
                </div>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Site overview" />
            <p className="text-sm leading-6 text-slate-600">
              {data.sections.site_overview}
            </p>
          </Card>

          <Card>
            <SectionTitle title="Pressures and risks" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.sections.pressures_and_risks.map((risk) => (
                <div key={risk.title} className="rounded-2xl bg-slate-50 p-4 text-sm">
                  <div className="font-medium">{risk.title}</div>
                  <div className="mt-2 text-slate-500">{risk.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Intervention pathways" />
            <div className="space-y-3">
              {data.sections.intervention_pathways.map((path) => (
                <div
                  key={path}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                >
                  <span>{path}</span>
                  <span className="text-slate-400">→</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <SectionTitle title="MRV and data readiness" />
              <div className="space-y-3 text-sm text-slate-600">
                {data.sections.mrv_readiness.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle title="Governance and financing" />
              <div className="space-y-3 text-sm text-slate-600">
                {data.sections.governance_financing.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card>
            <SectionTitle title="Quick stats" />
            <div className="space-y-3">
              {data.quick_stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <MiniMapCard data={data} />

          <Card>
            <SectionTitle title="Downloads and links" />
            <div className="space-y-3 text-sm">
              {["FS summary", "Related interventions", "Open in map", "Methodology note"].map((x) => (
                <div key={x} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {x}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Review" />
            <div className="space-y-3 text-sm">
              <a
                href="https://nap.piarea.co.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-slate-200"
              >
                PIREVIEW
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}