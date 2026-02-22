import type { UtilityManifest } from "@/lib/utilities/types";

interface UtilityPageHeroProps {
  manifest: UtilityManifest;
}

export function UtilityPageHero({ manifest }: UtilityPageHeroProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-2">{manifest.title}</h1>
      <p className="text-muted-foreground text-lg">{manifest.content.intro}</p>
      <p className="text-sm text-muted-foreground mt-2">{manifest.content.trustNote}</p>
    </div>
  );
}
