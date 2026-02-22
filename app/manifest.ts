import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "utilities.dev",
    short_name: "utilities.dev",
    description: "Essential developer tools for everyday coding tasks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
