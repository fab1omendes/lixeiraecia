import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface Address {
  id: number;
  name: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  is_billing: boolean;
  contact_name: string;
  contact_phone: string;
}

export function useAddresses() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const token = (session as any)?.accessToken;

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: {
          "Authorization": `Token ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateAddress = async (id: number, data: any) => {
    if (!token) return { success: false, error: "No token" };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAddresses();
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  };

  const deleteAddress = async (id: number) => {
    if (!token) return { success: false, error: "No token" };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}/delete`, {
        method: "DELETE",
        headers: { "Authorization": `Token ${token}` },
      });
      if (res.ok) {
        await fetchAddresses();
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  };

  const createAddress = async (data: any) => {
    if (!token) return { success: false, error: "No token" };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAddresses();
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err };
      }
    } catch (e) {
      return { success: false, error: e };
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token, fetchAddresses]);

  return {
    addresses,
    loading,
    refetch: fetchAddresses,
    token,
    updateAddress,
    deleteAddress,
    createAddress,
    requiresAttention: !loading && addresses.length === 0
  };
}
