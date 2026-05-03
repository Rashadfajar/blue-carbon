import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import SmallTag from "@/components/ui/SmallTag";
import type { InterventionSummary } from "@/types/api";

interface InterventionDetail extends InterventionSummary {
  description?: string | null;
  suitable_conditions?: string[];
  expected_outcomes?: string[];
}

export default function InterventionDetailPage({ data }: { data: InterventionDetail }) {
  return (
    <Shell>
      <div className="mb-6">
        <Link href="/interventions" className="bc-kicker mt-4 text-sm text-[var(--bc-accent)]">
          ← Back to Intervention Library
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--bc-primary)] md:text-4xl">
          {data.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--bc-muted)]">
          {data.summary}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <SectionTitle title="Description" />
            <p className="text-sm leading-7 text-slate-600">
              {data.description || "No detailed description has been provided yet."}
            </p>
          </Card>

          <Card>
            <SectionTitle title="Project relevance" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="font-medium">Ecosystem</div>
                <div className="mt-1 text-slate-500">{data.ecosystem}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="font-medium">Type</div>
                <div className="mt-1 text-slate-500">{data.type}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="font-medium">Objective</div>
                <div className="mt-1 text-slate-500">{data.objective}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="font-medium">Project stage</div>
                <div className="mt-1 text-slate-500">{data.project_stage}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card>
            <SectionTitle title="Tags" />
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <SmallTag key={tag}>{tag}</SmallTag>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Next actions" />
            <div className="space-y-3 text-sm">
              <Link href="/map" className="block rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100">
                View related map layers →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}