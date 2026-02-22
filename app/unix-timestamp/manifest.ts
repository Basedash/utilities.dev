import { Timer } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "unix-timestamp",
  slug: "unix-timestamp",
  title: "Unix Timestamp Converter",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Support for seconds and milliseconds.",
  category: "Development",
  tags: ["unix", "timestamp", "epoch", "date", "time", "converter", "posix"],
  icon: Timer,
  seo: {
    title: "Unix Timestamp Converter | utilities.dev",
    description:
      "Free online tool to convert Unix timestamps to human-readable dates and vice versa. Support for milliseconds and various date formats.",
  },
};

export default manifest;
