'use client'

import { useState, useCallback } from 'react';
import { getProductsAction, getCategoriesAction, getProductAction } from '@/lib/api/catalog';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url: string;
}

export function useCatalog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = useCallback(async (search?: string, category?: string) => {
    setLoading(true);
    try {
      const data = await getProductsAction(search, category);
      return data as Product[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoriesAction();
      return data as Category[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await getProductAction(id);
      return data as Product;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProducts,
    getCategories,
    getProduct
  };
}
