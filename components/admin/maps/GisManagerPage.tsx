"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/shared/AdminPageHeader";
import FormSection from "@/components/admin/shared/FormSection";
import GisUploadForm from "@/components/admin/maps/GisUploadForm";
import LayerTable from "@/components/admin/maps/LayerTable";
import LayerStyleEditor from "@/components/admin/maps/LayerStyleEditor";
import { apiFetch } from "@/lib/api";
import type {
  GeoJsonFeatureCollection,
  MapLayerItem,
  MapLayerListResponse,
} from "@/types/api";
import type { GisUploadResult } from "@/types/admin";

interface LayerRow extends MapLayerItem {
  featureCount?: number;
}

interface Props {
  initialLayers: MapLayerItem[];
}

export default function GisManagerPage({ initialLayers }: Props) {
  const [layers, setLayers] = useState<LayerRow[]>(initialLayers);
  const [editingLayer, setEditingLayer] = useState<LayerRow | null>(null);

  useEffect(() => {
    const run = async () => {
      const enriched = await Promise.all(
        initialLayers.map(async (layer) => {
          try {
            const features = await apiFetch<GeoJsonFeatureCollection>(
              `/map/layers/${layer.slug}/features`
            );

            return {
              ...layer,
              featureCount: features.features.length,
            };
          } catch {
            return {
              ...layer,
              featureCount: 0,
            };
          }
        })
      );

      setLayers(enriched);
    };

    run();
  }, [initialLayers]);

  useEffect(() => {
    if (!editingLayer) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditingLayer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingLayer]);

  const refreshLayers = async () => {
    const result = await apiFetch<MapLayerListResponse>("/map/layers");

    const enriched = await Promise.all(
      result.items.map(async (layer) => {
        try {
          const features = await apiFetch<GeoJsonFeatureCollection>(
            `/map/layers/${layer.slug}/features`
          );

          return {
            ...layer,
            featureCount: features.features.length,
          };
        } catch {
          return {
            ...layer,
            featureCount: 0,
          };
        }
      })
    );

    setLayers(enriched);
  };

  const handleUploaded = async (_result: GisUploadResult) => {
    await refreshLayers();
  };

  const handleDelete = async (slug: string) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${apiBase}/admin/maps/layers/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Failed to delete layer");
    }

    await refreshLayers();
  };

  const handleCloseEditor = () => {
    setEditingLayer(null);
  };

  const handleSavedEditor = async () => {
    await refreshLayers();
    setEditingLayer(null);
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
        <LayerTable
          layers={layers}
          onDelete={handleDelete}
          onEdit={setEditingLayer}
        />
      </FormSection>

      {editingLayer ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-2 py-2 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseEditor}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-5">
              <LayerStyleEditor
                layer={editingLayer}
                onSaved={handleSavedEditor}
                onClose={handleCloseEditor}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}