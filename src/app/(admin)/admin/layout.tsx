import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth-roles";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminRole(session.user.role)) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  return (
    <AdminShell role={session.user.role} userName={session.user.name}>
      {children}
    </AdminShell>
  );
}
