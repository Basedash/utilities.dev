import { describe, expect, test } from "vitest";
import { utilitiesById } from "@/lib/generated/utilities-index";
import { buildUtilityJsonLd } from "@/lib/utilities/metadata";

describe("buildUtilityJsonLd", () => {
  type SoftwareApplicationNode = {
    "@type": "SoftwareApplication";
    applicationCategory: string;
  };

  function getSoftwareApplicationNode(
    node: ReturnType<typeof buildUtilityJsonLd>
  ): SoftwareApplicationNode {
    const candidate = Array.isArray(node)
      ? node.find((entry) => entry["@type"] === "SoftwareApplication")
      : node;

    if (!candidate || candidate["@type"] !== "SoftwareApplication") {
      throw new Error("Expected SoftwareApplication JSON-LD node");
    }

    return candidate as SoftwareApplicationNode;
  }

  test("maps internal category ids to Schema.org applicationCategory", () => {
    const securityManifest = utilitiesById.get("jwt-decoder");
    expect(securityManifest).toBeDefined();

    const securityJsonLd = buildUtilityJsonLd(securityManifest!);
    const softwareNode = getSoftwareApplicationNode(securityJsonLd);
    expect(softwareNode.applicationCategory).toBe("SecurityApplication");
  });

  test("keeps developer tool categories mapped to DeveloperApplication", () => {
    const webManifest = utilitiesById.get("http-status-codes");
    expect(webManifest).toBeDefined();

    const webJsonLd = buildUtilityJsonLd(webManifest!);
    const softwareNode = getSoftwareApplicationNode(webJsonLd);
    expect(softwareNode.applicationCategory).toBe("DeveloperApplication");
  });
});
