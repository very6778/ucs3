import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "About Us",
  description: "About UCS Agriculture",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}