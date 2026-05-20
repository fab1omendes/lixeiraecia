import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { 
  getAddresses, 
  createAddressAction, 
  updateAddressAction, 
  deleteAddressAction 
} from "@/lib/api/addresses";

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

  const isAuthenticated = !!session;

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateAddress = async (id: number, data: any) => {
    const res = await updateAddressAction(id, data);
    if (res.success) {
      await fetchAddresses();
    }
    return res;
  };

  const deleteAddress = async (id: number) => {
    const res = await deleteAddressAction(id);
    if (res.success) {
      await fetchAddresses();
    }
    return res;
  };

  const createAddress = async (data: any) => {
    const res = await createAddressAction(data);
    if (res.success) {
      await fetchAddresses();
    }
    return res;
  };

  useEffect(() => {
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated, fetchAddresses]);

  return {
    addresses,
    loading,
    refetch: fetchAddresses,
    updateAddress,
    deleteAddress,
    createAddress,
    requiresAttention: !loading && addresses.length === 0
  };
}
