import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

import { isAdminRole } from "./auth-roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      userType: "admin" | "customer";
    };
  }
  interface User {
    role: string;
    userType?: "admin" | "customer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    name?: string;
    userType?: "admin" | "customer";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const loginType = credentials.loginType === "admin" ? "admin" : "customer";

        try {
          if (loginType === "admin") {
            const admin = await prisma.adminUser.findUnique({ where: { email } });
            if (!admin) return null;
            const valid = await bcrypt.compare(credentials.password, admin.password);
            if (!valid) return null;
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
              userType: "admin" as const,
            };
          }

          const customer = await prisma.user.findUnique({ where: { email } });
          if (!customer || customer.status !== "ACTIVE" || !customer.password) {
            return null;
          }

          const valid = await bcrypt.compare(credentials.password, customer.password);
          if (!valid) return null;

          await prisma.user.update({
            where: { id: customer.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: "CUSTOMER",
            userType: "customer" as const,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name ?? undefined;
        token.userType = user.userType ?? (isAdminRole(user.role) ? "admin" : "customer");
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
        session.user.userType =
          (token.userType as "admin" | "customer") ??
          (isAdminRole(token.role as string) ? "admin" : "customer");
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};
