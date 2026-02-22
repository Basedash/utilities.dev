import { Hash } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "hash-generator",
  slug: "hash-generator",
  title: "Hash Generator",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text with browser-local processing.",
  category: "Encoding",
  tags: ["hash", "sha", "sha256", "checksum", "digest", "crypto"],
  icon: Hash,
  seo: {
    title: "Hash Generator | utilities.dev",
    description:
      "Generate SHA hashes from text in your browser. SHA-1, SHA-256, SHA-384, SHA-512. No data leaves your device.",
  },
  content: {
    intro: "Compute cryptographic hashes from text for checksums, integrity checks, and API signatures.",
    trustNote:
      "Hashing runs entirely in your browser; input is never sent to a server. Hashes are one-way and cannot be reversed to recover the original text.",
    howToSteps: [
      "Enter or paste text into the input field.",
      "Select SHA-1, SHA-256, SHA-384, or SHA-512 and click Hash.",
      "Copy the hex output or clear to start over.",
    ],
    about:
      "This tool helps you generate hash digests for file integrity checks, API signing, and password storage workflows. Hashes are deterministic: the same input always produces the same output.",
    useCases: [
      "Verifying file or string integrity with known hash values",
      "Generating HMAC or signature inputs for API authentication",
      "Creating deterministic identifiers from content for caching or deduplication",
    ],
    faqs: [
      {
        question: "What is a hash and when should I use one?",
        answer:
          "A hash is a fixed-size fingerprint of input data. Use hashes to verify integrity, compare content without storing originals, or prepare inputs for API signing.",
      },
      {
        question: "Does this tool send my data to a server?",
        answer:
          "No. All hashing happens in your browser using the Web Crypto API. Your input never leaves your device.",
      },
      {
        question: "Can I reverse a hash to get the original text?",
        answer:
          "No. Cryptographic hashes are one-way. You cannot recover the original input from the hash output.",
      },
      {
        question: "Why does my hash differ from another tool?",
        answer:
          "Hashes depend on exact input: encoding, whitespace, and line endings all change the result. Ensure both tools use the same encoding (usually UTF-8) and identical input.",
      },
    ],
  },
};

export default manifest;
