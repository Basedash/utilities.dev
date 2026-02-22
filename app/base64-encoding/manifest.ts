import { Code } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "base64-encoding",
  slug: "base64-encoding",
  title: "Base64 Encoding",
  description:
    "Encode and decode Base64 strings to safely move text and binary content through text-only systems.",
  category: "encoding-hashing",
  tags: ["encoding", "base64", "decode", "binary", "text"],
  icon: Code,
  seo: {
    title: "Base64 Encoder and Decoder | utilities.dev",
    description:
      "Convert text to and from Base64 in your browser. Useful for API payloads, data URLs, and quick token inspection during development.",
  },
  content: {
    intro: "Encode or decode Base64 instantly for API, token, and data URL workflows.",
    trustNote:
      "Processing happens locally in your browser; Base64 is reversible encoding, not encryption.",
    howToSteps: [
      "Paste plain text or a Base64 string into the input.",
      "Choose Encode or Decode to run the conversion.",
      "Copy the result and use it in your API, config, or debugging workflow.",
    ],
    about:
      "This tool helps you convert between raw text and Base64 when working with systems that accept text-only payloads. It is useful for debugging API requests, reading token segments, and handling data URLs without leaving your browser.",
    useCases: [
      "Preparing binary-like content for JSON or form payloads",
      "Decoding Base64 segments while debugging auth tokens",
      "Converting inline assets for data URL usage",
    ],
    faqs: [
      {
        question: "What is Base64 encoding used for?",
        answer:
          "Base64 encoding represents binary or text data as ASCII characters so it can be transported in text-only formats. Common examples include JSON payloads, email bodies, and data URLs.",
      },
      {
        question: "Is Base64 safe for passwords or secrets?",
        answer:
          "No, Base64 does not secure data because anyone can decode it. Use encryption and proper secret handling when you need confidentiality.",
      },
      {
        question: "Why does Base64 output end with '=' characters?",
        answer:
          "The '=' symbols are padding used to keep encoded output aligned to a multiple of four characters. Some Base64URL implementations omit padding, so output may differ by context.",
      },
      {
        question: "Can I encode and decode Unicode text or emoji with Base64?",
        answer:
          "Yes, as long as the text is handled as UTF-8 end to end. Mismatched character encodings across systems can produce unreadable decoded output.",
      },
    ],
  },
};

export default manifest;
