export interface RiskItem {
  title: string;
  description: string;
}

export interface KeyValueItem {
  label: string;
  value: string;
}

export interface MiniMapValue {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface TextBlockItem {
  title: string;
  description: string;
}
export type SiteLinkType = "resource" | "external" | "map";

export interface SiteLinkItem {
  type?: SiteLinkType;
  label: string;
  href?: string;
  description?: string;

  resource_slug?: string;
  category?: string;
  file_url?: string | null;
  external_url?: string | null;
}

export interface HomeStatItem {
  label: string;
  value: string;
}
export interface SiteFormData {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  hero_image_url: string;
  quick_stats: KeyValueItem[];
  sections: {
    site_overview: string;
    pressures_and_risks: RiskItem[];
    intervention_pathways: TextBlockItem[];
    mrv_readiness: TextBlockItem[];
    governance_financing: TextBlockItem[];
    downloads_and_links: SiteLinkItem[];
  };
  mini_map: MiniMapValue;
}

export interface InterventionFormData {
  slug: string;
  title: string;
  summary: string;
  description: string;
  ecosystem: string;
  type: string;
  objective: string;
  project_stage: string;
  tags: string[];
}

export interface ResourceFormData {
  slug: string;
  title: string;
  summary: string;
  category: string;
  file_url: string;
  external_url: string;
  published_date: string;
}

export interface GisUploadResult {
  message: string;
  layer_slug: string;
  feature_count: number;
  bounds: [number, number, number, number];
}

export interface HomeCtaItem {
  label: string;
  href: string;
}

export interface HomeConfigFormData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primary_cta: HomeCtaItem;
    secondary_cta: HomeCtaItem;
  };
  stats: HomeStatItem[];
  quick_links: HomeCtaItem[];
  featured_intervention_slugs: string[];
  featured_resource_slugs: string[];
}

export interface OptionItem {
  label: string;
  value: string;
  summary?: string;
  category?: string;
  ecosystem?: string;
  type?: string;
  objective?: string;
  project_stage?: string;
  source_type?: string;
  file_url?: string | null;
  external_url?: string | null;
}

export interface OptionListResponse {
  items: OptionItem[];
}

export interface ClassificationOptions {
  ecosystems: string[];
  intervention_types: string[];
  objectives: string[];
  project_stages: string[];
  resource_categories: string[];
}
