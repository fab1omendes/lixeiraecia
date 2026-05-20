import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getProfileAction, updateProfileAction } from "@/lib/api/profile";

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
  const { status } = useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (status !== "authenticated") return;

      try {
        const data = await getProfileAction();
        setProfile(data);
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
  }, [status]);

  async function updateProfile(dataToSend: any) {
    if (status !== "authenticated") return { success: false, error: "No token" };

    try {
      const res = await updateProfileAction(dataToSend);
      if (res.success && res.data) {
        setProfile(res.data);
        return { success: true };
      } else {
        console.error("Erros do backend:", res.error);
        return { success: false, error: res.error };
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
