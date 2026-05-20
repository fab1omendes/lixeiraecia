'use client'

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  getAdminPromotions, 
  getAdminCoupons, 
  createPromotionAction, 
  createCouponAction, 
  deletePromotionAction 
} from '@/lib/api/admin';

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
  const { status } = useSession();
  const [promotions, setPromotions] = useState<PromotionAdmin[]>([]);
  const [coupons, setCoupons] = useState<CouponAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      const [promosData, couponsData] = await Promise.all([
        getAdminPromotions(),
        getAdminCoupons()
      ]);

      setPromotions(promosData);
      setCoupons(couponsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const createPromotion = async (data: any) => {
    if (status !== 'authenticated') return { success: false, error: 'Não autenticado' };
    
    try {
      const res = await createPromotionAction(data);
      if (!res.success) throw new Error(res.error || 'Erro ao criar promoção');
      fetchAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createCoupon = async (data: any) => {
    if (status !== 'authenticated') return { success: false, error: 'Não autenticado' };
    
    try {
      const res = await createCouponAction(data);
      if (!res.success) throw new Error(res.error || 'Erro ao criar cupom');
      fetchAll();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deletePromotion = async (id: number) => {
    if (status !== 'authenticated') return { success: false, error: 'Não autenticado' };
    
    try {
      const res = await deletePromotionAction(id);
      if (!res.success) throw new Error(res.error || 'Erro ao excluir promoção');
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
