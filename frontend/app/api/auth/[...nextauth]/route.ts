import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    // Login via Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Login via usuário e senha backend
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Envie o POST para o seu backend para validar login e senha 
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          if (res.ok) {
            const user = await res.json();
            return user; // Se deu certo, ele será salvo na sessão do NextAuth e redirecionado p/ a rota privada 
          } else {
            // Caso res.ok seja falso (erros 401, 400, etc), pegue o detalhe da resposta 
            // e dispare um Erro nativo com essa string
            const errorData = await res.json();
            throw new Error(errorData.detail || "Erro de login");
          }
        } catch (e) {
          // Repassa o erro exatamente como o backend devolveu para aparecer no Frontend
          throw new Error(e.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user é o objeto retornado no authorize()
        const u = user as any;
        token.accessToken = u.token || u.access || u.access_token;
        token.id = u.id || u.user_id;
      }
      return token;
    },
    async session({ session, token }) {
      // Repassa os dados persistidos no token JWT para a sessão do cliente
      (session as any).accessToken = token.accessToken;
      (session.user as any).id = token.id;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {

        try {
          // Verificar se a conta google já é cadastrada via fetch usando GET
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/check-email?email=" + user.email);
          const data = await res.json();

          //Se existir API devolve {"exists = true"}

          if (data.exists) {
            return true;
          } else {
            // Se não existir, cria o usuário passando os dados via query params
            const urlParams = new URLSearchParams({
              name: user.name || '',
              email: user.email || '',
              image: user.image || '',
            });
            return `/signup?${urlParams.toString()}`;
          }
        } catch (error) {
          console.error("Erro ao conferir e-mail: ", error)
          return false; //Bloqueia logine  mostra a tela de erro
        }

      }

      // Se for login normal via Credentials, deixa continuar (retorna true)
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
