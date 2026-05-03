import { apiFetch } from "@/lib/api";
import ResourcesPage from "@/components/resources/ResourcesPage";
import type { ResourceListResponse } from "@/types/api";

export default async function Page() {
  const data = await apiFetch<ResourceListResponse>("/resources");
  return <ResourcesPage data={data} />;
}