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
    intervention_pathways: string[];
    mrv_readiness: string[];
    governance_financing: string[];
  };
  mini_map: MiniMapValue;
}