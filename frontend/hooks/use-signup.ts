import { useState } from "react";
import { signIn } from "next-auth/react";

export function useSignup() {
  const [loading, setLoading] = useState(false);

  // O customData recebe as coisas que não estão nos inputs nativos, como a 'date' do calendário
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, customData?: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("name") as string;
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    const formattedBirthDate = customData?.birthDate ? customData.birthDate : null;

    const dataToSend = {
      username: email,
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      photo: formData.get("image") || null,
      birth_date: formattedBirthDate,
      cpf: formData.get("cpf") || "",
      // Phone
      phone: formData.get("phone") || "",
      secondary_phone: formData.get("secondary_phone") || "",
      // Principal Address
      principal_address: formData.get("principal_address") || "",
      principal_address_type: formData.get("principal_address_type") || "",
      principal_address_number: formData.get("principal_address_number") || "",
      principal_address_complement: formData.get("principal_address_complement") || "",
      principal_address_neighborhood: formData.get("principal_address_neighborhood") || "",
      principal_city: formData.get("principal_city") || "",
      principal_state: formData.get("principal_state") || "",
      principal_zip_code: formData.get("principal_zip_code") || "",
      principal_country: formData.get("principal_country") || "",
      // Secondary Address
      secondary_address: formData.get("secondary_address") || "",
      secondary_address_type: formData.get("secondary_address_type") || "",
      secondary_address_number: formData.get("secondary_address_number") || "",
      secondary_address_complement: formData.get("secondary_address_complement") || "",
      secondary_address_neighborhood: formData.get("secondary_address_neighborhood") || "",
      secondary_city: formData.get("secondary_city") || "",
      secondary_state: formData.get("secondary_state") || "",
      secondary_zip_code: formData.get("secondary_zip_code") || "",
      secondary_country: formData.get("secondary_country") || "", 
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      if (res.ok) {
        // Se a conta for criada, fazemos login automático
        const loginRes = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false
        });

        if (loginRes?.ok) {
          window.location.href = "/account"; 
        } else {
          alert('Conta criada mas falha ao logar automaticamente.');
        }
      } else {
        const errors = await res.json();
        console.error("Erros do backend:", errors);
        alert('Erro ao criar conta, verifique se o e-mail já existe.');
      }
    } catch (error) {
      console.error("Erro na comunicação da API:", error);
    } finally {
      setLoading(false);
    }
  }

  // O Hook "retorna" a função e o loading para quem for usá-lo
  return {
    handleSubmit,
    loading
  };
}
