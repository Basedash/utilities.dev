import { buildUtilityMetadata } from "@/lib/utilities/metadata";
import manifest from "./manifest";

export const metadata = buildUtilityMetadata(manifest);

export default function MarkdownViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
