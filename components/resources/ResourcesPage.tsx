import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import type { ResourceListResponse } from "@/types/api";

export default function ResourcesPage({ data }: { data: ResourceListResponse }) {
  return (
    <Shell>
      <div className="mb-6">
        <div className="bc-kicker">Resources</div>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--bc-primary)]">
          Resource Library
        </h1>
        <p className="mt-2 text-sm text-[var(--bc-muted)]">
          Reports, manuals, policy briefs, and supporting documents.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item) => (
          <Link key={item.slug} href={`/resources/${item.slug}`} className="block">
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
              <SectionTitle title={item.title} subtitle={item.category} />
              <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
              {/* <div className="mt-4 text-xs font-medium text-[var(--bc-accent)]">
                Open resource →
              </div> */}
            </Card>
          </Link>
        ))}
      </div>
    </Shell>
  );
}