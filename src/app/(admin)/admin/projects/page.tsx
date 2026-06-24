import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryLabels } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="text-xs tracking-widest uppercase bg-sage text-bg px-6 py-3 hover:bg-sage-light transition-colors"
        >
          New project
        </Link>
      </div>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Year</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-fg-3">
                  No projects yet.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="hover:text-sage transition-colors"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-fg-2">
                    {categoryLabels[project.category] ?? project.category}
                  </td>
                  <td className="px-5 py-3 text-fg-2">{project.year}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-xs text-sage hover:text-sage-light"
                      >
                        Edit
                      </Link>
                      <DeleteButton endpoint={`/api/projects/${project.id}`} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
