import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // proíbe acesso a todas as páginas da aplicação (ex: /sample) 
  // EXCETO as rotas que estão aqui dentro (api, login, signup e arquivos estáticos)
  matcher: ["/((?!^$|login|signup|api|_next/static|_next/image|favicon.ico).*)"],
};
