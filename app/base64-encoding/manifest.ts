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
  content: {
    intro: "Encode and decode text quickly with Base64.",
    trustNote: "Runs in your browser for quick, local transformations.",
    howToSteps: [
      "Paste the text you want to encode or decode.",
      "Click Encode or Decode based on your task.",
      "Copy the output or swap it back into input for another pass.",
    ],
    about:
      "Base64 converts binary-safe content into text-safe output that can be transmitted in systems that expect plain text. It is commonly used in APIs, tokens, and data URLs.",
    useCases: [
      "Encoding binary payloads for transport",
      "Inspecting or decoding token segments",
      "Working with data URLs in frontend code",
    ],
    faqs: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is an encoding format, not encryption. Anyone can decode it.",
      },
      {
        question: "Why does Base64 output look longer?",
        answer:
          "Base64 adds overhead, so encoded output is larger than the original input.",
      },
      {
        question: "Can I encode Unicode text?",
        answer:
          "Yes. This tool handles standard UTF-8 text and decodes it back correctly.",
      },
    ],
  },
};

export default manifest;
