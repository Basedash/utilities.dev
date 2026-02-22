/**
 * Pure utilities for image alt text auditing in HTML snippets.
 * Flags missing, empty, and suspicious alt attributes.
 */

export type AltStatus = "ok" | "missing" | "empty" | "suspicious";

export interface ImageAltFinding {
  index: number;
  status: AltStatus;
  alt: string | null;
  src: string;
  message: string;
}

export interface ImageAltAuditResult {
  images: ImageAltFinding[];
  summary: {
    total: number;
    ok: number;
    missing: number;
    empty: number;
    suspicious: number;
  };
}

const IMG_TAG_REGEX = /<img(?:\s[^>]*)?>/gi;

const SUSPICIOUS_ALTS = [
  "image",
  "img",
  "photo",
  "picture",
  "graphic",
  "placeholder",
  "image of",
  "photo of",
  "picture of",
  "icon",
  "logo",
  "spacer",
  "1",
  "0",
];

function isSuspicious(alt: string): boolean {
  const normalized = alt.trim().toLowerCase();
  if (normalized.length <= 2) return true;
  return SUSPICIOUS_ALTS.some(
    (s) => normalized === s || normalized.startsWith(s + " ") || normalized === s + "s"
  );
}

/**
 * Audits img tags for alt text issues and returns findings with summary counts.
 */
export function auditImageAlt(html: string): ImageAltAuditResult {
  const images: ImageAltFinding[] = [];
  const summary = {
    total: 0,
    ok: 0,
    missing: 0,
    empty: 0,
    suspicious: 0,
  };

  const imgTags: { src: string; alt: string | null }[] = [];
  let m: RegExpExecArray | null;
  const imgRe = new RegExp(IMG_TAG_REGEX.source, "gi");
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const srcMatch = tag.match(/\ssrc\s*=\s*["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : "";
    const altMatch = tag.match(/\salt\s*=\s*["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : null;
    imgTags.push({ src, alt });
  }

  for (let i = 0; i < imgTags.length; i++) {
    const { src, alt } = imgTags[i];
    summary.total++;

    let status: AltStatus;
    let message: string;

    if (alt === null) {
      status = "missing";
      message = "Missing alt attribute";
      summary.missing++;
    } else if (alt.trim() === "") {
      status = "empty";
      message = "Empty alt (decorative image)";
      summary.empty++;
    } else if (isSuspicious(alt)) {
      status = "suspicious";
      message = `Suspicious alt: "${alt}"`;
      summary.suspicious++;
    } else {
      status = "ok";
      message = "Alt text present";
      summary.ok++;
    }

    images.push({
      index: i + 1,
      status,
      alt,
      src: src.length > 60 ? src.slice(0, 60) + "…" : src,
      message,
    });
  }

  return { images, summary };
}
