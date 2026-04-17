import { apiFetch } from "@/lib/api";
import type { SiteDetailResponse } from "@/types/api";
import SiteEditorForm from "@/components/admin/sites/SiteEditorForm";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const data = await apiFetch<SiteDetailResponse>(`/sites/${slug}`);
  return <SiteEditorForm mode="edit" initialData={data} />;
}