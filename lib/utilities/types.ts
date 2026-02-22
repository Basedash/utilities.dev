import type { LucideIcon } from "lucide-react";

export interface UtilitySeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface UtilityManifest {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  icon: LucideIcon;
  seo?: UtilitySeoConfig;
}
