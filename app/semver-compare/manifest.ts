import { GitCompare } from "lucide-react";
import type { UtilityManifest } from "@/lib/utilities/types";

const manifest: UtilityManifest = {
  id: "semver-compare",
  slug: "semver-compare",
  title: "Semver Compare",
  description:
    "Compare two semantic version strings and determine which is newer, older, or equal.",
  category: "dev-productivity",
  tags: ["semver", "version", "compare", "semantic", "release"],
  icon: GitCompare,
  seo: {
    title: "Semver Compare | utilities.dev",
    description:
      "Compare semantic version strings in your browser. See which version is newer, older, or equal. Supports prerelease and build metadata.",
  },
  content: {
    intro: "Compare two semver strings to see which version is newer or older.",
    trustNote:
      "Comparison runs in your browser; invalid semver input is reported locally and never sent elsewhere.",
    howToSteps: [
      "Enter two version strings (e.g. 1.2.3 and 2.0.0) into the inputs.",
      "Review the comparison result: newer, older, or equal.",
      "Copy the result or use it to decide upgrade paths and dependency ranges.",
    ],
    about:
      "This tool helps you quickly compare semantic versions when choosing upgrades, validating dependency ranges, or debugging version conflicts. It follows the semver 2.0 spec for major.minor.patch and optional prerelease/build metadata.",
    useCases: [
      "Checking if a dependency version satisfies a required minimum",
      "Deciding upgrade order when multiple packages have new releases",
      "Validating version strings before publishing or tagging",
    ],
    faqs: [
      {
        question: "What is semantic versioning and how does comparison work?",
        answer:
          "Semantic versioning uses major.minor.patch (e.g. 1.2.3). Comparison compares major first, then minor, then patch. Prerelease tags (e.g. 1.0.0-alpha) sort before the release version.",
      },
      {
        question: "Does this tool send my version strings to a server?",
        answer:
          "No, all comparison runs in your browser. Your input stays on your device.",
      },
      {
        question: "Does it support prerelease and build metadata?",
        answer:
          "Yes, prerelease identifiers (e.g. alpha, beta, rc) and build metadata are parsed and compared according to semver 2.0 rules. Build metadata is ignored for comparison.",
      },
      {
        question: "What happens if I enter invalid version strings?",
        answer:
          "The tool reports invalid input and does not produce a comparison. Fix the format to match semver (e.g. 1.2.3) and try again.",
      },
    ],
  },
};

export default manifest;
