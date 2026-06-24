import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  children,
  role,
  userName,
}: {
  children: React.ReactNode;
  role: string;
  userName: string;
}) {
  return (
    <div className="min-h-screen bg-bg flex admin-shell">
      <AdminSidebar role={role} userName={userName} />
      <div className="flex-1 min-w-0 min-h-screen">
        <main className="overflow-auto min-h-screen">
          <div className="p-8 max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
