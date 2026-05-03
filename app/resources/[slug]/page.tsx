import { apiFetch } from "@/lib/api";
import ResourceDetailPage from "@/components/resources/ResourceDetailPage";
import type { ResourceItem } from "@/types/api";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const data = await apiFetch<ResourceItem>(`/resources/${slug}`);
  return <ResourceDetailPage data={data} />;
}