import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface UserProfileData {
  id: number;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  birthdate: string | null;
  user_type: string;
  company_name: string;
  company_cnpj: string;
  avatar: string;
}

export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (status !== "authenticated" || !session) return;
      const accessToken = (session as any).accessToken;
      if (!accessToken) return;

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/me", {
          headers: {
            "Authorization": `Token ${accessToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error(`Falha ao buscar perfil: ${res.status} ${res.statusText}`);
          const errorText = await res.text();
          console.error("Detalhes do erro:", errorText);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  async function updateProfile(dataToSend: any) {
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return { success: false, error: "No token" };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (res.ok) {
        const updatedData = await res.json();
        setProfile(updatedData);
        return { success: true };
      } else {
        const errors = await res.json();
        console.error("Erros do backend:", errors);
        return { success: false, error: errors };
      }
    } catch (error) {
      console.error("Erro na comunicação da API:", error);
      return { success: false, error };
    }
  }

  return {
    profile,
    loading,
    updateProfile
  };
}
