'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface PromotionAdmin {
  id: number;
  name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface CouponAdmin {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_value: number;
  max_uses: number | null;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export function usePromotionsAdmin() {
  const { data: session, status } = useSession();
  const [promotions, setPromotions] = useState<PromotionAdmin[]>([]);
  const [coupons, setCoupons] = useState<CouponAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (status !== 'authenticated' || !session) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      const [promosRes, couponsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promotions`, {
          headers: { 'Authorization': `Token ${accessToken}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/coupons`, {
          headers: { 'Authorization': `Token ${accessToken}` }
        })
      ]);

      if (!promosRes.ok || !couponsRes.ok) throw new Error('Erro ao buscar dados de promoções');
      
      const [promosData, couponsData] = await Promise.all([
        promosRes.json(),
        couponsRes.json()
      ]);

      setPromotions(promosData);
      setCoupons(couponsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  const createPromotion = async (data: any) => {
    const accessToken = (session as any)?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promotions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Erro ao criar promoção');
      fetchAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createCoupon = async (data: any) => {
    const accessToken = (session as any)?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Erro ao criar cupom');
      fetchAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deletePromotion = async (id: number) => {
    const accessToken = (session as any)?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${accessToken}` }
      });
      if (!res.ok) throw new Error('Erro ao excluir promoção');
      setPromotions(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAll();
    }
  }, [status, fetchAll]);

  return {
    promotions,
    coupons,
    loading,
    error,
    refresh: fetchAll,
    createPromotion,
    createCoupon,
    deletePromotion
  };
}
