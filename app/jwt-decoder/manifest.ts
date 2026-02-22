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
  content: {
    intro: "Decode JWT header, payload, and signature details instantly.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste a JWT token into the input box.",
      "Inspect decoded header and payload claims.",
      "Check expiration timestamps and copy fields as needed.",
    ],
    about:
      "JWT Decoder helps you inspect token structure and claim values while debugging authentication flows. It decodes tokens locally and does not verify signatures.",
    useCases: [
      "Debugging auth flows during development",
      "Inspecting exp, iat, and nbf claims",
      "Reviewing token payload content quickly",
    ],
    faqs: [
      {
        question: "Does this verify token signatures?",
        answer:
          "No. It decodes JWT segments but does not validate signatures against a secret or public key.",
      },
      {
        question: "Should I paste production tokens here?",
        answer:
          "Avoid pasting sensitive production credentials in any browser tool unless your policy allows it.",
      },
      {
        question: "Why is a JWT readable?",
        answer:
          "JWT payloads are Base64URL encoded, not encrypted, unless additional encryption is used.",
      },
    ],
  },
};

export default manifest;
