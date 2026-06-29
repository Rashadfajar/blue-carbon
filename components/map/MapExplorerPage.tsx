"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  Feature,
  GeoJsonObject,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type {
  Layer as LeafletLayer,
  Map as LeafletMap,
  PathOptions,
} from "leaflet";

import Shell from "@/components/layout/Shell";
import Card from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";
import type {
  GeoJsonFeatureCollection,
  MapFeatureDetailResponse,
  MapLayerItem,
  SiteListItem,
  SiteListResponse,
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

type StyledMapLayerItem = MapLayerItem & {
  site_slug?: string | null;
  site_slugs?: string[];
  site_title?: string | null;
  fill_color?: string;
  fill_opacity?: number;
  stroke_color?: string;
  stroke_opacity?: number;
  stroke_weight?: number;
};

type MapFeatureProperties = {
  title?: string;
  name?: string;
  summary?: string;
  site_slug?: string | null;
  layer_slug?: string | null;
  layer_name?: string | null;
  layer?: string | null;
  source_layer?: string | null;
  category?: string | null;
  area_ha?: number | string | null;
  fill_color?: string;
  fill_opacity?: number;
  stroke_color?: string;
  stroke_opacity?: number;
  stroke_weight?: number;
  [key: string]: unknown;
};

type MapGeoFeature = Feature<Geometry, MapFeatureProperties> & {
  id?: string | number;
};

type FeatureLike = {
  id?: string | number;
  properties?: MapFeatureProperties | null;
};

type TooltipLayer = LeafletLayer & {
  bindTooltip: (content: string) => LeafletLayer;
};

interface Props {
  layers: MapLayerItem[];
}

function emptyFeatureCollection(): GeoJsonFeatureCollection {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function asFeatureLike(feature: unknown): FeatureLike {
  return feature as FeatureLike;
}

function getFeatureLayerSlug(feature: unknown): string {
  const mapFeature = asFeatureLike(feature);

  return (
    mapFeature.properties?.layer_slug ||
    mapFeature.properties?.layer ||
    mapFeature.properties?.source_layer ||
    "site-features"
  );
}

function getFeatureSiteSlug(feature: unknown): string {
  const mapFeature = asFeatureLike(feature);
  return mapFeature.properties?.site_slug || "";
}

function splitFeatureCollectionByLayer(
  collection: GeoJsonFeatureCollection,
  fallbackLayerSlug = "site-features"
): Record<string, GeoJsonFeatureCollection> {
  const grouped: Record<string, GeoJsonFeatureCollection> = {};

  collection.features.forEach((feature) => {
    const layerSlug = getFeatureLayerSlug(feature) || fallbackLayerSlug;

    if (!grouped[layerSlug]) {
      grouped[layerSlug] = emptyFeatureCollection();
    }

    grouped[layerSlug].features.push(feature);
  });

  return grouped;
}

function filterFeatureCollectionBySite(
  collection: GeoJsonFeatureCollection,
  siteSlug: string
): GeoJsonFeatureCollection {
  const filtered = collection.features.filter((feature) => {
    const featureSiteSlug = getFeatureSiteSlug(feature);

    if (!featureSiteSlug) return true;

    return featureSiteSlug === siteSlug;
  });

  return {
    type: "FeatureCollection",
    features: filtered,
  };
}

function inferSiteSlugsFromLayer(
  layer: StyledMapLayerItem,
  sites: SiteListItem[]
): string[] {
  const declared = [
    layer.site_slug || "",
    ...(Array.isArray(layer.site_slugs) ? layer.site_slugs : []),
  ].filter(Boolean);

  if (declared.length > 0) {
    return unique(declared);
  }

  const layerText = normalizeText(
    `${layer.slug || ""} ${layer.name || ""} ${layer.category || ""}`
  );

  const matched = sites
    .filter((site) => {
      const siteSlug = normalizeText(site.slug);
      const siteTitle = normalizeText(site.title || "");

      return (
        layerText === siteSlug ||
        layerText.startsWith(`${siteSlug}-`) ||
        layerText.includes(siteSlug) ||
        Boolean(siteTitle && layerText.includes(siteTitle))
      );
    })
    .map((site) => site.slug);

  return unique(matched);
}

function getLayerStyle(
  layerMeta?: StyledMapLayerItem,
  feature?: MapGeoFeature
): PathOptions {
  return {
    fillColor:
      feature?.properties?.fill_color ||
      layerMeta?.fill_color ||
      "#B6DAB8",
    fillOpacity:
      feature?.properties?.fill_opacity ??
      layerMeta?.fill_opacity ??
      0.55,
    color:
      feature?.properties?.stroke_color ||
      layerMeta?.stroke_color ||
      feature?.properties?.fill_color ||
      layerMeta?.fill_color ||
      "#84BD83",
    opacity:
      feature?.properties?.stroke_opacity ??
      layerMeta?.stroke_opacity ??
      0,
    weight:
      feature?.properties?.stroke_weight ??
      layerMeta?.stroke_weight ??
      0,
  };
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function MapExplorerPage({ layers }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteSlug = searchParams.get("site") || "";

  const mapRef = useRef<LeafletMap | null>(null);
  const layerCacheRef = useRef<Record<string, GeoJsonFeatureCollection>>({});

  const [availableLayers, setAvailableLayers] = useState<StyledMapLayerItem[]>(
    layers as StyledMapLayerItem[]
  );

  const [sites, setSites] = useState<SiteListItem[]>([]);

  const [layerSiteIndex, setLayerSiteIndex] = useState<
    Record<string, string[]>
  >({});

  const [isGroupingLayers, setIsGroupingLayers] = useState(true);

  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

  const [collections, setCollections] = useState<
    Record<string, GeoJsonFeatureCollection>
  >({});

  const [siteScopedCollections, setSiteScopedCollections] = useState<
    Record<string, GeoJsonFeatureCollection>
  >({});

  const [selectedFeature, setSelectedFeature] =
    useState<MapFeatureDetailResponse | null>(null);

  const [siteFeatureCount, setSiteFeatureCount] = useState<number | null>(null);

  useEffect(() => {
    setAvailableLayers(layers as StyledMapLayerItem[]);
  }, [layers]);

  const getLayerCollection = useCallback(
    async (layerSlug: string): Promise<GeoJsonFeatureCollection> => {
      if (layerCacheRef.current[layerSlug]) {
        return layerCacheRef.current[layerSlug];
      }

      const data = await apiFetch<GeoJsonFeatureCollection>(
        `/map/layers/${layerSlug}/features`
      );

      layerCacheRef.current[layerSlug] = data;
      return data;
    },
    []
  );

  const fitToGeoJsonObject = useCallback(
    async (geojson: GeoJsonObject, maxZoom = 13) => {
      if (!mapRef.current) return;

      const L = await import("leaflet");
      const layer = L.geoJSON(geojson);
      const bounds = layer.getBounds();

      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, {
          padding: [28, 28],
          maxZoom,
        });
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsGroupingLayers(true);

      try {
        const siteResponse = await apiFetch<SiteListResponse>("/sites");
        const siteItems = Array.isArray(siteResponse.items)
          ? siteResponse.items
          : [];

        if (cancelled) return;

        setSites(siteItems);

        const nextIndex: Record<string, string[]> = {};

        availableLayers.forEach((layer) => {
          const inferredSites = inferSiteSlugsFromLayer(layer, siteItems);
          nextIndex[layer.slug] = inferredSites;
        });

        const unresolvedLayers = availableLayers.filter((layer) => {
          const indexedSites = nextIndex[layer.slug] || [];
          return indexedSites.length === 0;
        });

        await Promise.all(
          unresolvedLayers.map(async (layer) => {
            try {
              const fc = await getLayerCollection(layer.slug);

              const featureSiteSlugs = unique(
                fc.features
                  .map((feature) => getFeatureSiteSlug(feature))
                  .filter(Boolean)
              );

              nextIndex[layer.slug] = featureSiteSlugs;
            } catch {
              nextIndex[layer.slug] = [];
            }
          })
        );

        if (cancelled) return;

        setLayerSiteIndex(nextIndex);
      } catch (error) {
        console.error("Failed to build layer-site index:", error);

        if (!cancelled) {
          setSites([]);
          setLayerSiteIndex({});
        }
      } finally {
        if (!cancelled) {
          setIsGroupingLayers(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [availableLayers, getLayerCollection]);

  const getSiteLayerSlugs = useCallback(
    (targetSiteSlug: string): string[] => {
      return availableLayers
        .filter((layer) => {
          const indexedSites = layerSiteIndex[layer.slug] || [];
          const inferredSites = inferSiteSlugsFromLayer(layer, sites);

          return unique([...indexedSites, ...inferredSites]).includes(
            targetSiteSlug
          );
        })
        .map((layer) => layer.slug);
    },
    [availableLayers, layerSiteIndex, sites]
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!siteSlug) {
        setSiteScopedCollections({});
        setSelectedLayers([]);
        setCollections({});
        setSelectedFeature(null);
        setSiteFeatureCount(null);
        return;
      }

      try {
        const siteLayerSlugs = getSiteLayerSlugs(siteSlug);

        if (siteLayerSlugs.length > 0) {
          const scoped: Record<string, GeoJsonFeatureCollection> = {};
          let totalFeatures = 0;

          for (const layerSlug of siteLayerSlugs) {
            if (cancelled) return;

            const layerCollection = await getLayerCollection(layerSlug);

            const filteredCollection = filterFeatureCollectionBySite(
              layerCollection,
              siteSlug
            );

            if (filteredCollection.features.length > 0) {
              scoped[layerSlug] = filteredCollection;
              totalFeatures += filteredCollection.features.length;
            }
          }

          if (Object.keys(scoped).length > 0) {
            if (cancelled) return;

            const activeLayerSlugs = Object.keys(scoped);

            setSiteScopedCollections(scoped);
            setSelectedLayers(activeLayerSlugs);
            setCollections(scoped);
            setSelectedFeature(null);
            setSiteFeatureCount(totalFeatures);

            const merged: GeoJsonFeatureCollection = {
              type: "FeatureCollection",
              features: Object.values(scoped).flatMap((fc) => fc.features),
            };

            await fitToGeoJsonObject(merged as unknown as GeoJsonObject, 13);
            return;
          }
        }

        const siteCollection = await apiFetch<GeoJsonFeatureCollection>(
          `/map/sites/${siteSlug}/features`
        );

        if (cancelled) return;

        const grouped = splitFeatureCollectionByLayer(
          siteCollection,
          `${siteSlug}-site-features`
        );

        const siteLayerSlugsFromEndpoint = Object.keys(grouped);

        setLayerSiteIndex((prev) => {
          const next = { ...prev };

          siteLayerSlugsFromEndpoint.forEach((layerSlug) => {
            const existing = next[layerSlug] || [];
            next[layerSlug] = unique([...existing, siteSlug]);
          });

          return next;
        });

        setSiteScopedCollections(grouped);
        setSelectedLayers(siteLayerSlugsFromEndpoint);
        setCollections(grouped);
        setSelectedFeature(null);
        setSiteFeatureCount(siteCollection.features.length);

        await fitToGeoJsonObject(
          siteCollection as unknown as GeoJsonObject,
          13
        );
      } catch (error) {
        console.error("Failed to fetch site-linked layers:", error);

        if (!cancelled) {
          setSiteScopedCollections({});
          setSelectedLayers([]);
          setCollections({});
          setSelectedFeature(null);
          setSiteFeatureCount(0);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    siteSlug,
    getSiteLayerSlugs,
    getLayerCollection,
    fitToGeoJsonObject,
    layerSiteIndex,
  ]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (selectedLayers.length === 0) {
          setCollections({});
          return;
        }

        const next: Record<string, GeoJsonFeatureCollection> = {};

        for (const layerSlug of selectedLayers) {
          if (cancelled) return;

          if (siteSlug && siteScopedCollections[layerSlug]) {
            next[layerSlug] = siteScopedCollections[layerSlug];
          } else {
            next[layerSlug] = await getLayerCollection(layerSlug);
          }
        }

        if (!cancelled) {
          setCollections(next);
        }
      } catch (error) {
        console.error("Failed to load selected layers:", error);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [selectedLayers, siteSlug, siteScopedCollections, getLayerCollection]);

  const handleFeatureClick = async (featureId: string | number) => {
    try {
      const detail = await apiFetch<MapFeatureDetailResponse>(
        `/map/features/${featureId}`
      );

      setSelectedFeature(detail);
    } catch (error) {
      console.error("Failed to fetch feature detail:", error);
    }
  };

  const handleLayerToggle = async (layerSlug: string, checked: boolean) => {
    if (!checked) {
      setSelectedLayers((prev) => prev.filter((slug) => slug !== layerSlug));
      return;
    }

    setSelectedLayers((prev) =>
      prev.includes(layerSlug) ? prev : [...prev, layerSlug]
    );

    try {
      const layerCollection =
        siteSlug && siteScopedCollections[layerSlug]
          ? siteScopedCollections[layerSlug]
          : await getLayerCollection(layerSlug);

      await fitToGeoJsonObject(layerCollection as unknown as GeoJsonObject, 13);
    } catch (error) {
      console.error(`Failed to focus layer ${layerSlug}:`, error);
    }
  };

  const handleLayerFocus = async (layerSlug: string) => {
    try {
      setSelectedFeature(null);

      setSelectedLayers((prev) =>
        prev.includes(layerSlug) ? prev : [...prev, layerSlug]
      );

      const layerCollection =
        siteSlug && siteScopedCollections[layerSlug]
          ? siteScopedCollections[layerSlug]
          : await getLayerCollection(layerSlug);

      await fitToGeoJsonObject(layerCollection as unknown as GeoJsonObject, 13);
    } catch (error) {
      console.error(`Failed to focus layer ${layerSlug}:`, error);
    }
  };

  const clearLayers = () => {
    setSelectedLayers([]);
    setCollections({});
    setSelectedFeature(null);
  };

  const handleClearSiteFilter = () => {
    setSiteScopedCollections({});
    setSelectedLayers([]);
    setCollections({});
    setSelectedFeature(null);
    setSiteFeatureCount(null);

    router.replace("/map", {
      scroll: false,
    });
  };

  const layerBySlug = useMemo(() => {
    return new Map(availableLayers.map((layer) => [layer.slug, layer]));
  }, [availableLayers]);

  const currentSite = useMemo(() => {
    return sites.find((site) => site.slug === siteSlug);
  }, [sites, siteSlug]);

  const groupedSiteLayers = useMemo(() => {
    const usedSlugs = new Set<string>();

    if (siteSlug) {
      const siteLayerSlugs = getSiteLayerSlugs(siteSlug);

      siteLayerSlugs.forEach((slug) => usedSlugs.add(slug));

      const fallbackLoadedSlugs = Object.keys(siteScopedCollections).filter(
        (slug) => !siteLayerSlugs.includes(slug)
      );

      fallbackLoadedSlugs.forEach((slug) => usedSlugs.add(slug));

      const otherLayerSlugs = availableLayers
        .map((layer) => layer.slug)
        .filter((slug) => !usedSlugs.has(slug));

      return [
        {
          title: currentSite?.title || siteSlug,
          subtitle: "Layers linked to the selected case study",
          layerSlugs: unique([...siteLayerSlugs, ...fallbackLoadedSlugs]),
        },
        {
          title: "Other layers",
          subtitle: "Additional layers available in the GIS database",
          layerSlugs: otherLayerSlugs,
        },
      ].filter((group) => group.layerSlugs.length > 0);
    }

    const groups = sites
      .map((site) => {
        const siteLayerSlugs = getSiteLayerSlugs(site.slug);

        siteLayerSlugs.forEach((slug) => usedSlugs.add(slug));

        return {
          title: site.title,
          subtitle: site.slug,
          layerSlugs: unique(siteLayerSlugs),
        };
      })
      .filter((group) => group.layerSlugs.length > 0);

    const otherSlugs = availableLayers
      .map((layer) => layer.slug)
      .filter((slug) => !usedSlugs.has(slug));

    if (otherSlugs.length > 0) {
      groups.push({
        title: "Other / global layers",
        subtitle: "Layers without site_slug or not linked to a case study",
        layerSlugs: otherSlugs,
      });
    }

    return groups;
  }, [
    availableLayers,
    currentSite,
    getSiteLayerSlugs,
    siteScopedCollections,
    siteSlug,
    sites,
  ]);

  const selectedFeatureAttributes = useMemo(() => {
    const attributes = selectedFeature?.attributes || {};

    return Object.entries(attributes).filter(([key]) => {
      return ![
        "related_interventions",
        "related_resources",
        "fill_color",
        "fill_opacity",
        "stroke_color",
        "stroke_opacity",
        "stroke_weight",
      ].includes(key);
    });
  }, [selectedFeature]);

  const handleEachFeature = useCallback(
    (feature: Feature<Geometry, GeoJsonProperties>, layer: LeafletLayer) => {
      const mapFeature = feature as MapGeoFeature;
      const tooltipLayer = layer as TooltipLayer;

      const title =
        mapFeature.properties?.title ||
        mapFeature.properties?.name ||
        "Feature";

      const area = mapFeature.properties?.area_ha
        ? `${mapFeature.properties.area_ha} ha`
        : "Area unavailable";

      tooltipLayer.bindTooltip(`${title} — ${area}`);

      layer.on("click", async () => {
        if (mapFeature.id !== undefined && mapFeature.id !== null) {
          await handleFeatureClick(mapFeature.id);
        }
      });
    },
    []
  );

  return (
    <Shell mapMode>
      <div className="h-auto px-3 py-3 md:px-4 md:py-4 lg:h-[calc(100vh-112px)] lg:overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)_340px] xl:grid-cols-[380px_minmax(0,1fr)_360px]">
          <Card className="bc-card-strong order-2 flex min-h-0 flex-col overflow-hidden p-0 lg:order-1">
            <div className="mb-2 p-4 pb-0 md:p-4 md:pb-0">
              <div className="h-1 w-14 rounded-full bg-[var(--bc-accent)]" />
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--bc-accent)]">
                Map Explorer
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--bc-muted)]">
                {siteSlug
                  ? "Site-linked layers are activated automatically."
                  : "Select layers to display spatial data."}
              </p>

              {siteSlug ? (
                <div className="mt-3 rounded-2xl border border-[var(--bc-border)] bg-[rgba(17,138,138,0.06)] p-3 text-xs text-slate-600">
                  <div className="font-semibold text-[var(--bc-primary)]">
                    Active site: {currentSite?.title || siteSlug}
                  </div>
                  <div className="mt-1">
                    {siteFeatureCount ?? 0} spatial feature(s) loaded
                  </div>
                </div>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-visible p-4 text-sm md:p-4 lg:overflow-y-auto">
              <div>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold tracking-tight text-[var(--bc-primary)]">
                      Layers
                    </div>

                    {isGroupingLayers ? (
                      <div className="mt-1 text-xs text-slate-500">
                        Grouping layers by site_slug...
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap justify-end gap-2">
                    {siteSlug ? (
                      <button
                        type="button"
                        onClick={handleClearSiteFilter}
                        className="rounded-xl border border-[var(--bc-border)] px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Clear site filter
                      </button>
                    ) : null}

                    {selectedLayers.length > 0 ? (
                      <button
                        type="button"
                        onClick={clearLayers}
                        className="rounded-xl border px-3 py-2 text-xs hover:bg-slate-50"
                      >
                        Uncheck all layers
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="max-h-[360px] overflow-y-auto pr-1 lg:max-h-none">
                  <div className="space-y-3">
                    {groupedSiteLayers.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[var(--bc-border)] bg-slate-50 p-4 text-sm text-slate-500">
                        {availableLayers.length === 0
                          ? "No layers available."
                          : "No grouped layer is available yet."}
                      </div>
                    ) : (
                      groupedSiteLayers.map((group) => (
                        <div
                          key={group.title}
                          className="rounded-2xl border border-[var(--bc-border)] bg-white p-3"
                        >
                          <div className="mb-3">
                            <div className="text-sm font-semibold text-[var(--bc-primary)]">
                              {group.title}
                            </div>
                            {/* <div className="text-xs text-slate-500">
                              {group.subtitle}
                            </div> */}
                          </div>

                          <div className="space-y-2">
                            {group.layerSlugs.map((slug) => {
                              const layer = layerBySlug.get(slug);
                              const scopedCollection =
                                siteScopedCollections[slug] || collections[slug];

                              const sampleFeature = scopedCollection
                                ?.features?.[0]
                                ? asFeatureLike(scopedCollection.features[0])
                                : undefined;

                              const checked = selectedLayers.includes(slug);

                              const layerName =
                                layer?.name ||
                                sampleFeature?.properties?.layer_name ||
                                slug;

                              const layerCategory =
                                layer?.category ||
                                sampleFeature?.properties?.category ||
                                "site layer";

                              const color =
                                sampleFeature?.properties?.fill_color ||
                                layer?.fill_color ||
                                "#B6DAB8";

                              return (
                                <div
                                  key={slug}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => handleLayerFocus(slug)}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      handleLayerFocus(slug);
                                    }
                                  }}
                                  className={[
                                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition",
                                    checked
                                      ? "border-[var(--bc-accent)] bg-[rgba(17,138,138,0.08)]"
                                      : "border-[var(--bc-border)] bg-white hover:bg-[rgba(11,60,93,0.03)]",
                                  ].join(" ")}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) =>
                                      handleLayerToggle(
                                        slug,
                                        event.target.checked
                                      )
                                    }
                                    className="h-4 w-4 shrink-0 rounded"
                                  />

                                  <span
                                    className="h-4 w-4 shrink-0 rounded-full border"
                                    style={{
                                      backgroundColor: color,
                                      borderColor:
                                        layer?.stroke_color ||
                                        layer?.fill_color ||
                                        color,
                                    }}
                                  />

                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-slate-900">
                                      {layerName}
                                    </div>
                                    {/* <div className="mt-0.5 truncate text-xs text-slate-500">
                                      {String(layerCategory)} · click to focus
                                    </div> */}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative z-0 order-1 flex min-h-0 flex-col overflow-hidden p-0 lg:order-2">
            <div className="relative z-0 h-[56vh] min-h-[380px] w-full overflow-hidden lg:h-full lg:min-h-0">
              <MapContainer
                key="main-leaflet-map"
                ref={mapRef}
                center={[-2.5, 118.0]}
                zoom={4.5}
                zoomSnap={0.5}
                zoomDelta={0.5}
                scrollWheelZoom
                className="z-0 h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {Object.entries(collections).map(
                  ([slug, featureCollection]) => {
                    const layerMeta = layerBySlug.get(slug);

                    return (
                      <GeoJSON
                        key={`${slug}-${featureCollection.features.length}`}
                        data={featureCollection as unknown as GeoJsonObject}
                        style={(feature) =>
                          getLayerStyle(
                            layerMeta,
                            feature as MapGeoFeature | undefined
                          )
                        }
                        onEachFeature={handleEachFeature}
                      />
                    );
                  }
                )}
              </MapContainer>
            </div>
          </Card>

          <Card className="bc-card-strong order-3 flex min-h-0 flex-col overflow-hidden p-0">
            <div className="mb-3 p-4 pb-0 md:p-4 md:pb-0">
              <div className="h-1 w-14 rounded-full bg-[var(--bc-accent)]" />
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--bc-accent)]">
                Spatial information
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--bc-muted)]">
                Click a feature on the map to inspect details.
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-visible p-4 text-sm text-slate-600 md:p-4 lg:overflow-y-auto">
              {!selectedFeature ? (
                <div className="rounded-2xl border border-dashed border-[var(--bc-border)] bg-[rgba(11,60,93,0.03)] p-4">
                  No feature selected.
                </div>
              ) : (
                <>
                  {selectedFeature.site_slug ? (
                    <Link
                      href={`/case-study/${selectedFeature.site_slug}`}
                      className="block rounded-2xl bg-slate-50 p-4 hover:bg-slate-100"
                    >
                      Open case study
                    </Link>
                  ) : null}

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-medium text-slate-900">
                      {selectedFeature.title}
                    </div>
{/* 
                    {selectedFeature.summary ? (
                      <div className="mt-2 text-sm leading-6 text-slate-600">
                        {selectedFeature.summary}
                      </div>
                    ) : null} */}
                  </div>

                  {selectedFeatureAttributes.length > 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-medium">Attributes</div>

                      <div className="mt-2 space-y-1">
                        {selectedFeatureAttributes.map(([key, value]) => (
                          <div key={key} className="break-words text-xs">
                            <span className="font-medium">{key}:</span>{" "}
                            {stringifyValue(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}