"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";
import type {
  GeoJsonFeatureCollection,
  MapFeatureDetailResponse,
  MapLayerItem,
  UploadLayerResponse,
} from "@/types/api";

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, { ssr: false });
const GeoJSON = dynamic(async () => (await import("react-leaflet")).GeoJSON, { ssr: false });

interface Props {
  layers: MapLayerItem[];
}

export default function MapExplorerPage({ layers }: Props) {
  const searchParams = useSearchParams();
  const siteSlug = searchParams.get("site");
  const initialSelected = useMemo(
    () => layers.filter((layer) => layer.is_default_visible).map((layer) => layer.slug),
    [layers]
  );

  const [availableLayers, setAvailableLayers] = useState<MapLayerItem[]>(layers);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(initialSelected);
  const [collections, setCollections] = useState<Record<string, GeoJsonFeatureCollection>>({});
  const [siteCollection, setSiteCollection] = useState<GeoJsonFeatureCollection | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeatureDetailResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const run = async () => {
      const results: Record<string, GeoJsonFeatureCollection> = {};
      for (const slug of selectedLayers) {
        results[slug] = await apiFetch<GeoJsonFeatureCollection>(`/map/layers/${slug}/features`);
      }
      setCollections(results);
    };

    run();
  }, [selectedLayers]);

  useEffect(() => {
    if (!siteSlug) {
      setSiteCollection(null);
      return;
    }

    const run = async () => {
      try {
        const data = await apiFetch<GeoJsonFeatureCollection>(
          `/map/sites/${siteSlug}/features`
        );

        setSiteCollection(data);
      } catch (error) {
        console.error("Failed to fetch site features:", error);
        setSiteCollection(null);
      }
    };

    run();
  }, [siteSlug]);

  const handleLayerChange = (layerSlug: string) => {
    setSelectedLayers((prev) =>
      prev.includes(layerSlug)
        ? prev.filter((item) => item !== layerSlug)
        : [...prev, layerSlug]
    );
  };

  const handleFeatureClick = async (featureId: number) => {
    const detail = await apiFetch<MapFeatureDetailResponse>(`/map/features/${featureId}`);
    setSelectedFeature(detail);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("layer_name", file.name.replace(/\.(zip|geojson)$/i, ""));
      formData.append("layer_slug", `upload-${Date.now()}`);
      formData.append("category", "uploaded");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/map/upload-shapefile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result: UploadLayerResponse = await response.json();

      const newLayers = await apiFetch<{ items: MapLayerItem[] }>("/map/layers");
      setAvailableLayers(newLayers.items);
      setSelectedLayers((prev) => [...prev, result.layer_slug]);

      if (mapRef.current && result.bounds) {
        const [minx, miny, maxx, maxy] = result.bounds;
        mapRef.current.fitBounds([
          [miny, minx],
          [maxy, maxx],
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload spatial file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Shell mapMode>
      <div className="grid h-full grid-cols-1 gap-2 p-4 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
        <Card className="bc-card-strong flex min-h-0 flex-col overflow-hidden p-0">
          <div className="shrink-0 border-b border-[var(--bc-border)] bg-[linear-gradient(135deg,rgba(11,60,93,0.04),rgba(17,138,138,0.05))] px-5 py-4">
            <div className="text-lg font-semibold">Layers and filters</div>
            <div className="mt-1 text-sm text-slate-500">Study-area GIS workspace</div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
            <div>
              <div className="mb-2 font-medium">Layers</div>
              <div className="space-y-2">
                {availableLayers.map((layer) => (
                  <label
                    key={layer.slug}
                    className="flex items-center gap-3 rounded-2xl border border-[var(--bc-border)] bg-white px-4 py-3 hover:bg-[rgba(11,60,93,0.03)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLayers.includes(layer.slug)}
                      onChange={() => handleLayerChange(layer.slug)}
                      className="h-4 w-4 rounded"
                    />
                    <span>{layer.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative z-0 flex flex-col overflow-hidden p-0">
          <div className="relative z-0 h-full min-h-[700px]">
            <MapContainer
              key="main-leaflet-map"
              ref={mapRef}
              center={[-2.9, 108.2]}
              zoom={6}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {Object.entries(collections).map(([slug, featureCollection]) => (
                <GeoJSON
                  key={slug}
                  data={featureCollection as GeoJSON.GeoJsonObject}
                  style={() => {
                    if (slug === "mangrove") {
                      return {
                        color: "#166534",
                        weight: 2,
                        fillColor: "#22c55e",
                        fillOpacity: 0.35,
                      };
                    }

                    if (slug === "seagrass") {
                      return {
                        color: "#0f766e",
                        weight: 2,
                        fillColor: "#2dd4bf",
                        fillOpacity: 0.35,
                      };
                    }

                    return {
                      color: "#0f172a",
                      weight: 2,
                      fillColor: "#94a3b8",
                      fillOpacity: 0.25,
                    };
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onEachFeature={(feature: any, layer: any) => {
                    const title = feature?.properties?.title || "Feature";
                    const area = feature?.properties?.area_ha
                      ? `${feature.properties.area_ha} ha`
                      : "Area unavailable";

                    layer.bindTooltip(`${title} — ${area}`);

                    layer.on("click", async () => {
                      if (feature?.id != null) {
                        await handleFeatureClick(Number(feature.id));
                      }
                    });
                  }}
                />
              ))}
              {siteCollection && (
                <GeoJSON
                  key={`site-${siteSlug}`}
                  data={siteCollection as GeoJSON.GeoJsonObject}
                  style={() => ({
                    color: "#1d4ed8",
                    weight: 3,
                    fillColor: "#60a5fa",
                    fillOpacity: 0.25,
                  })}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onEachFeature={(feature: any, layer: any) => {
                    const title = feature?.properties?.title || "Feature";
                    const area = feature?.properties?.area_ha
                      ? `${feature.properties.area_ha} ha`
                      : "Area unavailable";

                    layer.bindTooltip(`${title} — ${area}`);

                    layer.on("click", async () => {
                      if (feature?.id != null) {
                        await handleFeatureClick(Number(feature.id));
                      }
                    });
                  }}
                />
              )}
            </MapContainer>
          </div>
        </Card>

        <Card className="bc-card-strong flex min-h-0 flex-col overflow-hidden p-0">
          <div className="shrink-0 border-b border-[var(--bc-border)] bg-[linear-gradient(135deg,rgba(11,60,93,0.04),rgba(17,138,138,0.05))] px-5 py-4">
            <div className="text-lg font-semibold">Spatial information</div>
            <div className="mt-1 text-sm text-slate-500">Click feature for details</div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm text-slate-600">
            {!selectedFeature ? (
              <div className="rounded-2xl border border-dashed border-[var(--bc-border)] bg-[rgba(11,60,93,0.03)] p-4">
                click a feature on the map.
              </div>
            ) : (
              <>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-medium text-slate-900">{selectedFeature.title}</div>
                  <div className="mt-2">{selectedFeature.summary}</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-medium">Attributes</div>
                  <div className="mt-2 space-y-1">
                    {selectedFeature.attributes &&
                      Object.entries(selectedFeature.attributes).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                  </div>
                </div>

                {selectedFeature.site_slug && (
                  <a
                    href={`/case-study/${selectedFeature.site_slug}`}
                    className="block rounded-2xl bg-slate-50 p-4 hover:bg-slate-100"
                  >
                    Open case study
                  </a>
                )}

                <div className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800">
                  {selectedFeature.metadata_note}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}