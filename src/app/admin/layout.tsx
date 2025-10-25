import Navbar from "@/components/Admin/Navbar";
import { Metadata } from "next/types";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "UCS Agriculture Admin Dashboard",
  icons: {
    icon: "/icon.png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="p-4">{children}</main>
      <Toaster />
    </div>
  );
}
