import { apiFetch } from "@/lib/api";
import GisManagerPage from "@/components/admin/maps/GisManagerPage";
import type { MapLayerListResponse } from "@/types/api";

export default async function Page() {
  const data = await apiFetch<MapLayerListResponse>("/map/layers");
  return <GisManagerPage initialLayers={data.items} />;
}