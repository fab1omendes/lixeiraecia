'use client'

import { useState, useCallback } from 'react';

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

  const getProducts = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products`;
      if (search) url += `?search=${encodeURIComponent(search)}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      return await res.json() as Product[];
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      return await res.json() as Category[];
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      if (!res.ok) throw new Error("Produto não encontrado");
      return await res.json() as Product;
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
