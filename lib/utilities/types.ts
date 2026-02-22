import type { LucideIcon } from "lucide-react";
import type { UtilityCategoryId } from "@/lib/utilities/categories";

export interface UtilitySeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface UtilityFaqItem {
  question: string;
  answer: string;
}

export interface UtilityPageContent {
  intro: string;
  trustNote: string;
  howToSteps: string[];
  about: string;
  useCases: string[];
  faqs: UtilityFaqItem[];
}

export interface UtilityManifest {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: UtilityCategoryId;
  tags: string[];
  icon: LucideIcon;
  seo?: UtilitySeoConfig;
  content: UtilityPageContent;
}
