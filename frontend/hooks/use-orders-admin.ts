'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface OrderAdmin {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
  };
  total: number;
  status: string;
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export function useOrdersAdmin() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (statusFilter?: string) => {
    if (status !== 'authenticated' || !session) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`;
      if (statusFilter) url += `?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Token ${accessToken}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar pedidos');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    if (status !== 'authenticated' || !session) return { success: false };
    const accessToken = (session as any).accessToken;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${accessToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status');
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    updateStatus
  };
}
