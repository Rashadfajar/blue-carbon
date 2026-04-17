import { apiFetch } from "@/lib/api";
import type { InterventionListResponse } from "@/types/api";
import type { InterventionFilterMetaResponse } from "@/types/api";
import InterventionLibraryClient from "../../components/interventions/InterventionLibraryClient";

export default async function Page() {
  const [initialData, meta] = await Promise.all([
    apiFetch<InterventionListResponse>("/interventions"),
    apiFetch<InterventionFilterMetaResponse>("/meta/intervention-filters"),
  ]);

  return <InterventionLibraryClient initialData={initialData} meta={meta} />;
}