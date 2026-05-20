import { useState } from "react";
import { changePasswordAction } from "@/lib/api/profile";

export function useSecurity() {
  const [loading, setLoading] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const res = await changePasswordAction(currentPassword, newPassword);
      return res;
    } catch (e) {
      console.error(e);
      return { success: false, error: "Erro interno do servidor" };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
}
