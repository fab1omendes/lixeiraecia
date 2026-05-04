import { useState } from "react";
import { useSession } from "next-auth/react";

export function useSecurity() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const token = (session as any)?.accessToken;

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) return { success: false, error: "Token de acesso não encontrado. Faça login novamente." };

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (res.ok) {
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.detail || "Erro ao alterar senha" };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: "Erro de conexão com o servidor" };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
}
