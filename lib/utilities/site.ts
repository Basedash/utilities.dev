export const SITE_NAME = "utilities.dev";
export const DEFAULT_SITE_URL = "https://utilities.dev";

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return siteUrl.replace(/\/+$/, "");
}
