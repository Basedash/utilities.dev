import { JsonLd } from "@/components/seo/json-ld";
import { buildUtilityJsonLd, buildUtilityMetadata } from "@/lib/utilities/metadata";
import manifest from "./manifest";

export const metadata = buildUtilityMetadata(manifest);

export default function TableA11yCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildUtilityJsonLd(manifest)} />
      {children}
    </>
  );
}
