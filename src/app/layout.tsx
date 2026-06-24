import type { Metadata } from "next";
import "./globals.css";
import "@/styles/prototype.css";
import "@/styles/prototype-fixes.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "GC ATELIER — Design Studio",
  description:
    "A Guangzhou-based design atelier bridging residential environments and consumer product development.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
