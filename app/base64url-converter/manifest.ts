import { Code } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "base64url-converter",
  slug: "base64url-converter",
  title: "Base64URL Converter",
  description:
    "Encode and decode Base64URL strings for URLs, JWTs, and token-safe transport without padding or special characters.",
  category: "encoding-hashing",
  tags: ["base64url", "encoding", "jwt", "url-safe", "decode", "token"],
  icon: Code,
  seo: {
    title: "Base64URL Encoder and Decoder | utilities.dev",
    description:
      "Convert text to and from Base64URL in your browser. URL-safe encoding for JWTs, OAuth, and APIs. No padding, no special chars.",
  },
  content: {
    intro:
      "Encode or decode Base64URL instantly for JWT segments, OAuth tokens, and URL-safe payloads.",
    trustNote:
      "Processing happens locally in your browser; Base64URL is reversible encoding, not encryption.",
    howToSteps: [
      "Paste plain text or a Base64URL string into the input.",
      "Choose Encode or Decode to run the conversion.",
      "Copy the result for use in tokens, URLs, or API payloads.",
    ],
    about:
      "This tool converts between raw text and Base64URL, which uses - and _ instead of + and / and omits padding. It is useful for JWT segments, OAuth state parameters, and any context where standard Base64 characters are unsafe in URLs.",
    useCases: [
      "Encoding JWT header or payload segments for manual token assembly",
      "Decoding Base64URL segments while debugging OAuth or auth flows",
      "Converting data for URL-safe transport in query params or paths",
    ],
    faqs: [
      {
        question: "What is Base64URL and when should I use it?",
        answer:
          "Base64URL is a URL-safe variant of Base64 that replaces + with - and / with _, and omits padding. Use it when encoding data for URLs, JWTs, or OAuth tokens where standard Base64 characters could cause issues.",
      },
      {
        question: "Does this tool send my data to a server?",
        answer:
          "No. All encoding and decoding runs locally in your browser. Your input never leaves your device.",
      },
      {
        question: "Why does Base64URL omit padding?",
        answer:
          "Padding (=) can interfere with URL parsing and is often omitted in JWT and OAuth specs. Decoders typically add padding as needed before decoding.",
      },
      {
        question: "Can I use Base64URL for secrets or passwords?",
        answer:
          "Base64URL is encoding, not encryption. Anyone can decode it. Do not use it to protect sensitive data; use proper encryption and secret management instead.",
      },
    ],
  },
};

export default manifest;
