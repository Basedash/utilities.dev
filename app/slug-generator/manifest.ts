import { Link } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "slug-generator",
  slug: "slug-generator",
  title: "Slug Generator",
  description:
    "Generate URL-friendly slugs from text with lowercase, hyphenation, and optional diacritic removal.",
  category: "web-http",
  tags: ["slug", "url", "seo", "friendly", "permalink"],
  icon: Link,
  seo: {
    title: "Slug Generator | utilities.dev",
    description:
      "Convert titles and text into URL-friendly slugs in your browser. Lowercase, hyphenate, and optionally strip diacritics for clean permalinks.",
  },
  content: {
    intro: "Convert titles and text into clean, URL-friendly slugs for permalinks and routes.",
    trustNote:
      "Slug generation runs in your browser; output is suitable for URLs but does not guarantee uniqueness or SEO ranking.",
    howToSteps: [
      "Paste or type the text you want to convert (e.g. a blog title or heading).",
      "Choose options like lowercase and diacritic removal if needed.",
      "Copy the generated slug and use it in URLs, routes, or filenames.",
    ],
    about:
      "This tool helps you create readable, URL-safe slugs from arbitrary text by lowercasing, replacing spaces with hyphens, and optionally normalizing accented characters. It is useful for blog permalinks, route segments, and SEO-friendly identifiers.",
    useCases: [
      "Generating permalinks from blog post or page titles",
      "Creating URL segments for dynamic routes in web apps",
      "Normalizing filenames or identifiers for static sites",
    ],
    faqs: [
      {
        question: "What is a URL slug?",
        answer:
          "A slug is the human-readable part of a URL path, usually derived from a title. For example, 'my-blog-post' is the slug in /articles/my-blog-post.",
      },
      {
        question: "Does this tool send my text to a server?",
        answer:
          "No, slug generation runs entirely in your browser. Your input never leaves your device.",
      },
      {
        question: "How does diacritic removal work?",
        answer:
          "When enabled, accented characters (e.g. é, ñ, ü) are converted to their ASCII equivalents (e, n, u). This keeps slugs readable while avoiding encoding issues in URLs.",
      },
      {
        question: "Why does my slug have multiple hyphens?",
        answer:
          "Consecutive spaces and punctuation are collapsed into single hyphens automatically. If separators still look unexpected, check for unsupported symbols that are removed during normalization.",
      },
    ],
  },
};

export default manifest;
