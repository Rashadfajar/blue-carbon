import { apiFetch } from "@/lib/api";
import type { InterventionSummary } from "@/types/api";
import InterventionEditorForm from "@/components/admin/interventions/InterventionEditorForm";

interface InterventionDetailLike extends InterventionSummary {
  description?: string | null;
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;  
  const data = await apiFetch<InterventionDetailLike>(
    `/interventions/${slug}`
  );

  return <InterventionEditorForm mode="edit" initialData={data} />;
}