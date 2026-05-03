import { apiFetch } from "@/lib/api";
import InterventionDetailPage from "@/components/interventions/InterventionDetailPage";
import type { InterventionSummary } from "@/types/api";

interface InterventionDetail extends InterventionSummary {
  description?: string | null;
  suitable_conditions?: string[];
  expected_outcomes?: string[];
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const data = await apiFetch<InterventionDetail>(`/interventions/${slug}`);
  return <InterventionDetailPage data={data} />;
}