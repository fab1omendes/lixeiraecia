'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface DashboardStats {
  revenue: { value: number; trend: string };
  orders: { value: number; trend: string };
  users: { value: number; trend: string };
  low_stock: { value: number; trend: string };
}

export function useDashboardStats() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (status !== 'authenticated' || !session) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Token ${accessToken}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar estatísticas do dashboard');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
}
