import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/projects/ProjectForm";

type PageProps = { params: { id: string } };

export default async function EditProjectPage({ params }: PageProps) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
          ← Back to projects
        </Link>
        <h1 className="font-display text-3xl font-light">Edit project</h1>
        <p className="text-fg-3 text-sm mt-1">{project.name}</p>
      </div>
      <ProjectForm
        initial={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          category: project.category,
          year: project.year,
          location: project.location ?? "",
          client: project.client ?? "",
          scope: project.scope ?? "",
          brief: project.brief ?? "",
          approach: project.approach ?? "",
          image: project.image ?? "",
          gallery: project.gallery,
          details: project.details,
          quote: project.quote ?? "",
          isHero: project.isHero,
          status: project.status,
          sortOrder: project.sortOrder,
        }}
      />
    </div>
  );
}
