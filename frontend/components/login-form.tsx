"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);

  // 2. Estado para guardar resposta do backend
  const [errorMsg, setErrorMsg] = useState("");


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Zera na tentativa seguinte
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Isso impede que ele mude a URL pra api/auth/error e te devolve controle!
    });
    // Inspecione o retorno!
    if (res?.error) {
      // A string "error" contida aqui carregará o 'Senha ou email incorretos.' do arquivo route.js
      setErrorMsg(res.error);
    } else if (res?.ok) {
      // Já que desligamos o redirecionamento automático, fomos nós que precisamos fazer o "push" agora:
      window.location.href = "/sample";
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Entre em sua conta</CardTitle>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} {...props}>



            <FieldGroup>




              {/* login com google */}

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/sample" })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Google
                </Button>
              </Field>

              {/* separador */}
              <FieldSeparator>Ou continue com email e senha</FieldSeparator>

              {/* email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>

              {/* Adicione a mensagem de erro acima ou abaixo do campo de email! */}
              {errorMsg && (
                <div className="rounded bg-destructive/10 p-3 text-center text-sm text-destructive">
                  {errorMsg}
                </div>
              )}

              {/* login normal */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Entrando..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => signIn("google", { callbackUrl: "/sample" })}
                >
                  Cadastre-se
                </button>
              </FieldDescription>


            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
