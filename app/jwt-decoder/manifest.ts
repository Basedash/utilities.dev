import { Key } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "jwt-decoder",
  slug: "jwt-decoder",
  title: "JWT Decoder",
  description:
    "Decode JWT tokens to inspect header and payload claims while debugging authentication flows.",
  category: "Security",
  tags: ["jwt", "token", "decode", "authentication", "security", "json"],
  icon: Key,
  seo: {
    title: "JWT Decoder and Inspector | utilities.dev",
    description:
      "Decode JWT tokens in your browser to inspect headers, claims, and timestamps. Useful for auth debugging without exposing data to external services.",
  },
  content: {
    intro: "Inspect JWT structure and claims quickly during authentication debugging.",
    trustNote:
      "Token parsing runs locally in your browser; decoding reveals claims but does not verify signature authenticity.",
    howToSteps: [
      "Paste a JWT string into the decoder input.",
      "Review decoded header and payload claims.",
      "Inspect time-based claims and copy fields for debugging or logs.",
    ],
    about:
      "This tool helps you inspect JWT claim data so you can debug authentication and authorization issues faster. It focuses on decoding and readability, and signature verification must still happen in your backend or identity layer.",
    useCases: [
      "Checking `exp`, `iat`, and `nbf` values during login debugging",
      "Inspecting claim payloads for role and scope troubleshooting",
      "Reviewing JWT headers for algorithm and key identifier details",
    ],
    faqs: [
      {
        question: "What does a JWT decoder do?",
        answer:
          "A JWT decoder parses token segments so you can read header and payload data in plain JSON form. It helps you inspect claims and metadata during auth troubleshooting.",
      },
      {
        question: "Does decoding a JWT verify its signature?",
        answer:
          "No, decoding only reads token contents. Signature validation requires the correct secret or public key and should be done by your auth backend.",
      },
      {
        question: "Why are JWT claims readable in plain text?",
        answer:
          "JWT payloads are Base64URL encoded by default, not encrypted, so claims are easy to decode. Do not place secrets in claims unless you are using additional encryption controls.",
      },
      {
        question: "Is it safe to paste production JWTs into a browser tool?",
        answer:
          "Only if your security policy allows it, because tokens can include sensitive identity and authorization details. Prefer sanitized or short-lived tokens for debugging whenever possible.",
      },
    ],
  },
};

export default manifest;
