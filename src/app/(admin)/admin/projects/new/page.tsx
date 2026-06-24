import Link from "next/link";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
          ← Back to projects
        </Link>
        <h1 className="font-display text-3xl font-light">New project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
