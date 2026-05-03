"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import GisUploadForm from "@/components/admin/maps/GisUploadForm";
import LayerTable from "@/components/admin/maps/LayerTable";
import { apiFetch } from "@/lib/api";
import type { GeoJsonFeatureCollection, MapLayerItem, MapLayerListResponse } from "@/types/api";
import type { GisUploadResult } from "@/types/admin";

interface LayerRow extends MapLayerItem {
  featureCount?: number;
}

interface Props {
  initialLayers: MapLayerItem[];
}

export default function GisManagerPage({ initialLayers }: Props) {
  const [layers, setLayers] = useState<LayerRow[]>(initialLayers);

  useEffect(() => {
    const run = async () => {
      const enriched = await Promise.all(
        initialLayers.map(async (layer) => {
          try {
            const features = await apiFetch<GeoJsonFeatureCollection>(`/map/layers/${layer.slug}/features`);
            return { ...layer, featureCount: features.features.length };
          } catch {
            return { ...layer, featureCount: 0 };
          }
        })
      );
      setLayers(enriched);
    };

    run();
  }, [initialLayers]);

  const refreshLayers = async () => {
    const result = await apiFetch<MapLayerListResponse>("/map/layers");
    const enriched = await Promise.all(
      result.items.map(async (layer) => {
        try {
          const features = await apiFetch<GeoJsonFeatureCollection>(`/map/layers/${layer.slug}/features`);
          return { ...layer, featureCount: features.features.length };
        } catch {
          return { ...layer, featureCount: 0 };
        }
      })
    );
    setLayers(enriched);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUploaded = async (_result: GisUploadResult) => {
    await refreshLayers();
  };

  const handleDelete = async (Slug: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiBase}/admin/sites/layers/${Slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Failed to delete layer");
    }

    await refreshLayers();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="GIS Manager"
        description="Manage uploaded layers, shapefiles, and study-area spatial data."
      />

      <FormSection
        title="Upload GIS Layer"
        description="Upload shapefile zip or GeoJSON, optionally linked to a site slug."
      >
        <GisUploadForm onUploaded={handleUploaded} />
      </FormSection>

      <FormSection
        title="Available Layers"
        description="View current layer registry and remove obsolete uploaded layers."
      >
        <LayerTable layers={layers} onDelete={handleDelete} />
      </FormSection>
    </div>
  );
}