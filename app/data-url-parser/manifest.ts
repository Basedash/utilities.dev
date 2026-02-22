import { FileInput } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "data-url-parser",
  slug: "data-url-parser",
  title: "Data URL Parser",
  description:
    "Parse data URLs to extract media type, charset, and decoded content. Inspect base64 and URL-encoded data inline.",
  category: "encoding-hashing",
  tags: ["data url", "base64", "parse", "inline", "data uri"],
  icon: FileInput,
  seo: {
    title: "Data URL Parser | utilities.dev",
    description:
      "Parse data URLs in your browser. Extract media type, decode base64 or URL-encoded content. All processing is local.",
  },
  content: {
    intro: "Parse data URLs to view media type, charset, and decoded content. Supports base64 and URL-encoded data.",
    trustNote:
      "Parsing runs entirely in your browser; data URLs are not sent to a server. Decoding is display-only, not verification.",
    howToSteps: [
      "Paste a data URL (data:...) into the input field.",
      "View parsed media type, charset, base64 flag, and decoded content.",
      "Copy any component or clear to start over.",
    ],
    about:
      "This tool helps you inspect data URLs used in HTML, CSS, or API responses. It decodes base64 and URL-encoded payloads for viewing. Binary data (e.g. images) is shown as raw bytes; text content is displayed as UTF-8.",
    useCases: [
      "Inspecting inline images or assets in HTML or CSS",
      "Debugging data URL payloads from APIs or webhooks",
      "Extracting and viewing embedded base64 content",
    ],
    faqs: [
      {
        question: "What is a data URL?",
        answer:
          "A data URL embeds data directly in a URL using the format data:[mediatype][;base64],<data>. It is commonly used for inline images, small assets, or embedding content in HTML and CSS.",
      },
      {
        question: "Is my data URL sent to a server?",
        answer:
          "No, parsing and decoding happen entirely in your browser. Your input is never transmitted.",
      },
      {
        question: "How does it handle binary data like images?",
        answer:
          "Base64 image data is decoded to bytes. For non-text media types, the decoded output may show raw bytes or replacement characters. The tool is best suited for text content.",
      },
      {
        question: "Why does base64 decoding fail for some data URLs?",
        answer:
          "Invalid base64 characters, incorrect padding, or corrupted data will cause decoding to fail. Ensure the data portion is valid base64 when the base64 flag is set.",
      },
    ],
  },
};

export default manifest;
