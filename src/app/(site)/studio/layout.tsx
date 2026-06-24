import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Studio",
  description: "The GC ATELIER studio — design philosophy, capabilities, and milestones in Guangzhou.",
  path: "/studio",
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
