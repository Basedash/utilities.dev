import { Key } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "jwt-decoder",
  slug: "jwt-decoder",
  title: "JWT Decoder",
  description:
    "Decode and inspect JWT tokens with detailed header, payload, and signature information.",
  category: "Security",
  tags: ["jwt", "token", "decode", "authentication", "security", "json"],
  icon: Key,
  seo: {
    title: "JWT Decoder & Inspector | utilities.dev",
    description:
      "Free online JWT token decoder and inspector. Decode and examine JWT header, payload, and signature with detailed information and validation.",
  },
};

export default manifest;
