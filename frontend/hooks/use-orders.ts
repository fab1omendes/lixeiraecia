'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMyOrders } from '@/lib/api/orders';

export interface MyOrder {
  id: number;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
  };
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    product_id: number;
  }>;
}

export function useOrders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders
  };
}
