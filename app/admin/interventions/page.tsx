import { apiFetch } from "@/lib/api";
import type { InterventionListResponse } from "@/types/api";
import InterventionListPage from "@/components/admin/interventions/InterventionListPage";

export default async function Page() {
  const data = await apiFetch<InterventionListResponse>("/interventions");
  return <InterventionListPage data={data} />;
}