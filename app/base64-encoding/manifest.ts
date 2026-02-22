import { Code } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "base64-encoding",
  slug: "base64-encoding",
  title: "Base64 Encoding",
  description:
    "Encode and decode text using Base64 encoding. Perfect for handling binary data in text format.",
  category: "Encoding",
  tags: ["encoding", "base64", "decode", "binary", "text"],
  icon: Code,
  seo: {
    title: "Base64 Encoding & Decoding Tool | utilities.dev",
    description:
      "Free online tool to encode and decode text using Base64 encoding. Simple, fast, and secure with instant results.",
  },
};

export default manifest;
