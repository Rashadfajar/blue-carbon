import { apiFetch } from "@/lib/api";
import type { SiteListResponse } from "@/types/api";
import SiteListPage from "@/components/admin/sites/SiteListPage";

export default async function Page() {
  const data = await apiFetch<SiteListResponse>("/sites");
  return <SiteListPage data={data} />;
}