import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import SmallTag from "@/components/ui/SmallTag";
import type { InterventionListResponse } from "@/types/api";

export default function InterventionLibraryPage({ data }: { data: InterventionListResponse }) {
  return (
    <Shell>
      <Card className="mb-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Intervention Library</h1>
            <p className="mt-1 text-sm text-slate-500">
              Filterable library for mangrove, seagrass, governance, and financing interventions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["Search", "Ecosystem", "Type", "Objective", "Project Stage"].map((f) => (
              <div key={f} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {f} ▼
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-3">
          <SectionTitle title="Filters" />
          <div className="space-y-3 text-sm text-slate-600">
            {["Mangrove", "Seagrass", "Protection", "Restoration", "Rehabilitation", "Community-based", "Governance", "Financing"].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <input type="checkbox" className="h-4 w-4 rounded" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-9">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((item) => (
              <Card key={item.slug} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{item.title}</div>
                    <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">detail</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <SmallTag key={tag}>{tag}</SmallTag>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <SectionTitle title="How interventions connect to project readiness" />
            <div className="grid gap-3 md:grid-cols-4">
              {["Baseline data", "Intervention choice", "Co-benefits", "FS/PDD link"].map((x) => (
                <div key={x} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {x}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}