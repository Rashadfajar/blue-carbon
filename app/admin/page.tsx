import { apiFetch } from "@/lib/api";
import AdminDashboardPage from "@/components/admin/AdminDashboardPage";
import type {
  InterventionListResponse,
  MapLayerListResponse,
  ResourceListResponse,
  SiteListResponse,
} from "@/types/api";

export default async function Page() {
  const [sites, interventions, resources, layers] = await Promise.all([
    apiFetch<SiteListResponse>("/sites"),
    apiFetch<InterventionListResponse>("/interventions"),
    apiFetch<ResourceListResponse>("/resources"),
    apiFetch<MapLayerListResponse>("/map/layers"),
  ]);

  return (
    <AdminDashboardPage
      stats={{
        sites: sites.items.length,
        interventions: interventions.items.length,
        resources: resources.items.length,
        layers: layers.items.length,
      }}
    />
  );
}