"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { apiFetch } from "@/lib/api";
import type { GeoJsonFeatureCollection, SiteDetailResponse } from "@/types/api";

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, { ssr: false });
const GeoJSON = dynamic(async () => (await import("react-leaflet")).GeoJSON, { ssr: false });

export default function MiniMapCard({ data }: { data: SiteDetailResponse }) {
  const [features, setFeatures] = useState<GeoJsonFeatureCollection | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await apiFetch<GeoJsonFeatureCollection>(`/map/sites/${data.slug}/features`);
        setFeatures(result);
      } catch {
        setFeatures(null);
      }
    };

    run();
  }, [data.slug]);

  return (
    <Card>
      <SectionTitle title="Mini map" />
      <div className="relative z-0 overflow-hidden rounded-[24px] border border-slate-200">
        <div className="relative z-0 h-72 w-full">
          <MapContainer
            center={
              data.mini_map
                ? [data.mini_map.latitude, data.mini_map.longitude]
                : [-2.9, 108.2]
            }
            zoom={data.mini_map?.zoom || 8}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {features && (
              <GeoJSON
                data={features as unknown as GeoJSON.GeoJsonObject}
                style={() => ({
                  color: "#0f172a",
                  weight: 2,
                  fillOpacity: 0.3,
                })}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </Card>
  );
}