import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [inquiriesCount, ordersCount, productsCount, usersCount, recentInquiries] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.inquiry.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          projectType: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const stats = [
    { label: "Inquiries", value: inquiriesCount, href: "/admin/inquiries" },
    { label: "Orders", value: ordersCount, href: "/admin/orders" },
    { label: "Products", value: productsCount, href: "/admin/products" },
    { label: "Users", value: usersCount, href: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-bg-2 border border-border rounded-lg p-5 hover:border-sage-border transition-colors"
          >
            <p className="text-[11px] tracking-widest uppercase text-fg-3 mb-2">
              {stat.label}
            </p>
            <p className="font-display text-4xl font-light text-sage">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent inquiries</h2>
          <Link href="/admin/inquiries" className="text-xs text-sage hover:text-sage-light">
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Type</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentInquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-fg-3">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="hover:text-sage transition-colors"
                    >
                      {inquiry.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-fg-2">{inquiry.email}</td>
                  <td className="px-5 py-3 text-fg-2">{inquiry.projectType || "—"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={inquiry.status} />
                  </td>
                  <td className="px-5 py-3 text-fg-3">
                    {inquiry.createdAt.toLocaleDateString()}
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

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
      {status}
    </span>
  );
}
