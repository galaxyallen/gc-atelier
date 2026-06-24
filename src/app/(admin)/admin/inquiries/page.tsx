import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Inquiries</h1>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Project type</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-fg-3">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
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
                    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
                      {inquiry.status}
                    </span>
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
