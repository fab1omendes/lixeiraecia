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

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token, fetchAddresses]);

  return { addresses, loading, refetch: fetchAddresses, token };
}
