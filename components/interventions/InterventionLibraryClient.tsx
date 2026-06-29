"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import SmallTag from "@/components/ui/SmallTag";
import { apiFetch } from "@/lib/api";
import type {
  InterventionFilterMetaResponse,
  InterventionListResponse,
} from "@/types/api";
import Link from "next/link";

interface Props {
  initialData: InterventionListResponse;
  meta: InterventionFilterMetaResponse;
}

export default function InterventionLibraryClient({ initialData, meta }: Props) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [ecosystem, setEcosystem] = useState("");
  const [type, setType] = useState("");
  const [objective, setObjective] = useState("");
  const [projectStage, setProjectStage] = useState("");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (ecosystem) params.set("ecosystem", ecosystem);
      if (type) params.set("type", type);
      if (objective) params.set("objective", objective);
      if (projectStage) params.set("project_stage", projectStage);

      const result = await apiFetch<InterventionListResponse>(
        `/interventions${params.toString() ? `?${params.toString()}` : ""}`
      );
      setData(result);
    };

    run();
  }, [search, ecosystem, type, objective, projectStage]);

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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700"
            />

            <select value={ecosystem} onChange={(e) => setEcosystem(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <option value="">Ecosystem</option>
              {meta.ecosystems.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <option value="">Type</option>
              {meta.types.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <option value="">Objective</option>
              {meta.objectives.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={projectStage} onChange={(e) => setProjectStage(e.target.value)} className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm">
              <option value="">Project Stage</option>
              {meta.project_stages.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-3">
          <SectionTitle title="Filters" />
          <div className="space-y-2 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-3">Search: {search || "-"}</div>
            <div className="rounded-2xl bg-slate-50 p-3">Ecosystem: {ecosystem || "-"}</div>
            <div className="rounded-2xl bg-slate-50 p-3">Type: {type || "-"}</div>
            <div className="rounded-2xl bg-slate-50 p-3">Objective: {objective || "-"}</div>
            <div className="rounded-2xl bg-slate-50 p-3">Project stage: {projectStage || "-"}</div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-9">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((item) => (
              <Link key={item.slug} href={`/interventions/${item.slug}`} className="block">
                <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="text-base font-semibold">{item.title}</div>
                  <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <SmallTag key={tag}>{tag}</SmallTag>
                    ))}
                  </div>
                  {/* <div className="mt-4 text-xs font-medium text-[var(--bc-accent)]">
                    Open intervention →
                  </div> */}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}