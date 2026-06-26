import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth-roles";
import AdminShell from "@/components/admin/layout/AdminShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Admin session error:", error);
    redirect("/admin/login?error=session");
  }

  if (!session || !isAdminRole(session.user.role)) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  return (
    <AdminShell role={session.user.role} userName={session.user.name}>
      {children}
    </AdminShell>
  );
}
