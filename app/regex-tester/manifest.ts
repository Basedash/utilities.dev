import { TestTube } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "regex-tester",
  slug: "regex-tester",
  title: "Regex Tester",
  description:
    "Test regular expressions with real-time matching, capture groups, and detailed results.",
  category: "Testing",
  tags: [
    "regex",
    "regular expression",
    "pattern",
    "match",
    "test",
    "validation",
  ],
  icon: TestTube,
  seo: {
    title: "Regex Tester & Validator | utilities.dev",
    description:
      "Free online regular expression tester and debugger. Test regex patterns, view matches, capture groups, and validate regular expressions with real-time feedback.",
  },
};

export default manifest;
