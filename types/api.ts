export interface CTAItem {
  label: string;
  href: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface CardSummary {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface ResourceSummary {
  slug: string;
  title: string;
  summary: string;
  category: string;
  file_url?: string | null;
}

export interface HomeResponse {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primary_cta: CTAItem;
    secondary_cta: CTAItem;
  };
  stats: StatItem[];
  featured_interventions: CardSummary[];
  latest_resources: ResourceSummary[];
  quick_links: CTAItem[];
}

export interface InterventionSummary {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  ecosystem: string;
  type: string;
  objective: string;
  project_stage: string;
}

export interface InterventionListResponse {
  items: InterventionSummary[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface InterventionFilterMetaResponse {
  ecosystems: string[];
  types: string[];
  objectives: string[];
  project_stages: string[];
}

export interface RiskItem {
  title: string;
  description: string;
}

export interface SiteListItem {
  slug: string;
  title: string;
  subtitle?: string | null;
  summary: string;
}

export interface SiteListResponse {
  items: SiteListItem[];
}

export interface SiteDetailResponse {
  slug: string;
  title: string;
  subtitle?: string | null;
  summary: string;
  hero_image_url?: string | null;
  quick_stats: StatItem[];
  sections: {
    site_overview: string;
    pressures_and_risks: RiskItem[];
    intervention_pathways: string[];
    mrv_readiness: string[];
    governance_financing: string[];
  };
  mini_map?: {
    latitude: number;
    longitude: number;
    zoom: number;
  } | null;
}

export interface MapLayerItem {
  slug: string;
  name: string;
  category: string;
  description?: string | null;
  is_default_visible: boolean;
  source_type: string;
  source_url?: string | null;
}

export interface MapLayerListResponse {
  items: MapLayerItem[];
}

export interface GeoJsonFeature {
  type: "Feature";
  id: number;
  geometry: Record<string, unknown>;
  properties: Record<string, unknown>;
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}


export interface UploadLayerResponse {
  message: string;
  layer_slug: string;
  feature_count: number;
  bounds: [number, number, number, number];
}

export interface MapFeatureDetailResponse {
  id: number;
  title: string;
  summary: string;
  related_interventions: string[];
  related_resources: string[];
  site_slug?: string | null;
  attributes?: Record<string, unknown>;
  metadata_note?: string | null;
}