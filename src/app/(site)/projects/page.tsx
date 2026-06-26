import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { getSiteGlobals } from "@/lib/site-settings.server";
import { serializeProjectsForClient } from "@/lib/serialize-for-client";
import ProjectsPageClient from "@/components/projects/ProjectsPageClient";
export const metadata = createMetadata({
  title: "Projects",
  description: "Portfolio of residential and product design projects by GC ATELIER.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, globals] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    }),
    getSiteGlobals(),
  ]);

  return (
    <Suspense>
      <ProjectsPageClient
        projects={serializeProjectsForClient(projects)}
        pageHeader={{
          label: globals.projectsLabel,
          title: globals.projectsTitle,
          countText: globals.projectsCountText,
        }}
      />
    </Suspense>
  );
}
