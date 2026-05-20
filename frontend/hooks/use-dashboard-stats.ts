'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getDashboardStats } from '@/lib/api/admin';

export interface DashboardStats {
  revenue: { value: number; trend: string };
  orders: { value: number; trend: string };
  users: { value: number; trend: string };
  low_stock: { value: number; trend: string };
}

export function useDashboardStats() {
  const { status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

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
