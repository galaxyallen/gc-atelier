import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth-roles";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin/settings") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin/users") && role === "SALES") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === "/admin/login") return true;
        if (token?.userType === "admin") return true;
        // Legacy JWTs before userType was added to the token
        return isAdminRole(token?.role as string | undefined);
      },
    },
    pages: { signIn: "/admin/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
