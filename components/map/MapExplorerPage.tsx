"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const initialSelected = useMemo(
    () => layers.filter((layer) => layer.is_default_visible).map((layer) => layer.slug),
    [layers]
  );

  const [availableLayers, setAvailableLayers] = useState<MapLayerItem[]>(layers);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(initialSelected);
  const [collections, setCollections] = useState<Record<string, GeoJsonFeatureCollection>>({});
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
        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-4">
            <div className="text-lg font-semibold">Layers and filters</div>
            <div className="mt-1 text-sm text-slate-500">Study-area GIS workspace</div>
          </div>

          <div className="space-y-4 p-5 text-sm">
            <div>
              <label className="mb-2 block font-medium">Upload shapefile (.zip) or GeoJSON</label>
              <input
                type="file"
                accept=".zip,.geojson,application/geo+json,application/zip"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                className="block w-full rounded-xl border bg-white px-3 py-2"
              />
              {uploading && <div className="mt-2 text-xs text-slate-500">Uploading...</div>}
            </div>

            <div>
              <div className="mb-2 font-medium">Layers</div>
              <div className="space-y-2">
                {availableLayers.map((layer) => (
                  <label key={layer.slug} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
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
            </MapContainer>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-5 py-4">
            <div className="text-lg font-semibold">Spatial information</div>
            <div className="mt-1 text-sm text-slate-500">Click feature for details</div>
          </div>

          <div className="space-y-4 p-5 text-sm text-slate-600">
            {!selectedFeature ? (
              <div className="rounded-2xl bg-slate-50 p-4">
                Upload a study-area file or click a feature on the map.
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