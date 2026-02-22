import { Key } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "hmac-generator",
  slug: "hmac-generator",
  title: "HMAC Generator",
  description:
    "Generate HMAC signatures for messages and secrets using SHA-1, SHA-256, SHA-384, or SHA-512.",
  category: "Encoding",
  tags: ["hmac", "signature", "crypto", "sha256", "authentication"],
  icon: Key,
  seo: {
    title: "HMAC Generator | utilities.dev",
    description:
      "Generate HMAC-SHA signatures in your browser. Supports SHA-1, SHA-256, SHA-384, SHA-512. Local processing, hex output.",
  },
  content: {
    intro:
      "Generate HMAC signatures for messages and secrets using common hash algorithms.",
    trustNote:
      "Processing happens locally in your browser. HMAC verifies integrity and authenticity only when the shared secret is kept secure.",
    howToSteps: [
      "Enter your message and secret key in the input fields.",
      "Select an algorithm (SHA-1, SHA-256, SHA-384, or SHA-512) and click Generate.",
      "Copy the hex signature for use in APIs, webhooks, or verification workflows.",
    ],
    about:
      "This tool helps you compute HMAC signatures when building or debugging APIs, webhooks, and signed payloads. Security depends on keeping the secret key protected; anyone with the secret can produce valid signatures.",
    useCases: [
      "Signing webhook payloads for API verification",
      "Generating request signatures for AWS or similar APIs",
      "Debugging HMAC-based auth in development",
    ],
    faqs: [
      {
        question: "What is HMAC used for?",
        answer:
          "HMAC (Hash-based Message Authentication Code) proves that a message was created by someone who knows the secret key and that the message was not altered. It is commonly used for API signatures, webhook verification, and signed tokens.",
      },
      {
        question: "Does this tool store or send my secret anywhere?",
        answer:
          "No. All HMAC computation runs locally in your browser. Your message and secret never leave your device.",
      },
      {
        question: "Which HMAC algorithm should I use?",
        answer:
          "Use SHA-256 or SHA-512 for new work; SHA-1 is weaker and mainly for legacy compatibility. Match the algorithm your API or system expects.",
      },
      {
        question: "Why does my HMAC differ from another tool?",
        answer:
          "Ensure message and secret match exactly, including whitespace and encoding. Output is lowercase hex; some tools use uppercase or Base64.",
      },
    ],
  },
};

export default manifest;
