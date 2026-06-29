import Image from "next/image";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import MiniMapCard from "@/components/case-study/MiniMapCard";
import type { SiteDetailResponse } from "@/types/api";
import Link from "next/link";
import ExpandableList from "@/components/case-study/ExpandableList";

export default function CaseStudyPage({ data }: { data: SiteDetailResponse }) {
  const mediaBase = (
    process.env.NEXT_PUBLIC_API_ROOT || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

  const heroImageSrc = data.hero_image_url
    ? data.hero_image_url.startsWith("http")
      ? data.hero_image_url
      : `${mediaBase}${
          data.hero_image_url.startsWith("/")
            ? data.hero_image_url
            : `/${data.hero_image_url}`
        }`
    : "";

  return (
    <Shell>
      <div className="mb-6">
        <div className="bc-kicker">Case Study / {data.title}</div>  
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--bcprimary)] md:text-4xl">{data.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--bc-muted)]">{data.summary}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card className="bc-card-strong p-4">
            <div className="relative aspect-[6/3] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              {heroImageSrc ? (
                <Image
                  src={heroImageSrc}
                  alt={data.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  priority
                  unoptimized
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
                <div key={risk.title} className="rounded-2xl border border-[var(--bcborder)] bg-[rgba(17,138,138,0.05)] p-4 text-sm">
                  <div className="font-medium">{risk.title}</div>
                  <div className="mt-2 text-slate-500">{risk.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <ExpandableList items={data.sections.intervention_pathways} />
            {/* <div className="space-y-3">
              {data.sections.intervention_pathways.map((path) => (
                <div
                  key={path}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                >
                  <span>{path}</span>
                  <span className="text-slate-400">→</span>
                </div>
              ))}
            </div> */}
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <ExpandableList items={data.sections.mrv_readiness} />
              {/* <div className="space-y-3 text-sm text-slate-600">
                {data.sections.mrv_readiness.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    {item}
                  </div>
                ))}
              </div> */}
            </Card>

            <Card>
              <ExpandableList items={data.sections.governance_financing} />
              {/* <div className="space-y-3 text-sm text-slate-600">
                {data.sections.governance_financing.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-4">
                    {item}
                  </div>
                ))}
              </div> */}
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
                  className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-[var(--bc-border)] bg-white px-4 py-3 text-sm"
                >
                  <span className="min-w-0 text-slate-500">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <MiniMapCard data={data} />

          <Card>
            <SectionTitle title="Downloads and links" />
            <div className="space-y-3 text-sm">
              {data.sections.downloads_and_links?.length ? (
                data.sections.downloads_and_links.map((item) => {
                  const isExternal = item.href.startsWith("http");

                  return (
                    <a
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
                    >
                      <div className="font-medium text-[var(--bc-primary)]">
                        {item.label} →
                      </div>
                      {item.description ? (
                        <div className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </div>
                      ) : null}
                    </a>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-500">
                  No downloads or links configured for this site.
                </div>
              )}
              <Link
                href="/interventions"
                className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
              >
                Related interventions →
              </Link>

              <Link
                href={`/map?site=${data.slug}`}
                className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
              >
                Open in map →
              </Link>

              <Link
                href="/resources"
                className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
              >
                Resource library →
              </Link>
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