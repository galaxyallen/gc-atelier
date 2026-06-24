import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountPageClient from "@/components/account/AccountPageClient";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "customer") {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      company: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          subtotal: true,
          shipping: true,
          paymentStatus: true,
          orderStatus: true,
          trackingNo: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: { select: { name: true, sku: true } },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return <AccountPageClient initialUser={user} />;
}
