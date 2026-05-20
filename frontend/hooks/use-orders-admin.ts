'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAdminOrders, updateOrderStatusAction } from '@/lib/api/orders';

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
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const data = await getAdminOrders(statusFilter);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    if (status !== 'authenticated') return { success: false };

    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (!res.success) throw new Error(res.error || 'Erro ao atualizar status');
      
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
