import { Hash } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "crc32-checksum",
  slug: "crc32-checksum",
  title: "CRC32 Checksum",
  description:
    "Compute CRC32 checksums from text for error detection, ETags, and integrity verification.",
  category: "encoding-hashing",
  tags: ["crc32", "checksum", "integrity", "etag", "hash", "error-detection"],
  icon: Hash,
  seo: {
    title: "CRC32 Checksum Calculator | utilities.dev",
    description:
      "Compute CRC32 checksums from text in your browser. Useful for ETags, error detection, and quick integrity checks. Processing stays local.",
  },
  content: {
    intro:
      "Compute CRC32 checksums from text for ETags, error detection, and quick integrity verification.",
    trustNote:
      "Checksum computation runs locally in your browser. CRC32 is for error detection, not cryptographic security.",
    howToSteps: [
      "Enter or paste text into the input field.",
      "Click Compute to generate the CRC32 checksum.",
      "Copy the hex output for ETags, comparison, or verification.",
    ],
    about:
      "This tool computes CRC32 checksums, which are fast and deterministic. They are useful for ETags, detecting accidental data corruption, and quick content comparison. CRC32 is not a cryptographic hash and should not be used for security.",
    useCases: [
      "Generating ETag-like values for cache validation",
      "Quick integrity checks when comparing text or configs",
      "Error detection in non-critical data pipelines",
    ],
    faqs: [
      {
        question: "What is CRC32 and when should I use it?",
        answer:
          "CRC32 is a checksum algorithm that produces a 32-bit value from input data. Use it for error detection, ETags, or quick content comparison. It is not suitable for security or password hashing.",
      },
      {
        question: "Does this tool send my data to a server?",
        answer:
          "No. All computation runs locally in your browser. Your input never leaves your device.",
      },
      {
        question: "Is CRC32 the same as a cryptographic hash?",
        answer:
          "No. CRC32 is designed for error detection, not security. It can be reversed and is vulnerable to collisions. Use SHA-256 or similar for cryptographic purposes.",
      },
      {
        question: "Why might my CRC32 differ from another tool?",
        answer:
          "CRC32 output depends on exact input encoding (UTF-8 vs other) and byte order. Ensure both tools use the same encoding and input for matching results.",
      },
    ],
  },
};

export default manifest;
