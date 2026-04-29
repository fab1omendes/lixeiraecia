import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/purchases/:path*",
    "/painel/:path*",
  ],
};
