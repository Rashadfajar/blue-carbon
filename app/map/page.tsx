import MapExplorerPage from "@/components/map/MapExplorerPage";
import { apiFetch } from "@/lib/api";
import type { MapLayerListResponse } from "@/types/api";

export default async function Page() {
  const layers = await apiFetch<MapLayerListResponse>("/map/layers");
  return <MapExplorerPage layers={layers.items} />;
}