/**
 * Parsed semver components.
 */
export interface SemverParts {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
  build: string[];
}

/**
 * Result of comparing two semver strings.
 */
export type CompareResult = "newer" | "older" | "equal" | "invalid";

/**
 * Semver 2.0 regex for parsing version strings.
 * Supports: major.minor.patch[-prerelease][+build]
 */
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)))?(?:\+([0-9A-Za-z.-]+))?$/;

/**
 * Parses a semver string into structured parts.
 * Returns null for invalid input.
 */
export function parseSemver(input: string): SemverParts | null {
  if (typeof input !== "string" || !input.trim()) {
    return null;
  }

  const trimmed = input.trim();
  const match = trimmed.match(SEMVER_REGEX);
  if (!match) {
    return null;
  }

  const [, majorStr, minorStr, patchStr, prereleaseStr, buildStr] = match;
  const prerelease = prereleaseStr ? prereleaseStr.split(".") : [];
  const build = buildStr ? buildStr.split(".") : [];

  return {
    major: parseInt(majorStr!, 10),
    minor: parseInt(minorStr!, 10),
    patch: parseInt(patchStr!, 10),
    prerelease,
    build,
  };
}

/**
 * Compares two prerelease identifier arrays per semver 2.0.
 * Returns: negative if a < b, positive if a > b, 0 if equal.
 */
function comparePrerelease(a: string[], b: string[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i];
    const bv = b[i];

    if (av === undefined) return 1; // a has fewer parts, a is newer (e.g. 1.0.0 > 1.0.0-alpha)
    if (bv === undefined) return -1; // b has fewer parts, b is newer

    const aNum = /^\d+$/.test(av) ? parseInt(av, 10) : NaN;
    const bNum = /^\d+$/.test(bv) ? parseInt(bv, 10) : NaN;

    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      if (aNum !== bNum) return aNum - bNum;
    } else if (Number.isNaN(aNum) && Number.isNaN(bNum)) {
      const cmp = av.localeCompare(bv, "en");
      if (cmp !== 0) return cmp;
    } else {
      // numeric identifiers have lower precedence than alphanumeric
      return Number.isNaN(aNum) ? 1 : -1;
    }
  }
  return 0;
}

/**
 * Compares two semver strings.
 * Returns "newer" if a > b, "older" if a < b, "equal" if a === b, "invalid" if either is invalid.
 */
export function compareSemver(a: string, b: string): CompareResult {
  const parsedA = parseSemver(a);
  const parsedB = parseSemver(b);

  if (!parsedA || !parsedB) {
    return "invalid";
  }

  const { major: ma, minor: mia, patch: pa, prerelease: preA } = parsedA;
  const { major: mb, minor: mib, patch: pb, prerelease: preB } = parsedB;

  if (ma !== mb) return ma > mb ? "newer" : "older";
  if (mia !== mib) return mia > mib ? "newer" : "older";
  if (pa !== pb) return pa > pb ? "newer" : "older";

  // Same major.minor.patch: compare prerelease
  if (preA.length === 0 && preB.length === 0) return "equal";
  if (preA.length === 0) return "newer"; // 1.0.0 > 1.0.0-alpha
  if (preB.length === 0) return "older"; // 1.0.0-alpha < 1.0.0

  const cmp = comparePrerelease(preA, preB);
  if (cmp > 0) return "newer";
  if (cmp < 0) return "older";
  return "equal";
}
