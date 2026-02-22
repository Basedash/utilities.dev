import { describe, expect, test } from "vitest";
import { utilitiesById } from "@/lib/generated/utilities-index";
import { buildUtilityJsonLd } from "@/lib/utilities/metadata";

describe("buildUtilityJsonLd", () => {
  test("maps internal category ids to Schema.org applicationCategory", () => {
    const securityManifest = utilitiesById.get("jwt-decoder");
    expect(securityManifest).toBeDefined();

    const securityJsonLd = buildUtilityJsonLd(securityManifest!);
    const softwareNode = Array.isArray(securityJsonLd) ? securityJsonLd[0] : securityJsonLd;
    expect(softwareNode.applicationCategory).toBe("SecurityApplication");
  });

  test("keeps developer tool categories mapped to DeveloperApplication", () => {
    const webManifest = utilitiesById.get("http-status-codes");
    expect(webManifest).toBeDefined();

    const webJsonLd = buildUtilityJsonLd(webManifest!);
    const softwareNode = Array.isArray(webJsonLd) ? webJsonLd[0] : webJsonLd;
    expect(softwareNode.applicationCategory).toBe("DeveloperApplication");
  });
});
