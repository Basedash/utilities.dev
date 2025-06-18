import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoding & Decoding Tool | utilities.dev",
  description:
    "Free online tool to encode and decode text using Base64 encoding. Simple, fast, and secure with instant results.",
};

export default function Base64EncodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
