import { buildUtilityMetadata } from "@/lib/utilities/metadata";
import manifest from "./manifest";

export const metadata = buildUtilityMetadata(manifest);

export default function Base64EncodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
