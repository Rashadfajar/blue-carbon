"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Feature, Geometry, GeoJsonObject } from "geojson";
import type { Map as LeafletMap, PathOptions } from "leaflet";

import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { apiFetch } from "@/lib/api";
import type {
  GeoJsonFeatureCollection,
  SiteDetailResponse,
} from "@/types/api";

const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);

const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);

const GeoJSON = dynamic(
  async () => (await import("react-leaflet")).GeoJSON,
  { ssr: false }
);

type LayerFeatureProperties = {
  fill_color?: string;
  fill_opacity?: number;
  stroke_color?: string;
  stroke_opacity?: number;
  stroke_weight?: number;
  [key: string]: unknown;
};

type LayerFeature = Feature<Geometry, LayerFeatureProperties>;

const getStringValue = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim() ? value : fallback;
};

const getNumberValue = (value: unknown, fallback: number): number => {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
};

const getMiniMapStyle = (feature?: LayerFeature): PathOptions => {
  const properties = feature?.properties || {};

  const fillColor = getStringValue(properties.fill_color, "#B6DAB8");
  const strokeColor = getStringValue(
    properties.stroke_color,
    fillColor || "#84BD83"
  );

  return {
    fillColor,
    fillOpacity: getNumberValue(properties.fill_opacity, 0.55),
    color: strokeColor,

    // Jangan default 0, karena bisa bikin layer terlihat "mati"
    opacity: getNumberValue(properties.stroke_opacity, 1),
    weight: getNumberValue(properties.stroke_weight, 2),
  };
};

export default function MiniMapCard({ data }: { data: SiteDetailResponse }) {
  const [features, setFeatures] =
    useState<GeoJsonFeatureCollection | null>(null);

  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const result = await apiFetch<GeoJsonFeatureCollection>(
          `/map/sites/${data.slug}/features`
        );

        if (!cancelled) {
          setFeatures(result);
        }
      } catch (error) {
        console.error("Failed to load mini map features:", error);

        if (!cancelled) {
          setFeatures(null);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [data.slug]);

  useEffect(() => {
    if (!features || !features.features?.length || !mapRef.current) return;

    let cancelled = false;

    const fitToFeatures = async () => {
      const L = await import("leaflet");

      if (cancelled || !mapRef.current) return;

      const bounds = L.geoJSON(features as unknown as GeoJsonObject).getBounds();

      if (!bounds.isValid()) return;

      mapRef.current.fitBounds(bounds, {
        padding: [24, 24],
        maxZoom: data.mini_map?.zoom || 13,
        animate: false,
      });
    };

    fitToFeatures();

    return () => {
      cancelled = true;
    };
  }, [features, data.mini_map?.zoom]);

  return (
    <Card>
      <SectionTitle title="Mini map" />

      <div className="relative z-0 overflow-hidden rounded-[24px] border border-slate-200">
        <div className="relative z-0 h-72 w-full">
          <MapContainer
            ref={mapRef}
            center={
              data.mini_map
                ? [data.mini_map.latitude, data.mini_map.longitude]
                : [-2.5, 118.0]
            }
            zoom={data.mini_map?.zoom || 5.5}
            zoomSnap={0.5}
            zoomDelta={0.5}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {features ? (
              <GeoJSON
                data={features as unknown as GeoJsonObject}
                style={getMiniMapStyle}
              />
            ) : null}
          </MapContainer>
        </div>
      </div>
    </Card>
  );
}