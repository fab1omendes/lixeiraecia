"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MaskedInput } from "@/components/ui/masked-input";

export function ProfileForm() {
  const { data: session } = useSession();
  const { profile, loading, updateProfile } = useProfile();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [userType, setUserType] = useState("pf");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.birthdate) {
        setDate(new Date(profile.birthdate + "T00:00:00"));
      }
      setUserType(profile.user_type || "pf");
    }
  }, [profile]);

  const user = session?.user;

  const email = profile?.email || user?.email;
  const name = profile?.name || user?.name;
  const phone = profile?.phone || "";
  const cpf = profile?.cpf || "";
  const company_name = profile?.company_name || "";
  const company_cnpj = profile?.company_cnpj || "";
  const avatar = profile?.avatar || "";

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    extraData: { birthDate: string | null; userType: string }
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);

    const formData = {
      name: form.get("name"),
      phone: form.get("phone"),
      cpf: form.get("cpf"),
      company_name: form.get("company_name"),
      company_cnpj: form.get("company_cnpj"),
      birthdate: extraData.birthDate,
      user_type: extraData.userType,
    };

    // validação simples
    if (!formData.name) {
      setError("O nome é obrigatório.");
      setIsSubmitting(false);
      return;
    }

    const res = await updateProfile(formData);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } else {
      setError(typeof res.error === 'string' ? res.error : "Erro ao salvar as alterações. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Alertas */}
      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="font-medium">Alterações salvas com sucesso! Redirecionando...</p>
        </div>
      )}

      {error && !success && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          const birthDate = date ? date.toISOString().split("T")[0] : null;
          handleSubmit(e, { birthDate, userType });
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Avatar */}
          <div className="col-span-full flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback>
                {name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" disabled>
              Alterar imagem
            </Button>
          </div>


          {/* Nome */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={name || ""} />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={email || ""} disabled />
          </div>

          {/* Telefone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <MaskedInput
              mask="phone"
              id="phone"
              name="phone"
              defaultValue={phone}
            />
          </div>

          {/* Data nascimento */}
          <div className="grid gap-2">
            <Field>
              <FieldLabel>Data de nascimento</FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {date
                      ? new Intl.DateTimeFormat("pt-BR").format(date)
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      setDate(d);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>

          {/* Tipo usuário */}
          <div className="grid gap-2 col-span-full">
            <Label>Tipo de usuário</Label>
            <RadioGroup
              value={userType}
              onValueChange={setUserType}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pf" id="pf" />
                <Label htmlFor="pf">Pessoa Física</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pj" id="pj" />
                <Label htmlFor="pj">Pessoa Jurídica</Label>
              </div>
            </RadioGroup>
          </div>

          {/* CPF */}
          {userType === "pf" && (
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <MaskedInput
                mask="cpf"
                id="cpf"
                name="cpf"
                defaultValue={cpf}
                required
              />
            </div>
          )}

          {/* PJ */}
          {userType === "pj" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="company_name">Empresa</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  defaultValue={company_name}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company_cnpj">CNPJ</Label>
                <MaskedInput
                  mask="cnpj"
                  id="company_cnpj"
                  name="company_cnpj"
                  defaultValue={company_cnpj}
                  required
                />
              </div>
            </>
          )}
        </div>

        {/* Botão */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || success}
            className="bg-blue-500 hover:bg-blue-600 min-w-[160px] h-12 font-semibold disabled:opacity-70 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : success ? (
              "Salvo!"
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}