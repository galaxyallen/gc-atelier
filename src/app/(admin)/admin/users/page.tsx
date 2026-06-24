import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Users</h1>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Company</th>
              <th className="px-5 py-3 font-normal">Orders</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-fg-3">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{user.name}</td>
                  <td className="px-5 py-3 text-fg-2">{user.email}</td>
                  <td className="px-5 py-3 text-fg-2">{user.company || "—"}</td>
                  <td className="px-5 py-3 text-fg-2">{user._count.orders}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-fg-3">
                    {user.createdAt.toLocaleDateString()}
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
