import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InquiryDetailForm from "@/components/admin/inquiries/InquiryDetailForm";

type PageProps = { params: { id: string } };

export default async function InquiryDetailPage({ params }: PageProps) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
  if (!inquiry) notFound();

  return (
    <InquiryDetailForm
      inquiry={{
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        company: inquiry.company,
        projectType: inquiry.projectType,
        budget: inquiry.budget,
        message: inquiry.message,
        status: inquiry.status,
        notes: inquiry.notes,
        createdAt: inquiry.createdAt.toISOString(),
        replies: inquiry.replies.map((r) => ({
          id: r.id,
          from: r.from,
          subject: r.subject,
          body: r.body,
          createdAt: r.createdAt.toISOString(),
        })),
      }}
    />
  );
}
