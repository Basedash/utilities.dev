import { Clock } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "cron-parser",
  slug: "cron-parser",
  title: "Cron Expression Parser",
  description:
    "Parse and understand cron expressions with human-readable descriptions and upcoming execution times.",
  category: "Development",
  tags: ["cron", "schedule", "parser", "time", "automation", "unix"],
  icon: Clock,
  seo: {
    title: "Cron Expression Parser & Generator | utilities.dev",
    description:
      "Free online cron expression parser and generator. Parse cron expressions into human-readable descriptions and see upcoming execution times with detailed syntax help.",
  },
};

export default manifest;
