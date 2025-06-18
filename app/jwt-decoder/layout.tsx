import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder & Inspector | utilities.dev",
  description:
    "Free online JWT token decoder and inspector. Decode and examine JWT header, payload, and signature with detailed information and validation.",
};

export default function JwtDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
