"use client";
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
  FieldContent,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MaskedInput } from "@/components/ui/masked-input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar";
import { useSignup } from "@/hooks/use-signup";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";



export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  // Hook de signup
  const { handleSubmit, loading } = useSignup();

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "A senha deve ter no mínimo 8 caracteres."
    if (!/[A-Z]/.test(pwd)) return "A senha deve conter pelo menos uma letra maiúscula."
    if (!/[0-9]/.test(pwd)) return "A senha deve conter pelo menos um número."
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "A senha deve conter pelo menos um caractere especial."
    return null
  }

  const searchParams = useSearchParams();
  const DefaultAvatar = searchParams.get('image');
  const DefaultName = searchParams.get('name');
  const DefaultEmail = searchParams.get('email');


  const [userType, setUserType] = useState("pf");

  // Criamos este wrapper local apenas para injetar o "date" (que é um state) pra dentro do helper do form
  const onSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      passwordRef.current?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      confirmPasswordRef.current?.focus();
      return;
    }

    const formattedDate = date ? date.toISOString().split('T')[0] : null;
    handleSubmit(e, {
      birthDate: formattedDate,
      user_type: userType
    });
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie uma conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitWrapper}>

          <input type="hidden" name="avatar" value={DefaultAvatar || ""} />
          <input type="hidden" name="user_type" value={userType} />

          {error && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <FieldGroup>

            {/* Avatar */}
            <Avatar className="mx-auto w-24 h-24">
              <AvatarImage src={DefaultAvatar || ""} />
              <AvatarFallback>{DefaultName?.charAt(0).toUpperCase() || "CN"}</AvatarFallback>
            </Avatar>

            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input id="name"
                name="name" type="text" placeholder="Antônio Silva"
                defaultValue={DefaultName || ""} required />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                defaultValue={DefaultEmail || ""}
                required
              />
              <FieldDescription>
                Usaremos este e-mail para entrar em contato com você. Não compartilharemos seu e-mail com ninguém.
              </FieldDescription>
            </Field>

            {/* Birthday */}
            <Field>
              <FieldLabel htmlFor="date">Data de nascimento</FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-start font-normal"
                  >
                    {date ? new Intl.DateTimeFormat('pt-BR').format(date) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            {/* Phone */}
            <Field>
              <FieldLabel htmlFor="phone">Telefone</FieldLabel>
              <MaskedInput mask="phone" id="phone" name="phone" type="text" placeholder="(11) 99999-9999" required />
            </Field>

            {/* User Type */}
            <Field>
              <FieldLabel htmlFor="user_type">Tipo de usuário</FieldLabel>
            </Field>
            <RadioGroup
              value={userType}
              onValueChange={setUserType}
              className="max-w-sm flex flex-row gap-2"
            >
              <FieldLabel htmlFor="plus-plan">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Pessoa Física</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="pf" id="plus-plan" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="pro-plan">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Pessoa Jurídica</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="pj" id="pro-plan" />
                </Field>
              </FieldLabel>
            </RadioGroup>


            {/* CPF - Only for PF */}
            {userType === "pf" && (
              <Field>
                <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                <MaskedInput mask="cpf" id="cpf" name="cpf" type="text" placeholder="123.456.789-00" required />
              </Field>
            )}

            {/* Company Info - Only for PJ */}
            {userType === "pj" && (
              <>
                <Field>
                  <FieldLabel htmlFor="company_name">Nome da empresa</FieldLabel>
                  <Input id="company_name" name="company_name" type="text" placeholder="Nome da empresa" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="company_cnpj">CNPJ da empresa</FieldLabel>
                  <MaskedInput mask="cnpj" id="company_cnpj" name="company_cnpj" type="text" placeholder="00.000.000/0000-00" required />
                </Field>
              </>
            )}

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input id="password" name="password" type="password" ref={passwordRef} required />
              <FieldDescription>
                Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar Senha
              </FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" ref={confirmPasswordRef} required />
              <FieldDescription>Por favor, confirme sua senha.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Criar Conta</Button>

                <FieldDescription className="text-center">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Faça login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
