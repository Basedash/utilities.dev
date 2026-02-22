import { describe, test, expect } from "vitest";
import { parseSemver, compareSemver } from "./utils";

describe("parseSemver", () => {
  test("parses basic semver", () => {
    expect(parseSemver("1.2.3")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: [],
      build: [],
    });
  });

  test("parses with prerelease", () => {
    expect(parseSemver("1.0.0-alpha")).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ["alpha"],
      build: [],
    });
    expect(parseSemver("1.0.0-alpha.1")).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ["alpha", "1"],
      build: [],
    });
  });

  test("parses with build metadata", () => {
    expect(parseSemver("1.0.0+build.123")).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: [],
      build: ["build", "123"],
    });
    expect(parseSemver("1.0.0-alpha+build")).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ["alpha"],
      build: ["build"],
    });
  });

  test("rejects invalid semver", () => {
    expect(parseSemver("")).toBeNull();
    expect(parseSemver("   ")).toBeNull();
    expect(parseSemver("1.2")).toBeNull();
    expect(parseSemver("1.2.3.4")).toBeNull();
    expect(parseSemver("v1.2.3")).toBeNull();
    expect(parseSemver("1.2.3-beta")).toBeTruthy(); // valid with prerelease
    expect(parseSemver("01.2.3")).toBeNull(); // leading zero invalid
    expect(parseSemver("1.02.3")).toBeNull();
    expect(parseSemver("1.2.03")).toBeNull();
  });

  test("handles non-string input", () => {
    expect(parseSemver(123 as unknown as string)).toBeNull();
    expect(parseSemver(null as unknown as string)).toBeNull();
  });

  test("trims whitespace", () => {
    expect(parseSemver("  1.2.3  ")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: [],
      build: [],
    });
  });
});

describe("compareSemver", () => {
  test("newer: higher major", () => {
    expect(compareSemver("2.0.0", "1.9.9")).toBe("newer");
    expect(compareSemver("1.0.0", "2.0.0")).toBe("older");
  });

  test("newer: higher minor", () => {
    expect(compareSemver("1.3.0", "1.2.9")).toBe("newer");
    expect(compareSemver("1.2.0", "1.3.0")).toBe("older");
  });

  test("newer: higher patch", () => {
    expect(compareSemver("1.2.4", "1.2.3")).toBe("newer");
    expect(compareSemver("1.2.3", "1.2.4")).toBe("older");
  });

  test("equal: same version", () => {
    expect(compareSemver("1.2.3", "1.2.3")).toBe("equal");
    expect(compareSemver("0.0.0", "0.0.0")).toBe("equal");
  });

  test("prerelease: release > prerelease", () => {
    expect(compareSemver("1.0.0", "1.0.0-alpha")).toBe("newer");
    expect(compareSemver("1.0.0-alpha", "1.0.0")).toBe("older");
  });

  test("prerelease: compare prerelease identifiers", () => {
    expect(compareSemver("1.0.0-beta", "1.0.0-alpha")).toBe("newer");
    expect(compareSemver("1.0.0-alpha", "1.0.0-beta")).toBe("older");
    expect(compareSemver("1.0.0-alpha.2", "1.0.0-alpha.1")).toBe("newer");
    expect(compareSemver("1.0.0-alpha.1", "1.0.0-alpha.2")).toBe("older");
  });

  test("prerelease: numeric vs alphanumeric", () => {
    expect(compareSemver("1.0.0-alpha.1", "1.0.0-alpha.beta")).toBe("older");
    expect(compareSemver("1.0.0-alpha.beta", "1.0.0-alpha.1")).toBe("newer");
  });

  test("invalid input returns invalid", () => {
    expect(compareSemver("invalid", "1.2.3")).toBe("invalid");
    expect(compareSemver("1.2.3", "invalid")).toBe("invalid");
    expect(compareSemver("", "1.2.3")).toBe("invalid");
    expect(compareSemver("1.2.3", "")).toBe("invalid");
  });

  test("build metadata is ignored for comparison", () => {
    expect(compareSemver("1.2.3+build1", "1.2.3+build2")).toBe("equal");
    expect(compareSemver("1.2.3", "1.2.3+meta")).toBe("equal");
  });
});
