import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CheckoutCustomer } from "./create-pending-order";

export async function resolveCheckoutCustomer(body?: {
  email?: string;
  name?: string;
  phone?: string;
}): Promise<{ customer: CheckoutCustomer; customerId: string }> {
  const session = await getServerSession(authOptions);

  if (session?.user?.userType === "customer" && session.user.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.status !== "ACTIVE") {
      throw new Error("Unauthorized");
    }
    return {
      customerId: user.id,
      customer: {
        email: user.email,
        name: user.name,
        phone: user.phone ?? undefined,
      },
    };
  }

  const email = body?.email?.trim().toLowerCase();
  const name = body?.name?.trim();
  if (!email || !name) {
    throw new Error("Please sign in to checkout");
  }

  return {
    customerId: "",
    customer: {
      email,
      name,
      phone: body?.phone?.trim() || undefined,
    },
  };
}
